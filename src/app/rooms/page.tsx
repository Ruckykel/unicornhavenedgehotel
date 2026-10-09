import type { Metadata } from "next";
import { getRooms } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { RoomsBrowser } from "@/components/RoomsBrowser";
import { ButtonLink } from "@/components/Button";
import { FinalCta } from "@/components/FinalCta";

export const metadata: Metadata = {
  title: "Rooms & suites",
  description:
    "Rooms and suites at Unicorn Haven Edge Hotel, Port Harcourt: air conditioning, fast Wi-Fi, a work desk and 24/7 power in every room. Compare rooms and book direct.",
  alternates: { canonical: "/rooms" },
  openGraph: { url: "/rooms", images: ["/media/rooms/executive-suite/01.jpg"] },
};

export default async function RoomsPage() {
  const rooms = await getRooms();
  return (
    <>
      <PageHero
        title="Rooms and suites"
        intro="Calm, well-kept rooms with air conditioning, fast Wi-Fi and a proper desk. The power stays on all night."
        image={{
          src: "/media/rooms/executive-suite/01.jpg",
          alt: "Executive suite with a blue padded headboard, a seating area and a long work desk",
        }}
      />

      <section className="section">
        <div className="container-site">
          <RoomsBrowser rooms={rooms} />
        </div>
      </section>

      <section className="bg-mangrove text-porcelain">
        <div className="container-site flex flex-col items-start gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">Staying a week or more, or booking for a team?</h2>
            <p className="mt-3 max-w-xl text-sage">Ask about corporate and long-stay rates, with invoicing for your company.</p>
          </div>
          <ButtonLink href="/offers#corporate">See offers and corporate rates</ButtonLink>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
