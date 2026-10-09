import type { Metadata } from "next";
import Link from "next/link";
import { getOffers, getRooms } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { PageHero } from "@/components/PageHero";
import { PriceTag } from "@/components/PriceTag";
import { SmartImage } from "@/components/SmartImage";
import { ButtonLink } from "@/components/Button";
import { CorporateForm } from "@/components/CorporateForm";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Offers & rates",
  description:
    "Room rates, current offers, and corporate and long-stay rates at Unicorn Haven Edge Hotel, Port Harcourt. Book direct or request a corporate quote.",
  alternates: { canonical: "/offers" },
  openGraph: { url: "/offers", images: ["/media/rooms/classic-room/02.jpg"] },
};

export default async function OffersPage() {
  const [rooms, offers] = await Promise.all([getRooms(), getOffers()]);
  const hasWeekend = rooms.some((r) => r.weekendPrice);

  return (
    <>
      <PageHero
        title="Offers and rates"
        intro="Simple nightly rates, the occasional offer, and better rates for companies and longer stays."
        image={{
          src: "/media/rooms/classic-room/02.jpg",
          alt: "Double bed with a tall charcoal velvet headboard and white linen",
        }}
      />

      <section className="section" aria-labelledby="rates-title">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="rates-title" className="text-2xl md:text-3xl">
              Nightly rates
            </h2>
            <p className="mt-4 max-w-sm text-stone-deep">
              Per room, per night. Final prices are confirmed by our reservations team when you book.
            </p>
          </div>
          <div className="overflow-x-auto lg:col-span-8">
            <table className="w-full min-w-[420px] border-collapse text-left">
              <caption className="sr-only">Nightly rates by room</caption>
              <thead>
                <tr className="border-b border-ink text-sm text-stone-deep">
                  <th scope="col" className="py-3 pr-4 font-medium">Room</th>
                  <th scope="col" className="py-3 pr-4 text-right font-medium">{hasWeekend ? "Weekday" : "Per night"}</th>
                  {hasWeekend && <th scope="col" className="py-3 pr-4 text-right font-medium">Weekend</th>}
                  <th scope="col" className="py-3"><span className="sr-only">Book</span></th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.slug} className="border-b border-mist">
                    <th scope="row" className="py-4 pr-4 font-display text-lg font-normal">
                      <Link href={`/rooms/${r.slug}`} className="hover:underline">
                        {r.name}
                      </Link>
                    </th>
                    <td className="py-4 pr-4 text-right">
                      <PriceTag amount={r.priceFrom} prefix="" suffix="" />
                    </td>
                    {hasWeekend && (
                      <td className="py-4 pr-4 text-right">
                        {r.weekendPrice ? <PriceTag amount={r.weekendPrice} prefix="" suffix="" /> : "—"}
                      </td>
                    )}
                    <td className="py-4 text-right">
                      <Link href={`/book?room=${r.slug}`} className="link-underline whitespace-nowrap text-sm font-semibold">
                        Book this room
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="offers-title">
        <div className="container-site">
          <h2 id="offers-title" className="text-2xl md:text-3xl">
            Current offers
          </h2>
          {offers.length ? (
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {offers.map((o) => (
                <article key={o.slug} className="flex flex-col bg-porcelain">
                  <div className="relative aspect-[4/3]">
                    <SmartImage src={o.image.src} alt={o.image.alt} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl">{o.title}</h3>
                    <p className="mt-2 text-sm text-stone-deep">
                      Valid {formatDate(o.validFrom, { weekday: undefined })} to {formatDate(o.validTo, { weekday: undefined })}
                    </p>
                    <p className="mt-4">{o.description}</p>
                    <p className="mt-4 text-sm text-stone-deep">{o.terms}</p>
                    <ButtonLink
                      href={`/book${o.promoCode ? `?promo=${encodeURIComponent(o.promoCode)}` : ""}`}
                      className="mt-auto self-start"
                    >
                      Book this offer
                    </ButtonLink>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 max-w-xl">
              <p className="text-lg text-stone-deep">
                There are no special offers running right now. Follow us on Instagram or join the newsletter in the footer
                to hear about the next one first.
              </p>
              <ButtonLink href={whatsappLink("Hi, do you have any offers on at the moment?")} variant="secondary" className="mt-6">
                <WhatsAppIcon className="h-4 w-4" /> Ask about offers
              </ButtonLink>
            </div>
          )}
        </div>
      </section>

      <section id="corporate" className="section scroll-mt-20" aria-labelledby="corporate-title">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="corporate-title" className="text-2xl md:text-3xl">
              Corporate and long-stay rates
            </h2>
            <div className="prose-hotel mt-6 max-w-prose text-lg text-stone-deep">
              <p>
                Housing a project team, hosting visiting staff, or in town for a few weeks? Tell us roughly how many nights
                you need and we&rsquo;ll send a tailored rate.
              </p>
            </div>
            {/* TODO(content): corporate & long-stay rate policy (e.g. minimum nights, invoicing terms). */}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <CorporateForm />
          </div>
        </div>
      </section>
    </>
  );
}
