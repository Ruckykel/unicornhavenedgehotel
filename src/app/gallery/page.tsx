import type { Metadata } from "next";
import { getGallery } from "@/lib/content";
import { PageHero } from "@/components/PageHero";
import { Gallery } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos and video of Unicorn Haven Edge Hotel, Port Harcourt: rooms, the restaurant and lounge, reception and the building.",
  alternates: { canonical: "/gallery" },
  openGraph: { url: "/gallery", images: ["/media/spaces/reception.jpg"] },
};

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <>
      <PageHero
        title="Gallery"
        intro="Rooms, the lounge, the plates and the place. All photographed at the hotel."
        image={{
          src: "/media/spaces/aerial-wide.jpg",
          alt: "Aerial view of the hotel compound on Elelenwo Street",
        }}
      />
      <section className="section">
        <div className="container-site">
          <Gallery items={items} />
        </div>
      </section>
    </>
  );
}
