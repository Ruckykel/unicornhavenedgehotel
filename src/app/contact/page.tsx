import type { Metadata } from "next";
import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { getFaqs, landmarks, siteSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/whatsapp";
import { directionsUrl } from "@/lib/maps";
import { faqSchema } from "@/lib/schema";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { MapBlock } from "@/components/MapBlock";
import { FAQAccordion } from "@/components/FAQAccordion";
import { ButtonLink } from "@/components/Button";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Unicorn Haven Edge Hotel, 30 Elelenwo Street, Port Harcourt. Call, WhatsApp or email reservations, get directions, and read answers to common questions.",
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact", images: ["/media/spaces/street-sign.jpg"] },
};

export default async function ContactPage() {
  const faqs = await getFaqs();
  const s = siteSettings;

  return (
    <>
      <JsonLd data={faqSchema(faqs)} />
      <PageHero
        title="Contact us"
        intro="Call, message or write. Reception is always happy to help."
        image={{
          src: "/media/spaces/street-sign.jpg",
          alt: "The yellow number 30 street sign outside the hotel gate",
        }}
        position="center 40%"
      />

      <section className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-4">
            <h2 className="text-2xl">Get in touch</h2>
            <ul className="mt-8 space-y-6">
              <li>
                <a href={s.phoneHref} className="group flex gap-4">
                  <Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-mangrove" strokeWidth={1.5} />
                  <span>
                    <span className="block text-sm text-stone-deep">Phone</span>
                    <span className="text-lg group-hover:underline">{s.phone}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hi, I'd like to enquire about the hotel.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex gap-4"
                >
                  <WhatsAppIcon className="mt-1 h-5 w-5 shrink-0 text-mangrove" />
                  <span>
                    <span className="block text-sm text-stone-deep">WhatsApp</span>
                    <span className="text-lg group-hover:underline">Chat with reservations</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${s.email}`} className="group flex gap-4">
                  <Mail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-mangrove" strokeWidth={1.5} />
                  <span className="min-w-0">
                    <span className="block text-sm text-stone-deep">Email</span>
                    <span className="block text-lg [overflow-wrap:anywhere] group-hover:underline">
                      {s.email.split("@")[0]}@<wbr />
                      {s.email.split("@")[1]}
                    </span>
                  </span>
                </a>
              </li>
              <li className="flex gap-4">
                <MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-mangrove" strokeWidth={1.5} />
                <address className="not-italic">
                  <span className="block text-sm text-stone-deep">Address</span>
                  <span className="text-lg">
                    {s.address.street}, {s.address.area},
                    <br />
                    {s.address.city}, {s.address.state}
                  </span>
                </address>
              </li>
              <li className="flex gap-4">
                <Clock aria-hidden className="mt-1 h-5 w-5 shrink-0 text-mangrove" strokeWidth={1.5} />
                <span>
                  <span className="block text-sm text-stone-deep">Reception</span>
                  <span className="text-lg">{s.receptionHours}</span>
                </span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <h2 className="text-2xl">Send a message</h2>
            <p className="mb-8 mt-3 text-stone-deep">For same-day bookings, WhatsApp is fastest.</p>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="directions-title">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="directions-title" className="text-2xl md:text-3xl">
              Directions
            </h2>
            <p className="mt-4 max-w-prose text-stone-deep">
              We&rsquo;re at {s.address.street} in {s.address.area}, Port Harcourt. Look for the yellow &ldquo;30&rdquo; sign at
              the gate; parking is inside the courtyard.
            </p>
            {landmarks.length > 0 && (
              <dl className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
                {landmarks.map((l) => (
                  <div key={l.name} className="flex justify-between gap-4 py-3">
                    <dt>{l.name}</dt>
                    <dd className="text-stone-deep">{l.driveTime}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ButtonLink href={directionsUrl()} variant="secondary" className="mt-8">
              <Navigation aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Get directions
            </ButtonLink>
          </div>
          <div className="lg:col-span-8">
            <MapBlock className="aspect-[4/3] w-full md:aspect-[16/9]" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-title">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="faq-title" className="text-2xl md:text-3xl">
              Questions guests ask
            </h2>
          </div>
          <div className="lg:col-span-8">
            <FAQAccordion faqs={faqs} />
          </div>
        </div>
      </section>
    </>
  );
}
