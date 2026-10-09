import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus, Download, AlertCircle } from "lucide-react";
import { siteSettings } from "@/lib/content";
import type { BookingSummary } from "@/lib/booking";
import { decodeSummary } from "@/lib/booking-server";
import { verifyTransaction } from "@/lib/paystack";
import { addDays, formatDate, formatNaira } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { BadgeSeal } from "@/components/BadgeSeal";
import { ButtonLink } from "@/components/Button";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Booking confirmation",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

async function loadBooking(sp: Record<string, string | string[] | undefined>): Promise<
  { booking: BookingSummary } | { failed: "payment"; reference: string } | null
> {
  const reference = one(sp.reference) || one(sp.trxref);
  if (reference) {
    // Returned from Paystack: verify server-side before showing "paid".
    const tx = await verifyTransaction(reference);
    const meta = tx?.metadata as { booking?: BookingSummary } | null;
    if (!tx || !meta?.booking || meta.booking.ref !== reference) return { failed: "payment", reference };
    if (tx.status !== "success") return { failed: "payment", reference };
    return { booking: { ...meta.booking, paymentStatus: "paid", amountPaid: tx.amount / 100 } };
  }
  const booking = decodeSummary(one(sp.b));
  return booking ? { booking } : null;
}

const ics = (d: string) => d.replace(/-/g, "");

function calendarLinks(b: BookingSummary) {
  const s = siteSettings;
  const title = `Stay at ${s.name} (${b.ref})`;
  const location = s.mapQuery;
  const details = `${b.roomName}. Booking reference ${b.ref}. Check-in from ${s.checkInTime}, check-out by ${s.checkOutTime}. Questions: ${s.phone}`;
  // All-day event: DTEND is exclusive, so check-out day is included.
  const end = addDays(b.checkOut, 1);
  const google = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${ics(b.checkIn)}/${ics(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
  const file = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Unicorn Haven Edge Hotel//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${b.ref}@unicornhavenedgehotel.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART;VALUE=DATE:${ics(b.checkIn)}`,
    `DTEND;VALUE=DATE:${ics(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${location.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${details.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { google, icsHref: `data:text/calendar;charset=utf-8,${encodeURIComponent(file)}` };
}

export default async function ConfirmationPage({ searchParams }: { searchParams: SP }) {
  const result = await loadBooking(await searchParams);

  if (!result) {
    return (
      <Shell>
        <h1 className="text-3xl">We couldn&rsquo;t find that booking</h1>
        <p className="mt-4 max-w-prose text-stone-deep">
          This confirmation link is incomplete or has expired. Your booking details are in the email we sent you. If you
          can&rsquo;t find it, message us and we&rsquo;ll look it up.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={whatsappLink("Hi, I need help finding my booking confirmation.")}>
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </ButtonLink>
          <ButtonLink href="/book" variant="secondary">Start a new booking</ButtonLink>
        </div>
      </Shell>
    );
  }

  if ("failed" in result) {
    return (
      <Shell>
        <p className="flex items-center gap-2 text-sm font-semibold text-red-800">
          <AlertCircle aria-hidden className="h-4 w-4" /> Payment not completed
        </p>
        <h1 className="mt-3 text-3xl">Your payment didn&rsquo;t go through</h1>
        <p className="mt-4 max-w-prose text-stone-deep">
          No money has been taken for reference <strong className="text-ink">{result.reference}</strong>. You can try again,
          choose to pay at the hotel, or message us and we&rsquo;ll help you finish your booking.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/book">Try again</ButtonLink>
          <ButtonLink href={whatsappLink(`Hi, my payment for booking ${result.reference} didn't go through. Can you help?`)} variant="secondary">
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </ButtonLink>
        </div>
      </Shell>
    );
  }

  const b = result.booking;
  const { google, icsHref } = calendarLinks(b);
  const paid = b.paymentStatus === "paid";

  return (
    <Shell>
      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <p className="text-sm font-semibold text-mangrove">{paid ? "Booking received and paid" : "Booking request received"}</p>
          <h1 className="mt-3 text-3xl md:text-4xl">Thank you, {b.guestName.split(" ")[0]}.</h1>
          <p className="mt-4 max-w-prose text-lg text-stone-deep">
            Your reference is <strong className="whitespace-nowrap font-semibold text-ink">{b.ref}</strong>. We&rsquo;ve emailed
            you a copy, and our reservations team will be in touch shortly to confirm availability.
          </p>
        </div>
        <div className="seal-stamp mx-auto w-36 text-mangrove md:w-44" aria-hidden>
          <BadgeSeal title="" className="h-full w-full" />
        </div>
      </div>

      <dl className="mt-12 grid gap-px overflow-hidden border border-mist bg-mist sm:grid-cols-2">
        <Item label="Room">{b.roomName}</Item>
        <Item label="Guests">
          {b.adults} adult{b.adults > 1 ? "s" : ""}
          {b.children ? `, ${b.children} child${b.children > 1 ? "ren" : ""}` : ""}
        </Item>
        <Item label="Check-in">
          {formatDate(b.checkIn)}
          <span className="block text-sm text-stone-deep">From {siteSettings.checkInTime}</span>
        </Item>
        <Item label="Check-out">
          {formatDate(b.checkOut)}
          <span className="block text-sm text-stone-deep">By {siteSettings.checkOutTime}</span>
        </Item>
        <Item label="Total">
          {b.total === null ? "Confirmed by reservations" : formatNaira(b.total)}
          {b.nights > 0 && <span className="block text-sm text-stone-deep">{b.nights} night{b.nights > 1 ? "s" : ""}</span>}
        </Item>
        <Item label="Payment">
          {paid
            ? `Paid ${formatNaira(b.amountPaid ?? 0)} with Paystack`
            : b.payment === "hotel"
              ? "Pay at the hotel on arrival"
              : "We'll confirm the rate and payment with you"}
        </Item>
      </dl>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={google} variant="secondary">
          <CalendarPlus aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Add to Google Calendar
        </ButtonLink>
        <a href={icsHref} download={`${b.ref}.ics`} className="inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-current px-5 py-3 text-sm font-semibold hover:bg-ink hover:text-porcelain">
          <Download aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Download calendar file
        </a>
        <ButtonLink href={whatsappLink(`Hi, I've just booked ${b.ref} (${b.roomName}, ${formatDate(b.checkIn)}).`)}>
          <WhatsAppIcon className="h-4 w-4" /> Message us on WhatsApp
        </ButtonLink>
      </div>

      <p className="mt-12 text-sm text-stone-deep">
        Need to change something? Reply to your confirmation email or call {siteSettings.phone}.{" "}
        <Link href="/terms" className="underline underline-offset-4">Booking terms</Link>
      </p>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-section-sm pt-[120px] md:pb-section">
      <div className="container-site max-w-4xl">{children}</div>
    </div>
  );
}

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-5">
      <dt className="text-sm text-stone-deep">{label}</dt>
      <dd className="mt-1 font-semibold">{children}</dd>
    </div>
  );
}
