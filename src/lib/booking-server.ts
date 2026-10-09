import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import type { BookingSummary } from "./booking";
import { formatDate, formatNaira } from "./format";
import { siteSettings } from "./content";
import { sendEmail, RESERVATIONS_EMAIL } from "./email";

const SECRET = process.env.BOOKING_SECRET || "dev-only-booking-secret-change-me";
if (!process.env.BOOKING_SECRET && process.env.NODE_ENV === "production") {
  console.warn("[booking] BOOKING_SECRET is not set; confirmation links use a development secret.");
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I

/** UHE-YYMMDD-XXXX, dated in Lagos time. */
export function bookingRef(now = new Date()) {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(now).split("-");
  const suffix = Array.from({ length: 4 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `UHE-${y.slice(2)}${m}${d}-${suffix}`;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");
const sign = (payload: string) => createHmac("sha256", SECRET).update(payload).digest("base64url");

/** Signed, tamper-evident token for the confirmation URL. */
export function encodeSummary(summary: BookingSummary) {
  const payload = b64(JSON.stringify(summary));
  return `${payload}.${sign(payload)}`;
}

export function decodeSummary(token: string | undefined): BookingSummary | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

export type GuestContact = { name: string; email: string; phone: string; requests?: string };

function summaryText(b: BookingSummary, guest: GuestContact, payment?: { amount: number; channel?: string; reference?: string; paidAt?: string | null }) {
  const lines = [
    `Booking reference: ${b.ref}`,
    `Room: ${b.roomName}`,
    `Check-in: ${formatDate(b.checkIn)} (from ${siteSettings.checkInTime})`,
    `Check-out: ${formatDate(b.checkOut)} (by ${siteSettings.checkOutTime})`,
    `Nights: ${b.nights}`,
    `Guests: ${b.adults} adult${b.adults > 1 ? "s" : ""}${b.children ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""}`,
    `Arrival time: ${b.arrivalTime}`,
    b.promo ? `Promo code: ${b.promo} (−${formatNaira(b.discount)})` : "",
    `Total: ${b.total === null ? "To be confirmed by reservations" : formatNaira(b.total)}`,
    payment
      ? `Paid: ${formatNaira(payment.amount)} via Paystack${payment.channel ? ` (${payment.channel})` : ""}${payment.reference ? `, ref ${payment.reference}` : ""}`
      : `Payment: ${b.payment === "hotel" ? "Pay at the hotel" : "To be arranged with reservations"}`,
  ].filter(Boolean);
  return `${lines.join("\n")}\n\nGuest: ${guest.name}\nEmail: ${guest.email}\nPhone: ${guest.phone}\nSpecial requests: ${guest.requests || "—"}`;
}

export async function sendBookingEmails(
  b: BookingSummary,
  guest: GuestContact,
  payment?: { amount: number; channel?: string; reference?: string; paidAt?: string | null }
) {
  const details = summaryText(b, guest, payment);
  const s = siteSettings;
  await Promise.all([
    sendEmail({
      to: RESERVATIONS_EMAIL,
      replyTo: guest.email,
      subject: `${payment ? "PAID booking" : "Booking request"} ${b.ref}: ${b.roomName}, ${formatDate(b.checkIn)}`,
      text: `New booking from the website. Please confirm availability with the guest.\n\n${details}${
        payment?.paidAt ? `\nPaid at: ${payment.paidAt}` : ""
      }\nCreated: ${b.createdAt}`,
    }),
    sendEmail({
      to: guest.email,
      subject: `Your booking request ${b.ref} at ${s.name}`,
      text: `Hi ${guest.name.split(" ")[0]},\n\nThank you for choosing ${s.name}. We've received your ${
        payment ? "booking and payment" : "booking request"
      }. Our reservations team will be in touch shortly to confirm availability.\n\n${details}\n\nWhere to find us: ${s.address.street}, ${s.address.city}. Look for the yellow "30" sign at the gate.\nQuestions? Call ${s.phone} or reply to this email.\n\n${s.name}`,
    }),
  ]);
}
