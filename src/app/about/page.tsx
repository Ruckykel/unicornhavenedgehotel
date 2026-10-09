import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAmenities, siteSettings } from "@/lib/content";
import type { AmenityGroup } from "@/lib/types";
import { PageHero } from "@/components/PageHero";
import { CircleImage } from "@/components/CircleImage";
import { SmartImage } from "@/components/SmartImage";
import { AmenityIcon } from "@/components/icons";
import { FinalCta } from "@/components/FinalCta";

export const metadata: Metadata = {
  title: "The hotel",
  description:
    "About Unicorn Haven Edge Hotel on Elelenwo Street, Port Harcourt: a small, secure hotel with 24/7 power, fast Wi-Fi, a restaurant and secure parking.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", images: ["/media/spaces/exterior-facade.jpg"] },
};

const GROUPS: { group: AmenityGroup; intro: string }[] = [
  { group: "Rooms", intro: "Comfortable, cool and quiet." },
  { group: "Business", intro: "Set up to get work done." },
  { group: "Leisure", intro: "Somewhere to unwind." },
  { group: "Safety", intro: "Peace of mind, day and night." },
];

export default async function AboutPage() {
  const amenities = await getAmenities();
  const s = siteSettings;

  return (
    <>
      <PageHero
        title="A small hotel, looked after properly"
        intro="Unicorn Haven Edge sits behind a secure gate on Elelenwo Street, Port Harcourt."
        image={{
          src: "/media/spaces/exterior-facade.jpg",
          alt: "The hotel's slate-grey facade with a timber entrance porch, planters and blue lounge chairs",
        }}
      />

      {/* TODO(content): story copy below is drafted for the client to approve or replace. */}
      <section className="section">
        <div className="container-site grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <h2 className="text-2xl md:text-3xl">Our story</h2>
            <div className="prose-hotel mt-6 max-w-prose text-lg text-stone-deep">
              <p>
                We built Unicorn Haven Edge for people who come to Port Harcourt to get things done, and for those who
                come to rest. Both want the same things: a room that&rsquo;s clean and cool, power that never cuts out,
                and a gate that keeps the world outside.
              </p>
              <p>
                The details are ours. A timber porch to welcome you in. Velvet, marble and soft light in the rooms. A
                lounge where the match is on and dinner is a few steps away. We call it a home away from home, and we
                work hard to make it feel that way.
              </p>
            </div>
          </div>
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
            <CircleImage
              src="/media/spaces/reception.jpg"
              alt="Reception desk under a lit ceiling, with a glowing round feature light and lounge chairs"
              className="mx-auto w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3" aria-label="Around the hotel">
        {[
          { src: "/media/spaces/glass-entrance.jpg", alt: "Glass entrance under a shingle canopy, flanked by potted palms" },
          { src: "/media/spaces/corridor.jpg", alt: "Upstairs corridor with marble-effect walls and a black room door" },
          { src: "/media/spaces/courtyard-parking.jpg", alt: "Paved courtyard with parked cars in front of the hotel" },
        ].map((img) => (
          <div key={img.src} className="relative aspect-[4/3] md:aspect-[4/5]">
            <SmartImage src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
        ))}
      </section>

      <section className="section" aria-labelledby="amenities-title">
        <div className="container-site">
          <h2 id="amenities-title" className="text-2xl md:text-3xl">
            Amenities and services
          </h2>
          <div className="mt-12 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map(({ group, intro }) => {
              const items = amenities.filter((a) => a.group === group);
              if (!items.length) return null;
              return (
                <div key={group}>
                  <h3 className="border-b border-ink pb-3 text-xl">{group}</h3>
                  <p className="mt-3 text-sm text-stone-deep">{intro}</p>
                  <ul className="mt-5 space-y-4">
                    {items.map((a) => (
                      <li key={a.name} className="flex items-center gap-3">
                        <AmenityIcon name={a.icon} className="h-5 w-5 shrink-0 text-mangrove" />
                        {a.name}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TODO(content): optional management note with photo goes here. */}

      <section className="section bg-mist" aria-labelledby="policies-title">
        <div className="container-site grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 id="policies-title" className="text-2xl md:text-3xl">
              Policies at a glance
            </h2>
          </div>
          <div className="md:col-span-8">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Check-in</dt>
                <dd className="mt-1 text-stone-deep">From {s.checkInTime}</dd>
              </div>
              <div>
                <dt className="font-semibold">Check-out</dt>
                <dd className="mt-1 text-stone-deep">By {s.checkOutTime}</dd>
              </div>
              <div>
                <dt className="font-semibold">Identification</dt>
                <dd className="mt-1 text-stone-deep">A valid photo ID is required at check-in</dd>
              </div>
              <div>
                <dt className="font-semibold">Payment</dt>
                <dd className="mt-1 text-stone-deep">Card, bank transfer and USSD online, or pay at the hotel</dd>
              </div>
            </dl>
            <Link href="/terms" className="link-underline mt-8 inline-flex items-center gap-2 font-semibold">
              Full booking terms and cancellation policy <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
