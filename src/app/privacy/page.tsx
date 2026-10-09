import type { Metadata } from "next";
import { siteSettings } from "@/lib/content";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Unicorn Haven Edge Hotel collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

// TODO(content): have the hotel (and ideally a lawyer) review this draft for
// the Nigeria Data Protection Act 2023 before launch.
export default function PrivacyPage() {
  const s = siteSettings;
  return (
    <LegalPage title="Privacy policy" updated="October 2026">
      <section>
        <p>
          {s.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what personal information we
          collect through this website, why, and the choices you have. We process personal data in line with the Nigeria
          Data Protection Act 2023.
        </p>
      </section>
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Booking details: your name, email, phone number, stay dates, guests, arrival time and any special requests.</li>
          <li>Enquiries: the details you enter in our contact and corporate rate forms.</li>
          <li>Newsletter: your email address, if you choose to sign up.</li>
          <li>Payments: handled by Paystack. We never see or store your full card details.</li>
          <li>Usage data: if analytics are enabled, anonymous information about how pages are used (Google Analytics) and, for advertising, the Meta Pixel.</li>
        </ul>
      </section>
      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To handle your booking, confirm availability and contact you about your stay.</li>
          <li>To reply to your enquiries.</li>
          <li>To send occasional offers, only if you&rsquo;ve signed up. Every email includes a way to unsubscribe.</li>
          <li>To meet legal requirements, such as guest registration.</li>
        </ul>
      </section>
      <section>
        <h2>Who we share it with</h2>
        <p>
          We share only what&rsquo;s needed with the services that run this website: Paystack (payments), our email provider
          (booking and enquiry emails), and our website host. We do not sell your personal information.
        </p>
      </section>
      <section>
        <h2>How long we keep it</h2>
        {/* TODO(content): confirm retention periods */}
        <p>We keep booking records for as long as needed for accounting and legal purposes, and enquiries for up to two years.</p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the personal information we hold about you, or withdraw consent for
          marketing at any time. Email {s.email} and we&rsquo;ll respond within 30 days.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          {s.name}, {s.address.street}, {s.address.city}, {s.address.state}. Email {s.email} or call {s.phone}.
        </p>
      </section>
    </LegalPage>
  );
}
