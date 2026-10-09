"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { getRoom, offersForBooking, siteSettings } from "@/lib/content";
import { ARRIVAL_TIMES, findPromo, quoteStay, type BookingSummary } from "@/lib/booking";
import { bookingRef, encodeSummary, sendBookingEmails } from "@/lib/booking-server";
import { initializeTransaction, paystackEnabled } from "@/lib/paystack";
import { rateLimited } from "@/lib/rate-limit";
import { emailSchema, fieldErrors, phoneSchema } from "@/lib/validation";
import { isoDate } from "@/lib/format";

const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date.");

const bookingSchema = z
  .object({
    checkIn: isoDay,
    checkOut: isoDay,
    adults: z.coerce.number().int().min(1).max(6),
    children: z.coerce.number().int().min(0).max(4),
    room: z.string().min(1, "Choose a room."),
    promo: z.string().trim().max(40).optional(),
    name: z.string().trim().min(2, "Enter your full name."),
    email: emailSchema,
    phone: phoneSchema,
    arrivalTime: z.enum(ARRIVAL_TIMES),
    requests: z.string().trim().max(500, "Keep special requests under 500 characters.").optional(),
    payment: z.enum(["paystack-full", "paystack-deposit", "hotel"]),
    company_website: z.string().max(0).optional(),
  })
  .refine((d) => d.checkOut > d.checkIn, { path: ["checkOut"], message: "Check-out must be after check-in." });

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingResult = { ok: true; redirect: string } | { ok: false; message: string; errors?: Record<string, string> };

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");
  return host ? `${proto}://${host}` : process.env.NEXT_PUBLIC_SITE_URL || "";
}

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  if (await rateLimited("booking", 8))
    return { ok: false, message: "Too many booking attempts from this connection. Please wait a few minutes or message us on WhatsApp." };

  const parsed = bookingSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Please check your details.", errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  if (d.checkIn < isoDate(new Date())) return { ok: false, message: "Check-in can't be in the past.", errors: { checkIn: "Choose today or a later date." } };

  const room = await getRoom(d.room);
  if (!room) return { ok: false, message: "That room is no longer available. Please choose another.", errors: { room: "Choose a room." } };
  if (d.adults + d.children > room.maxGuests)
    return { ok: false, message: `The ${room.name} sleeps up to ${room.maxGuests}. Please choose a larger room or reduce guests.` };

  // Always price on the server.
  const offer = findPromo(offersForBooking(), d.promo, d.checkIn);
  const q = quoteStay(room, d.checkIn, d.checkOut, offer?.discountPercent ?? 0);
  const deposit = siteSettings.booking.depositPercent;

  let payment: BookingSummary["payment"] = d.payment;
  if (q.total === null) payment = "request"; // rate not confirmed: reservations will quote
  if (payment === "hotel" && !siteSettings.booking.allowPayAtHotel) return { ok: false, message: "Please choose an online payment option." };
  if (payment === "paystack-deposit" && !deposit) payment = "paystack-full";

  const summary: BookingSummary = {
    ref: bookingRef(),
    room: room.slug,
    roomName: room.name,
    checkIn: d.checkIn,
    checkOut: d.checkOut,
    nights: q.nights,
    adults: d.adults,
    children: d.children,
    guestName: d.name,
    arrivalTime: d.arrivalTime,
    total: q.total,
    discount: q.discount,
    promo: offer?.promoCode,
    payment,
    paymentStatus: "unpaid",
    createdAt: new Date().toISOString(),
  };
  const guest = { name: d.name, email: d.email, phone: d.phone, requests: d.requests };

  if ((payment === "paystack-full" || payment === "paystack-deposit") && q.total !== null) {
    if (!paystackEnabled()) return { ok: false, message: "Online payment isn't available yet. Please choose “Pay at the hotel”." };
    const amount = payment === "paystack-deposit" && deposit ? Math.round((q.total * deposit) / 100) : q.total;
    const init = await initializeTransaction({
      email: d.email,
      amountKobo: amount * 100,
      reference: summary.ref,
      callbackUrl: `${await origin()}/book/confirmation`,
      // Read back by the confirmation page and the webhook.
      metadata: { booking: { ...summary, amountPaid: amount, paymentStatus: "pending" }, guest },
    });
    if ("error" in init) return { ok: false, message: `${init.error} You can try again or choose “Pay at the hotel”.` };
    return { ok: true, redirect: init.authorizationUrl };
  }

  await sendBookingEmails(summary, guest);
  return { ok: true, redirect: `/book/confirmation?b=${encodeSummary(summary)}` };
}
