import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BedDouble, Eye, Ruler, Users } from "lucide-react";
import { getRoom, getRooms } from "@/lib/content";
import { roomSchema } from "@/lib/schema";
import { whatsappLink } from "@/lib/whatsapp";
import { SmartImage } from "@/components/SmartImage";
import { Carousel } from "@/components/Carousel";
import { PriceTag } from "@/components/PriceTag";
import { AmenityChecklist } from "@/components/AmenityList";
import { BookingWidget } from "@/components/BookingWidget";
import { RoomCard } from "@/components/RoomCard";
import { VideoBlock } from "@/components/VideoBlock";
import { JsonLd } from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getRooms()).map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const room = await getRoom((await params).slug);
  if (!room) return {};
  return {
    title: room.name,
    description: `${room.shortDescription} ${room.priceFrom ? `From ₦${room.priceFrom.toLocaleString("en-NG")} per night.` : ""} Unicorn Haven Edge Hotel, Port Harcourt.`.trim(),
    alternates: { canonical: `/rooms/${room.slug}` },
    openGraph: { url: `/rooms/${room.slug}`, images: [room.images[0].src] },
  };
}

export default async function RoomPage({ params }: Params) {
  const { slug } = await params;
  const [room, rooms] = await Promise.all([getRoom(slug), getRooms()]);
  if (!room) notFound();
  const others = rooms.filter((r) => r.slug !== room.slug);

  const facts = [
    room.sizeSqm && { icon: Ruler, label: "Size", value: `${room.sizeSqm} m²` },
    { icon: BedDouble, label: "Bed", value: room.bedType },
    { icon: Users, label: "Guests", value: `Up to ${room.maxGuests}` },
    room.view && { icon: Eye, label: "View", value: room.view },
  ].filter(Boolean) as { icon: typeof Ruler; label: string; value: string }[];

  return (
    <>
      <JsonLd data={roomSchema(room)} />

      <section data-hero className="bg-ink pb-10 pt-[104px] text-porcelain md:pb-14">
        <div className="container-site">
          <Link href="/rooms" className="inline-flex items-center gap-2 text-sm text-sage hover:text-porcelain">
            <ArrowLeft aria-hidden className="h-4 w-4" /> All rooms
          </Link>
          <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h1 className="text-3xl md:text-4xl">{room.name}</h1>
            <PriceTag amount={room.priceFrom} className="text-lg" />
          </div>
          <div className="mt-8">
            {room.images.length > 1 ? (
              <Carousel label={`${room.name} photos`} slideClass="w-[88%] md:w-[70%]" tone="dark">
                {room.images.map((img, i) => (
                  <div key={img.src} className="relative aspect-[4/3] bg-mangrove md:aspect-[16/9]">
                    <SmartImage src={img.src} alt={img.alt} fill priority={i === 0} sizes="(min-width: 768px) 70vw, 88vw" className="object-cover" />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="relative aspect-[4/3] bg-mangrove md:aspect-[16/9]">
                <SmartImage src={room.images[0].src} alt={room.images[0].alt} fill priority sizes="(min-width: 1280px) 1232px, 100vw" className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-site grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="font-display text-xl leading-snug md:text-2xl">{room.shortDescription}</p>
            <div className="prose-hotel mt-6 max-w-prose text-stone-deep">
              {room.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <dl className="mt-10 flex flex-wrap gap-px overflow-hidden border border-mist bg-mist">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="min-w-[140px] flex-1 bg-porcelain p-4">
                  <dt className="flex items-center gap-2 text-sm text-stone-deep">
                    <Icon aria-hidden className="h-4 w-4" strokeWidth={1.5} /> {label}
                  </dt>
                  <dd className="mt-1 font-semibold">{value}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-14 text-2xl">In the room</h2>
            <div className="mt-6">
              <AmenityChecklist items={room.amenities} />
            </div>

            {room.videoTour && (
              <>
                <h2 className="mt-14 text-2xl">Video tour</h2>
                <VideoBlock
                  src={room.videoTour}
                  poster={room.images[0].src}
                  title={`${room.name} video tour`}
                  description={`A short video tour of the ${room.name}.`}
                  className="mt-6 max-w-sm"
                />
              </>
            )}

            {room.policies && (
              <>
                <h2 className="mt-14 text-2xl">Good to know</h2>
                <ul className="mt-6 space-y-2 text-stone-deep">
                  {room.policies.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <Link href="/terms" className="link-underline mt-4 inline-block text-sm font-semibold">
                  Booking terms and cancellation policy
                </Link>
              </>
            )}
          </div>

          <aside className="hidden lg:col-span-5 lg:block" aria-label={`Book the ${room.name}`}>
            <div className="sticky top-[96px] border border-mist bg-white p-6">
              <p className="font-display text-xl">Book the {room.name}</p>
              <PriceTag amount={room.priceFrom} className="mt-2 block text-stone-deep" />
              <div className="mt-6">
                <BookingWidget variant="inline" room={room.slug} />
              </div>
              <a
                href={whatsappLink(`Hi, I'd like to enquire about the ${room.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 border-t border-mist pt-4 text-sm font-semibold hover:underline"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask about this room on WhatsApp
              </a>
              <p className="mt-3 text-center text-xs text-stone-deep">Availability is confirmed by our reservations team.</p>
            </div>
          </aside>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section border-t border-mist" aria-labelledby="other-rooms">
          <div className="container-site">
            <h2 id="other-rooms" className="mb-10 text-2xl md:text-3xl">
              Other rooms
            </h2>
            <Carousel label="Other rooms" slideClass="w-[80%] sm:w-[45%] lg:w-[31%]">
              {others.map((r) => (
                <RoomCard key={r.slug} room={r} />
              ))}
            </Carousel>
          </div>
        </section>
      )}
    </>
  );
}
