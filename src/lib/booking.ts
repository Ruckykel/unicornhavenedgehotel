// Booking pricing shared by the booking flow (client) and the server action,
// which always recomputes totals itself.
import { addDays, nightsBetween } from "./format";
import type { Offer } from "./types";

export type PricedRoom = { priceFrom: number | null; weekendPrice?: number | null };

export type Quote = {
  nights: number;
  subtotal: number | null;
  discount: number;
  total: number | null;
};

/** Friday and Saturday nights use the weekend rate when one is set. */
export function quoteStay(room: PricedRoom, checkIn: string, checkOut: string, discountPercent = 0): Quote {
  const nights = nightsBetween(checkIn, checkOut);
  if (room.priceFrom === null || nights < 1) return { nights, subtotal: null, discount: 0, total: null };
  let subtotal = 0;
  for (let i = 0; i < nights; i++) {
    const day = new Date(`${addDays(checkIn, i)}T00:00:00Z`).getUTCDay();
    const weekend = day === 5 || day === 6;
    subtotal += weekend && room.weekendPrice ? room.weekendPrice : room.priceFrom;
  }
  const discount = Math.round((subtotal * discountPercent) / 100);
  return { nights, subtotal, discount, total: subtotal - discount };
}

/** A promo code is valid if an offer uses it and check-in falls within the offer dates. */
export function findPromo(offers: Offer[], code: string | undefined, checkIn: string) {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return (
    offers.find(
      (o) => o.promoCode?.toUpperCase() === c && o.discountPercent && checkIn >= o.validFrom && checkIn <= o.validTo
    ) ?? null
  );
}

export const ARRIVAL_TIMES = [
  "Not sure yet",
  "Before 12:00",
  "12:00 – 15:00",
  "15:00 – 18:00",
  "18:00 – 21:00",
  "After 21:00",
] as const;

export type PaymentMethod = "paystack-full" | "paystack-deposit" | "hotel";

/** What the confirmation page needs. Deliberately excludes email and phone (it travels in a URL). */
export type BookingSummary = {
  ref: string;
  room: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  guestName: string;
  arrivalTime: string;
  total: number | null;
  discount: number;
  promo?: string;
  payment: PaymentMethod | "request";
  amountPaid?: number;
  paymentStatus: "paid" | "unpaid" | "pending";
  createdAt: string;
};
