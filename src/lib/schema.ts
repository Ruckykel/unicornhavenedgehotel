import { siteSettings, diningInfo } from "./content";
import { SITE_URL } from "./site";
import type { Amenity, Faq, Room } from "./types";

const s = siteSettings;

export const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: s.address.street,
  addressLocality: s.address.city,
  addressRegion: s.address.state,
  addressCountry: "NG",
};

export function hotelSchema(amenities: Amenity[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${SITE_URL}/#hotel`,
    name: s.name,
    url: SITE_URL,
    telephone: s.phone,
    email: s.email,
    address: postalAddress,
    // TODO(content): add "geo": { "@type": "GeoCoordinates", latitude, longitude } once confirmed.
    priceRange: "₦₦",
    checkinTime: s.checkInTime,
    checkoutTime: s.checkOutTime,
    image: [`${SITE_URL}/media/spaces/exterior-facade.jpg`, `${SITE_URL}/media/spaces/reception.jpg`],
    logo: `${SITE_URL}/icon.svg`,
    sameAs: [s.socialLinks.instagram],
    amenityFeature: amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.name, value: true })),
  };
}

export function roomSchema(room: Room) {
  const url = `${SITE_URL}/rooms/${room.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: room.name,
    url,
    description: room.shortDescription,
    image: room.images.map((i) => `${SITE_URL}${i.src}`),
    bed: { "@type": "BedDetails", typeOfBed: room.bedType },
    occupancy: { "@type": "QuantitativeValue", maxValue: room.maxGuests },
    ...(room.sizeSqm ? { floorSize: { "@type": "QuantitativeValue", value: room.sizeSqm, unitCode: "MTK" } } : {}),
    amenityFeature: room.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true })),
    containedInPlace: { "@id": `${SITE_URL}/#hotel` },
    ...(room.priceFrom !== null
      ? {
          offers: {
            "@type": "Offer",
            price: room.priceFrom,
            priceCurrency: "NGN",
            url: `${SITE_URL}/book?room=${room.slug}`,
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: room.priceFrom,
              priceCurrency: "NGN",
              unitText: "night",
            },
          },
        }
      : {}),
  };
}

export function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `${s.name} restaurant`,
    url: `${SITE_URL}/dining`,
    telephone: s.phone,
    address: postalAddress,
    image: [`${SITE_URL}/media/dining/plantain-rice.jpg`, `${SITE_URL}/media/dining/lounge.jpg`],
    containedInPlace: { "@id": `${SITE_URL}/#hotel` },
    ...(diningInfo.hours ? { openingHours: diningInfo.hours } : {}),
    acceptsReservations: true,
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
