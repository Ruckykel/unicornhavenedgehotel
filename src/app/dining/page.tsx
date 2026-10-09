import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { diningInfo, getGallery, getMenu, siteSettings } from "@/lib/content";
import { formatNaira } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { restaurantSchema } from "@/lib/schema";
import { PageHero } from "@/components/PageHero";
import { VideoBlock } from "@/components/VideoBlock";
import { Gallery } from "@/components/Gallery";
import { ButtonLink } from "@/components/Button";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { JsonLd } from "@/components/JsonLd";
import { CircleImage } from "@/components/CircleImage";

export const metadata: Metadata = {
  title: "Restaurant & bar",
  description:
    "The restaurant and lounge at Unicorn Haven Edge Hotel, Port Harcourt: freshly cooked plates, a stocked bar and live sports on the big screen.",
  alternates: { canonical: "/dining" },
  openGraph: { url: "/dining", images: ["/media/dining/plantain-rice.jpg"] },
};

export default async function DiningPage() {
  const [menu, gallery] = await Promise.all([getMenu(), getGallery()]);
  const hasMenu = menu.some((c) => c.items.length > 0);
  const strip = gallery.filter((g) => g.category === "Dining" && g.type === "image");
  const reserveMsg = "Hi, I'd like to reserve a table at the restaurant.";

  return (
    <>
      <JsonLd data={restaurantSchema()} />
      <PageHero
        title="The restaurant and lounge"
        intro="Freshly cooked plates, a well-stocked bar and soft sofas, with the match on the big screen."
        image={{
          src: "/media/dining/lounge.jpg",
          alt: "Lounge with grey velvet sofas, black marble floor and a TV showing football",
        }}
        position="center 60%"
      />

      <section className="section">
        <div className="container-site grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <h2 className="text-2xl md:text-3xl">Eat well without leaving the gate</h2>
            <div className="prose-hotel mt-6 max-w-prose text-lg text-stone-deep">
              <p>
                After a long day across the city, dinner is a few steps from your room. Plates are freshly cooked, from
                Nigerian favourites like fried rice with plantain to fresh salads.
              </p>
              <p>Order in the lounge, at the bar, or have it brought to your room.</p>
            </div>
            <dl className="mt-8 grid gap-4 border-t border-mist pt-6">
              <div className="flex justify-between gap-6">
                <dt className="text-stone-deep">Hours</dt>
                <dd className="text-right">{diningInfo.hours ?? "Call or WhatsApp for today's hours"}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-stone-deep">Where</dt>
                <dd className="text-right">{diningInfo.location}</dd>
              </div>
              {diningInfo.openToNonGuests !== null && (
                <div className="flex justify-between gap-6">
                  <dt className="text-stone-deep">Non-guests</dt>
                  <dd className="text-right">{diningInfo.openToNonGuests ? "Welcome, walk-ins included" : "Hotel guests only"}</dd>
                </div>
              )}
            </dl>
          </div>
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
            <CircleImage
              src="/media/dining/plantain-rice.jpg"
              alt="Fried rice with prawns and sausage, served with fried plantain"
              position="center 70%"
              className="mx-auto w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <section className="section bg-mist" aria-labelledby="menu-title">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="menu-title" className="text-2xl md:text-3xl">
              Menu
            </h2>
            {hasMenu && <p className="mt-4 max-w-sm text-stone-deep">All prices are in naira.</p>}
          </div>
          <div className="lg:col-span-8">
            {hasMenu ? (
              <div className="grid gap-12 md:grid-cols-2">
                {menu
                  .filter((c) => c.items.length)
                  .map((cat) => (
                    <div key={cat.name}>
                      <h3 className="border-b border-ink pb-3 text-xl">{cat.name}</h3>
                      <ul className="mt-2 divide-y divide-ink/10">
                        {cat.items.map((item) => (
                          <li key={item.name} className="flex justify-between gap-6 py-4">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              {item.description && <p className="mt-1 text-sm text-stone-deep">{item.description}</p>}
                              {item.dietary?.length ? <p className="mt-1 text-xs text-stone-deep">{item.dietary.join(" · ")}</p> : null}
                            </div>
                            <p className="shrink-0 tabular-nums">{formatNaira(item.price)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="border-t border-ink pt-6">
                <p className="text-lg">Ask us for today&rsquo;s dishes and prices and we&rsquo;ll send the menu straight to your phone.</p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Menu sections">
                  {menu.map((c) => (
                    <li key={c.name} className="rounded-sm border border-ink/20 px-3 py-1.5 text-sm">
                      {c.name}
                    </li>
                  ))}
                </ul>
                <ButtonLink href={whatsappLink("Hi, could you send me today's menu?")} variant="secondary" className="mt-8">
                  <WhatsAppIcon className="h-4 w-4" /> Get today&rsquo;s menu on WhatsApp
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section bg-ink text-porcelain" aria-labelledby="dining-film">
        <div className="container-site grid items-center gap-12 md:grid-cols-2">
          <div className="max-w-md">
            <h2 id="dining-film" className="text-2xl md:text-3xl">
              From the gate to the plate
            </h2>
            <p className="mt-6 text-lg text-sage">
              Through the timber porch, past reception and into the lounge, ending where it should: at the table.
            </p>
          </div>
          <VideoBlock
            src="/media/dining/dining-film.mp4"
            poster="/media/dining/lounge-corner.jpg"
            title="Arrival and dining at Unicorn Haven Edge"
            description="Arriving through the courtyard and timber porch, past reception, into the lounge, then plates of fried rice with plantain and salad."
            className="mx-auto w-full max-w-sm md:justify-self-end"
            sizes="(min-width: 768px) 384px, 90vw"
          />
        </div>
      </section>

      <section className="section" aria-label="Dining photos">
        <div className="container-site">
          <Gallery items={strip} filters={false} />
        </div>
      </section>

      <section className="section border-t border-mist text-center">
        <div className="container-site">
          <h2 className="text-2xl md:text-3xl">Reserve a table</h2>
          <p className="mx-auto mt-4 max-w-md text-stone-deep">
            Message or call us with the time and number of guests and we&rsquo;ll have your table ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={whatsappLink(reserveMsg)}>
              <WhatsAppIcon className="h-4 w-4" /> Reserve on WhatsApp
            </ButtonLink>
            <ButtonLink href={siteSettings.phoneHref} variant="secondary">
              <Phone aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Call {siteSettings.phone}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
