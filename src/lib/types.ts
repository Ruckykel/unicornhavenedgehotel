// Content types mirroring the Sanity schemas in blueprint §8.

export type MediaImage = {
  src: string;
  alt: string;
};

export type Room = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string[];
  /** Nightly rate in naira. `null` = not yet confirmed; shown as "Rate on request". */
  priceFrom: number | null;
  weekendPrice?: number | null;
  sizeSqm?: number;
  bedType: string;
  maxGuests: number;
  view?: string;
  keyFeatures: string[];
  amenities: string[];
  images: MediaImage[];
  videoTour?: string;
  policies?: string[];
  order: number;
  featured: boolean;
};

export type AmenityGroup = "Rooms" | "Business" | "Leisure" | "Safety";

export type Amenity = {
  name: string;
  icon: string;
  group: AmenityGroup;
  order: number;
  /** Shown in the home page "Why stay here" row. */
  highlight?: boolean;
  detail?: string;
};

export type MenuItem = { name: string; description?: string; price: number; dietary?: string[] };
export type MenuCategory = { name: string; order: number; items: MenuItem[] };

export type Offer = {
  title: string;
  slug: string;
  description: string;
  promoCode?: string;
  discountPercent?: number;
  validFrom: string;
  validTo: string;
  terms: string;
  image: MediaImage;
};

export type Review = {
  guestName: string;
  origin?: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  source: "Google" | "Booking.com" | "Direct";
  date: string;
};

export type GalleryCategory = "Rooms" | "Dining" | "Lobby & spaces" | "Exterior" | "Events" | "Video";

export type GalleryItem = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  category: GalleryCategory;
  caption?: string;
  order: number;
};

export type Faq = { question: string; answer: string; order: number };

export type Landmark = { name: string; driveTime: string };

export type SiteSettings = {
  name: string;
  shortName: string;
  tagline: string;
  phone: string;
  phoneHref: string;
  whatsapp: string;
  email: string;
  address: { street: string; area: string; city: string; state: string; country: string };
  mapQuery: string;
  checkInTime: string;
  checkOutTime: string;
  receptionHours: string;
  socialLinks: { instagram: string };
  heroVideo: { mobile: string; desktop: string };
  heroPoster: string;
  brandFilm: string;
  announcementBar?: string;
  booking: {
    /** Percentage for "Pay deposit"; null hides the deposit option. */
    depositPercent: number | null;
    allowPayAtHotel: boolean;
  };
};
