import type { Metadata } from "next";
import { siteSettings } from "@/lib/content";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Booking terms & cancellation policy",
  description: "Booking terms, payment and cancellation policy for Unicorn Haven Edge Hotel, Port Harcourt.",
  alternates: { canonical: "/terms" },
};

// TODO(content): the hotel must confirm deposit, cancellation, no-show,
// children, extra-bed and smoking policies. Sections marked below.
export default function TermsPage() {
  const s = siteSettings;
  return (
    <LegalPage title="Booking terms and cancellation policy" updated="October 2026">
      <section>
        <h2>Booking requests</h2>
        <p>
          Bookings made on this website are requests until our reservations team confirms availability with you by email,
          phone or WhatsApp. Each booking has a reference in the format UHE-YYMMDD-XXXX; please quote it when you contact us.
        </p>
      </section>
      <section>
        <h2>Check-in and check-out</h2>
        <ul>
          <li>Check-in is from {s.checkInTime}. Check-out is by {s.checkOutTime}.</li>
          <li>Every guest checking in must show a valid government-issued photo ID.</li>
          <li>Early check-in and late check-out depend on availability. Please ask in advance.</li>
        </ul>
      </section>
      <section>
        <h2>Prices and payment</h2>
        <ul>
          <li>Prices are per room, per night, in Nigerian naira.</li>
          <li>You can pay online through Paystack (card, bank transfer or USSD) or, where offered, at the hotel on arrival.</li>
          {/* TODO(content): confirm refund commitment */}
          <li>If your payment is taken online and we cannot confirm your room, we will refund you in full.</li>
        </ul>
      </section>
      {/* TODO(content): cancellation and no-show policy */}
      <section>
        <h2>Changes and cancellations</h2>
        <p>
          If your plans change, contact reservations as early as possible on {s.phone} or {s.email}. The cancellation terms
          that apply to your booking are confirmed by our team when your booking is confirmed.
        </p>
      </section>
      <section>
        <h2>During your stay</h2>
        <ul>
          <li>Please treat rooms and shared spaces with care. Damage beyond normal wear may be charged.</li>
          <li>Let us know about extra beds, children&rsquo;s needs or accessibility requirements when you book.</li>
        </ul>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          {s.name}, {s.address.street}, {s.address.city}. Phone {s.phone}, email {s.email}.
        </p>
      </section>
    </LegalPage>
  );
}
