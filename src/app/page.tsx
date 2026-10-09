import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Navigation } from "lucide-react";
import {
  diningInfo,
  getAmenities,
  getFeaturedRooms,
  getGallery,
  getReviews,
  landmarks,
  siteSettings,
} from "@/lib/content";
import { whatsappLink } from "@/lib/whatsapp";
import { directionsUrl } from "@/lib/maps";
import { hotelSchema } from "@/lib/schema";
import { SealLoader } from "@/components/SealLoader";
import { HeroVideo } from "@/components/HeroVideo";
import { SmartImage } from "@/components/SmartImage";
import { BookingWidget } from "@/components/BookingWidget";
import { CircleImage } from "@/components/CircleImage";
import { RoomCard } from "@/components/RoomCard";
import { SectionHeading } from "@/components/SectionHeading";
import { AmenityRow } from "@/components/AmenityList";
import { VideoBlock } from "@/components/VideoBlock";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { MapBlock } from "@/components/MapBlock";
import { Gallery } from "@/components/Gallery";
import { ButtonLink } from "@/components/Button";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { JsonLd } from "@/components/JsonLd";
import { FinalCta } from "@/components/FinalCta";

export const metadata: Metadata = {
  title: { absolute: "Unicorn Haven Edge Hotel | Hotel in Port Harcourt" },
  alternates: { canonical: "/" },
  openGraph: { url: "/", images: [{ url: "/og/default.jpg", width: 1200, height: 630 }] },
};

export default async function HomePage() {
  const [rooms, amenities, gallery, reviews] = await Promise.all([
    getFeaturedRooms(),
    getAmenities(),
    getGallery(),
    getReviews(),
  ]);
  const s = siteSettings;
  const highlights = amenities.filter((a) => a.highlight);
  const galleryPreview = gallery.filter((g) => g.type === "image").slice(0, 8);

  return (
    <>
      <JsonLd data={hotelSchema(amenities)} />
      <SealLoader />

      {/* 1 — Hero. The supplied films are vertical, so on desktop the film sits
          in a tall frame on the right; on mobile it fills the screen. */}
      <section data-hero aria-labelledby="hero-title" className="relative overflow-hidden bg-ink text-porcelain">
        <div className="absolute inset-0 lg:left-auto lg:w-[44%]">
          <SmartImage
            src={s.heroPoster}
            alt=""
            fill
            priority
            quality={60}
            sizes="(min-width: 1024px) 44vw, 100vw"
            className="object-cover"
          />
          <HeroVideo
            mobileSrc={s.heroVideo.mobile}
            desktopSrc={s.heroVideo.desktop}
            poster={s.heroPoster}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/40 lg:bg-gradient-to-r lg:from-ink lg:via-ink/10 lg:to-transparent" />
        </div>

        <div className="container-site relative flex min-h-[100svh] flex-col pt-32 lg:min-h-[max(100svh,780px)] lg:pt-[72px]">
          <div className="flex flex-1 items-end pb-28 lg:items-center lg:pb-10">
            <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[48%] lg:text-left">
              <h1 id="hero-title" className="text-hero text-shadow-soft lg:text-[clamp(3rem,4.6vw,4.75rem)] lg:text-shadow-none">
                Quiet comfort in the heart of Port&nbsp;Harcourt
              </h1>
              <p className="mx-auto mt-6 max-w-md text-lg text-porcelain/90 lg:mx-0">
                A secure, carefully kept hotel on Elelenwo Street, with 24/7 power, fast Wi-Fi and a restaurant on site.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <ButtonLink href="/rooms" variant="light">
                  Explore rooms
                </ButtonLink>
                <ButtonLink href={whatsappLink("Hi, I'd like to enquire about a stay at Unicorn Haven Edge Hotel.")} variant="light" className="hidden lg:inline-flex">
                  <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
                </ButtonLink>
              </div>
            </div>
          </div>
          <div className="hidden pb-10 lg:block">
            <BookingWidget variant="hero" className="text-ink" />
          </div>
        </div>
      </section>

      <div className="container-site lg:hidden">
        <div className="-mx-4 border-b border-mist">
          <BookingWidget variant="hero" />
        </div>
      </div>

      {/* 2 — Introduction */}
      <section className="section">
        <div className="container-site grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <h2 className="text-2xl md:text-3xl">A home away from home, behind a quiet gate</h2>
            <p className="mt-6 max-w-prose text-lg text-stone-deep">
              Unicorn Haven Edge is a small, carefully kept hotel on Elelenwo Street in Port Harcourt. Behind a secure gate
              you&rsquo;ll find a timber-framed entrance, calm rooms finished in velvet and marble, and a lounge and
              restaurant for unhurried evenings. The power stays on, the Wi-Fi is fast and the welcome is warm.
            </p>
            <Link href="/about" className="link-underline mt-8 inline-flex items-center gap-2 font-semibold">
              About the hotel <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          <div className="md:col-span-6 lg:col-span-5 lg:col-start-8">
            <CircleImage
              src="/media/spaces/entrance-porch.jpg"
              alt="The hotel's timber entrance porch with planters on either side of the double doors"
              className="mx-auto w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* 3 — Rooms preview */}
      <section className="section border-t border-mist" aria-labelledby="rooms-title">
        <div className="container-site">
          <SectionHeading
            title={<span id="rooms-title">Rooms and suites</span>}
            intro="Every room has air conditioning, fast Wi-Fi and a desk to work from, with power that stays on all night."
            action={
              <Link href="/rooms" className="link-underline inline-flex items-center gap-2 font-semibold">
                See all rooms <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <RoomCard key={r.slug} room={r} />
            ))}
          </div>
        </div>
      </section>

      {/* 4 — Why stay here */}
      <section className="section bg-mist" aria-labelledby="why-title">
        <div className="container-site">
          <SectionHeading
            title={<span id="why-title">Why guests stay with us</span>}
            intro="The things that matter in Port Harcourt, handled."
          />
          <div className="mt-12">
            <AmenityRow amenities={highlights} />
          </div>
        </div>
      </section>

      {/* 5 — Dining teaser */}
      <section className="section" aria-labelledby="dining-title">
        <div className="container-site grid items-center gap-10 md:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            <SmartImage
              src="/media/dining/plantain-rice.jpg"
              alt="Fried rice with prawns and sausage, served with fried plantain and sliced cucumber"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-md">
            <h2 id="dining-title" className="text-2xl md:text-3xl">
              Dinner in, with the match on the big screen
            </h2>
            <p className="mt-6 text-lg text-stone-deep">
              Freshly cooked plates, from fried rice and plantain to crisp salads, served in a calm lounge with soft
              sofas, a stocked bar and the game on.
            </p>
            <dl className="mt-8 grid gap-4 border-t border-mist pt-6 text-sm">
              <div className="flex justify-between gap-6">
                <dt className="text-stone-deep">Hours</dt>
                <dd className="text-right">{diningInfo.hours ?? "Call or WhatsApp for today's hours"}</dd>
              </div>
              <div className="flex justify-between gap-6">
                <dt className="text-stone-deep">Where</dt>
                <dd className="text-right">{diningInfo.location}</dd>
              </div>
            </dl>
            <ButtonLink href="/dining" variant="secondary" className="mt-8">
              See the menu
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* 6 — Brand film */}
      <section className="section bg-ink text-porcelain" aria-labelledby="film-title">
        <div className="container-site grid items-center gap-12 md:grid-cols-2">
          <div className="max-w-md md:order-last md:justify-self-start">
            <h2 id="film-title" className="text-2xl md:text-3xl">
              Take a walk through
            </h2>
            <p className="mt-6 text-lg text-sage">
              A short walk from the lobby, up the stairs and into a guest room. No actors, just the hotel as
              you&rsquo;ll find it.
            </p>
          </div>
          <VideoBlock
            src={s.brandFilm}
            poster="/media/spaces/lobby-seating.jpg"
            title="Inside Unicorn Haven Edge"
            description="A walkthrough from the lobby seating, along the marble corridor and into a guest room."
            className="mx-auto w-full max-w-sm md:justify-self-end"
            sizes="(min-width: 768px) 384px, 90vw"
          />
        </div>
      </section>

      {/* 7 — Guest reviews (hidden until real reviews are added) */}
      {reviews.length > 0 && (
        <section className="section" aria-labelledby="reviews-title">
          <div className="container-site">
            <SectionHeading title={<span id="reviews-title">What guests say</span>} />
            <div className="mt-12">
              <TestimonialSlider reviews={reviews} />
            </div>
          </div>
        </section>
      )}

      {/* 8 — Location */}
      <section className="section" aria-labelledby="location-title">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="location-title" className="text-2xl md:text-3xl">
              Finding us
            </h2>
            <address className="mt-6 flex gap-3 text-lg not-italic">
              <MapPin aria-hidden className="mt-1.5 h-5 w-5 shrink-0 text-mangrove" strokeWidth={1.5} />
              <span>
                {s.address.street}
                <br />
                {s.address.area}, {s.address.city}
                <br />
                {s.address.state}
              </span>
            </address>
            <p className="mt-6 max-w-prose text-stone-deep">
              Look for the yellow &ldquo;30&rdquo; sign at the gate. There&rsquo;s secure parking inside the courtyard.
            </p>
            {landmarks.length > 0 && (
              <dl className="mt-8 divide-y divide-mist border-y border-mist">
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
          <div className="lg:col-span-7">
            <MapBlock className="aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      {/* 9 — Gallery preview */}
      <section className="section border-t border-mist" aria-labelledby="gallery-title">
        <div className="container-site">
          <SectionHeading
            title={<span id="gallery-title">A look around</span>}
            action={
              <Link href="/gallery" className="link-underline inline-flex items-center gap-2 font-semibold">
                View gallery <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-12">
            <Gallery items={galleryPreview} filters={false} />
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
