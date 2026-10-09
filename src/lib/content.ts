// Site content. Shaped like the Sanity schemas (blueprint §8) so this module
// can be swapped for GROQ queries without touching pages: every getter is
// async and returns the same types.
//
// Anything not confirmed by the client is marked TODO(content). Values marked
// PLACEHOLDER are stand-ins so every section renders while we wait for the
// hotel (see docs/content-request.md). Replace all of them before launch.
//
// Anything not confirmed by the client is marked TODO(content). Do not invent
// prices, room counts, reviews or amenities — leave the field empty instead
// and the UI degrades gracefully (e.g. "Rate on request", hidden sections).
import type {
  Amenity,
  Faq,
  GalleryItem,
  Landmark,
  MenuCategory,
  Offer,
  Review,
  Room,
  SiteSettings,
} from "./types";

export const siteSettings: SiteSettings = {
  name: "Unicorn Haven Edge Hotel",
  shortName: "Unicorn Haven Edge",
  tagline: "Quiet comfort in the heart of Port Harcourt",
  // TODO(content): phone number
  phone: "+234 000 000 0000",
  phoneHref: "tel:+2340000000000",
  // TODO(content): WhatsApp number, international format without "+"
  whatsapp: "2340000000000",
  // TODO(content): confirm reservations email
  email: "reservations@unicornhavenedgehotel.com",
  address: {
    // NOTE: the street sign in the client photo reads "Elelewon Str." — the
    // blueprint spelling (Elelenwo) is used here. TODO(content): confirm.
    street: "30 Elelenwo Street",
    area: "Elelenwo",
    city: "Port Harcourt",
    state: "Rivers State",
    country: "Nigeria",
  },
  mapQuery: "30 Elelenwo Street, Port Harcourt, Rivers State, Nigeria",
  // TODO(content): confirm check-in / check-out times
  checkInTime: "2:00 pm",
  checkOutTime: "12:00 noon",
  // TODO(content): confirm reception is staffed 24/7
  receptionHours: "Reception open 24 hours",
  socialLinks: { instagram: "https://www.instagram.com/unicornhavenedgehotel" },
  heroVideo: { mobile: "/media/hero/hero-loop.mp4", desktop: "/media/hero/hero-loop-hd.mp4" },
  heroPoster: "/media/hero/hero-poster.jpg",
  brandFilm: "/media/brand/brand-film.mp4",
  booking: {
    // TODO(client): deposit percentage. null hides the "Pay deposit" option.
    depositPercent: null,
    // TODO(client): confirm guests may pay on arrival
    allowPayAtHotel: true,
  },
};

// TODO(content): drive times to the airport and key landmarks. The location
// section lists these only when present.
export const landmarks: Landmark[] = [
  // PLACEHOLDER drive times
  { name: "Port Harcourt International Airport", driveTime: "XX min" },
  { name: "Port Harcourt city centre", driveTime: "XX min" },
  { name: "Trans-Amadi Industrial Layout", driveTime: "XX min" },
];

const roomPolicies = [
  `Check-in from ${siteSettings.checkInTime}, check-out by ${siteSettings.checkOutTime}.`,
  "A valid photo ID is required at check-in.",
  // TODO(content): smoking, extra bed and children policies
  "Ask reservations about extra beds and travelling with children.",
];

// TODO(content): room types, names, prices, sizes, bed types and max guests
// are placeholders built from the supplied photos. Only the March 2024 public
// rate (₦35,000) is known, and needs confirming.
const rooms: Room[] = [
  {
    name: "Classic Room",
    slug: "classic-room",
    shortDescription:
      "A calm, dark-toned room with a velvet headboard, a proper work desk and a quiet corner to sit.",
    description: [
      "Charcoal velvet, crisp white linen and soft daylight. The Classic Room is set up for a good night's sleep and a productive morning.",
      "There's a full work desk with power at hand, a wall-mounted TV, a kettle for tea or coffee, and a reading chair beside a small round table.",
    ],
    priceFrom: 35000, // TODO(content): confirm current rate (last public rate March 2024)
    bedType: "Double bed", // TODO(content)
    maxGuests: 2, // TODO(content)
    keyFeatures: ["Work desk", "Smart TV", "Air conditioning"],
    amenities: [
      "Air conditioning",
      "Wall-mounted TV",
      "Work desk and chair",
      "Kettle with tea and coffee",
      "Bottled water",
      "Full-length mirror",
      "Reading chair",
      "High-speed Wi-Fi",
    ],
    images: [
      {
        src: "/media/rooms/classic-room/02.jpg",
        alt: "Double bed with a tall charcoal velvet headboard, white linen and grey throw pillows",
      },
      {
        src: "/media/rooms/classic-room/01.jpg",
        alt: "Work desk with wall-mounted TV and kettle beside a marble feature wall, with a reading chair by the bed",
      },
    ],
    policies: roomPolicies,
    order: 1,
    featured: true,
  },
  {
    name: "Deluxe Room",
    slug: "deluxe-room",
    shortDescription:
      "Generous floor space, warm gold accents and blackout curtains for long, uninterrupted sleep.",
    description: [
      "A bright, spacious room with polished marble-effect floors, a diamond-quilted bed frame and gold accents that warm the space at night.",
      "Floor-length blackout curtains, split-unit air conditioning and soft ambient ceiling lights make it easy to switch off after a long day.",
    ],
    priceFrom: 45000, // PLACEHOLDER rate — TODO(content)
    bedType: "Double bed", // TODO(content)
    maxGuests: 2, // TODO(content)
    keyFeatures: ["Blackout curtains", "Ambient lighting", "Air conditioning"],
    amenities: [
      "Air conditioning",
      "Blackout curtains",
      "Ambient ceiling lighting",
      "Upholstered desk chair",
      "Bedside table",
      "Wardrobe",
      "High-speed Wi-Fi",
    ],
    images: [
      {
        src: "/media/rooms/deluxe-room/01.jpg",
        alt: "Deluxe room with a quilted bed frame, mustard cushions, gold patterned rug and blue ambient ceiling light",
      },
    ],
    policies: roomPolicies,
    order: 2,
    featured: true,
  },
  {
    name: "Executive Suite",
    slug: "executive-suite",
    shortDescription:
      "Our most spacious room, with a seating area for two, a full work station and a walk-up wardrobe.",
    description: [
      "Room to spread out. The Executive Suite pairs a large bed and padded headboard with a separate seating area, a long work desk and a full-height wardrobe.",
      "It suits longer stays and guests who want to receive a colleague or simply enjoy morning tea away from the bed.",
    ],
    priceFrom: 60000, // PLACEHOLDER rate — TODO(content)
    bedType: "Large double bed", // TODO(content)
    maxGuests: 2, // TODO(content)
    keyFeatures: ["Seating area", "Long work desk", "Wardrobe"],
    amenities: [
      "Air conditioning",
      "Seating area with two armchairs",
      "Long work desk",
      "Full-height wardrobe",
      "Kettle with tea and coffee",
      "Blackout curtains",
      "TV",
      "High-speed Wi-Fi",
    ],
    images: [
      {
        src: "/media/rooms/executive-suite/01.jpg",
        alt: "Executive suite with a blue padded headboard, two armchairs around a round table, a long desk and a tall wardrobe",
      },
    ],
    policies: roomPolicies,
    order: 3,
    featured: true,
  },
];

// TODO(content): confirm the final amenity list with the hotel.
const amenities: Amenity[] = [
  { name: "24/7 power", icon: "Zap", group: "Safety", order: 1, highlight: true, detail: "Uninterrupted power, day and night" },
  { name: "High-speed Wi-Fi", icon: "Wifi", group: "Business", order: 2, highlight: true, detail: "Throughout rooms and lounge" },
  { name: "Security & CCTV", icon: "ShieldCheck", group: "Safety", order: 3, highlight: true, detail: "Gated compound, monitored" },
  { name: "Restaurant & bar", icon: "UtensilsCrossed", group: "Leisure", order: 4, highlight: true, detail: "Plates, drinks and the match on" },
  { name: "Room service", icon: "ConciergeBell", group: "Rooms", order: 5, highlight: true, detail: "Meals brought to your room" },
  { name: "Secure parking", icon: "Car", group: "Safety", order: 6, highlight: true, detail: "Inside the gated courtyard" },
  { name: "Air conditioning", icon: "AirVent", group: "Rooms", order: 7, highlight: true, detail: "In every room" },
  { name: "Smart TV", icon: "Tv", group: "Rooms", order: 8 },
  { name: "Work desk in every room", icon: "Lamp", group: "Business", order: 9 },
  { name: "Tea and coffee making", icon: "Coffee", group: "Rooms", order: 10 },
  { name: "Lounge with live sports", icon: "Sofa", group: "Leisure", order: 11 },
  { name: "Garden courtyard seating", icon: "Trees", group: "Leisure", order: 12 },
  { name: "Corporate invoicing", icon: "Receipt", group: "Business", order: 13 }, // TODO(content): confirm
  { name: "Reception open 24 hours", icon: "Clock", group: "Safety", order: 14 }, // TODO(content): confirm
];

// TODO(content): restaurant menu with prices. Categories render with a
// "today's menu on WhatsApp" note while empty.
const menu: MenuCategory[] = [
  // PLACEHOLDER menu: dishes and prices are stand-ins until the hotel sends its menu.
  {
    name: "Breakfast",
    order: 1,
    items: [
      { name: "Continental breakfast", description: "Toast, eggs, sausage, baked beans and tea or coffee", price: 5000 },
      { name: "Yam and egg sauce", description: "Boiled yam with tomato and pepper egg sauce", price: 4500 },
    ],
  },
  {
    name: "Local dishes",
    order: 2,
    items: [
      { name: "Jollof rice with chicken", description: "Party-style jollof, fried plantain and coleslaw", price: 7500 },
      { name: "Fried rice with plantain", description: "With prawns, sausage and mixed vegetables", price: 7500 },
      { name: "Pepper soup", description: "Goat meat or catfish, with yam or bread", price: 6000 },
    ],
  },
  {
    name: "Grills",
    order: 3,
    items: [
      { name: "Grilled chicken", description: "Quarter chicken, chips and salad", price: 8500 },
      { name: "Grilled fish", description: "Whole croaker with spicy sauce and plantain", price: 12000 },
    ],
  },
  {
    name: "Drinks",
    order: 4,
    items: [
      { name: "Soft drinks", price: 1000 },
      { name: "Fresh juice", price: 2500 },
      { name: "Bottled beer", price: 1500 },
    ],
  },
];

export const diningInfo: {
  name: string;
  hours: string | null;
  openToNonGuests: boolean | null;
  location: string;
} = {
  name: "The restaurant & lounge", // TODO(content): restaurant name, if it has one
  hours: "Daily, 7:00 am – 10:00 pm", // PLACEHOLDER — TODO(content): opening hours
  openToNonGuests: true, // PLACEHOLDER — TODO(content): confirm walk-ins are welcome
  location: "Ground floor, beside reception", // TODO(content): confirm
};

// TODO(content): add offers from the hotel. The offers grid hides when empty.
const offers: Offer[] = [
  // PLACEHOLDER offer so the offers grid and promo flow can be reviewed. Remove
  // or replace before launch: the promo code really discounts bookings.
  {
    title: "Weekend stay",
    slug: "weekend-stay",
    description: "Stay Friday and Saturday night and take 10% off your room. Sample offer, to be confirmed by the hotel.",
    promoCode: "WEEKEND10",
    discountPercent: 10,
    validFrom: "2026-10-01",
    validTo: "2026-12-31",
    terms: "Sample terms: minimum two nights, subject to availability.",
    image: { src: "/media/rooms/deluxe-room/01.jpg", alt: "Deluxe room with gold accents and ambient ceiling lighting" },
  },
];

// TODO(content): 3–5 genuine reviews with guest permission. The home page
// reviews section is hidden while this is empty.
const reviews: Review[] = [
  // PLACEHOLDER reviews: layout stand-ins only. Replace with genuine reviews
  // (with the guest's permission) before launch.
  {
    guestName: "Guest name",
    origin: "City",
    quote: "Placeholder: a genuine guest review from Google or Booking.com will go here.",
    rating: 5,
    source: "Google",
    date: "2026-09-01",
  },
  {
    guestName: "Guest name",
    origin: "City",
    quote: "Placeholder: a second genuine review, ideally from a business traveller.",
    rating: 5,
    source: "Booking.com",
    date: "2026-08-15",
  },
  {
    guestName: "Guest name",
    origin: "City",
    quote: "Placeholder: a third genuine review, ideally mentioning the restaurant or location.",
    rating: 4,
    source: "Google",
    date: "2026-07-20",
  },
];

const gallery: GalleryItem[] = [
  { type: "image", src: "/media/spaces/exterior-facade.jpg", alt: "The hotel's slate-grey facade with a timber entrance porch and blue lounge chairs", category: "Exterior", order: 1 },
  { type: "image", src: "/media/rooms/classic-room/02.jpg", alt: "Classic room bed with a charcoal velvet headboard", category: "Rooms", order: 2 },
  { type: "image", src: "/media/spaces/reception.jpg", alt: "Reception desk under a lit ceiling, with a glowing round feature light", category: "Lobby & spaces", order: 3 },
  { type: "image", src: "/media/dining/plantain-rice.jpg", alt: "Fried rice with prawns and sausage, served with fried plantain and cucumber", category: "Dining", order: 4 },
  { type: "image", src: "/media/rooms/deluxe-room/01.jpg", alt: "Deluxe room with gold accents and ambient ceiling lighting", category: "Rooms", order: 5 },
  { type: "image", src: "/media/spaces/entrance-porch.jpg", alt: "Timber entrance porch with planters and a green lawn mat", category: "Exterior", order: 6 },
  { type: "image", src: "/media/dining/lounge.jpg", alt: "Lounge with grey velvet sofas, marble floor and a TV showing football", category: "Dining", order: 7 },
  { type: "image", src: "/media/rooms/executive-suite/01.jpg", alt: "Executive suite with seating area and work desk", category: "Rooms", order: 8 },
  { type: "image", src: "/media/dining/lounge-seating.jpg", alt: "Two green armchairs around a small round table beside indoor plants", category: "Lobby & spaces", order: 9 },
  { type: "image", src: "/media/spaces/courtyard-parking.jpg", alt: "Paved courtyard with parked cars in front of the hotel", category: "Exterior", order: 10 },
  { type: "image", src: "/media/dining/bar-shelf.jpg", alt: "Timber wine rack stocked with wines and spirits", category: "Dining", order: 11 },
  { type: "image", src: "/media/rooms/walkthrough/01.jpg", alt: "Guest room with a dark headboard, red cushions and a red patterned rug", category: "Rooms", order: 12 },
  { type: "image", src: "/media/spaces/corridor.jpg", alt: "Upstairs corridor with marble-effect walls and a black room door", category: "Lobby & spaces", order: 13 },
  { type: "image", src: "/media/rooms/classic-room/01.jpg", alt: "Work desk and TV beside a marble feature wall", category: "Rooms", order: 14 },
  { type: "image", src: "/media/spaces/aerial-wide.jpg", alt: "Aerial view of the hotel compound on Elelenwo Street", category: "Exterior", order: 15 },
  { type: "image", src: "/media/dining/vegetable-salad.jpg", alt: "Vegetable salad with sweetcorn and peas beside a stir-fried side dish", category: "Dining", order: 16 },
  { type: "image", src: "/media/spaces/glass-entrance.jpg", alt: "Glass entrance under a shingle canopy, flanked by potted palms", category: "Exterior", order: 17 },
  { type: "image", src: "/media/rooms/walkthrough/02.jpg", alt: "Made bed with red accent pillows and runner", category: "Rooms", order: 18 },
  { type: "image", src: "/media/spaces/lobby-seating.jpg", alt: "Lobby seating with green armchairs and bamboo planters", category: "Lobby & spaces", order: 19 },
  { type: "image", src: "/media/spaces/aerial-front.jpg", alt: "The hotel's front gate and orange-clad upper floor", category: "Exterior", order: 20 },
  { type: "image", src: "/media/dining/lounge-corner.jpg", alt: "Quiet lounge corner with grey armchairs under blue ceiling light", category: "Dining", order: 21 },
  { type: "image", src: "/media/rooms/walkthrough/03.jpg", alt: "Guest room seating by floor-length curtains", category: "Rooms", order: 22 },
  { type: "video", src: "/media/brand/brand-film.mp4", poster: "/media/spaces/lobby-seating.jpg", alt: "Walkthrough from the lobby, along the corridor and into a guest room", category: "Video", caption: "Inside the hotel", order: 23 },
  { type: "video", src: "/media/dining/dining-film.mp4", poster: "/media/hero/hero-poster.jpg", alt: "Arriving at the hotel, through reception to the lounge and the plates", category: "Video", caption: "Arrival and dining", order: 24 },
];

const faqs: Faq[] = [
  {
    question: "What are the check-in and check-out times?",
    answer: `Check-in is from ${siteSettings.checkInTime} and check-out is by ${siteSettings.checkOutTime}. If you're arriving early or leaving late, message us on WhatsApp and we'll do our best to help.`,
    order: 1,
  },
  {
    question: "How can I pay?",
    answer:
      "You can pay online by card, bank transfer or USSD through Paystack when you book, or pay at the hotel on arrival.",
    order: 2,
  },
  {
    question: "Do I need ID to check in?",
    answer: "Yes. Please bring a valid government-issued photo ID, such as a passport, driver's licence or national ID card.",
    order: 3,
  },
  {
    question: "Is there parking?",
    answer: "Yes. Guests can park inside our gated courtyard, which is monitored by security.",
    order: 4,
  },
  {
    // TODO(content): confirm whether airport pickup is offered and its cost
    question: "Can you arrange an airport pickup?",
    answer:
      "Message reservations on WhatsApp with your flight details and we'll let you know what we can arrange and the cost.",
    order: 5,
  },
  {
    // TODO(content): cancellation policy
    question: "What is the cancellation policy?",
    answer: "Our cancellation terms are set out on the booking terms page. If your plans change, contact reservations as early as you can.",
    order: 6,
  },
  {
    // TODO(content): pet policy
    question: "Can I bring a pet?",
    answer: "Please contact reservations before booking if you'd like to travel with a pet.",
    order: 7,
  },
  {
    // TODO(content): children policy
    question: "Are children welcome?",
    answer: "Yes. Add children when you check availability, and let us know in your special requests if you need an extra bed or cot.",
    order: 8,
  },
];

// ——— Getters (swap for Sanity queries later) ———

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/** Rooms sorted by price ascending; rooms without a confirmed rate go last. */
export async function getRooms(): Promise<Room[]> {
  return [...rooms].sort((a, b) => {
    if (a.priceFrom === null && b.priceFrom === null) return a.order - b.order;
    if (a.priceFrom === null) return 1;
    if (b.priceFrom === null) return -1;
    return a.priceFrom - b.priceFrom;
  });
}

export async function getRoom(slug: string) {
  return rooms.find((r) => r.slug === slug) ?? null;
}

export async function getFeaturedRooms() {
  return (await getRooms()).filter((r) => r.featured).slice(0, 4);
}

/** Lowest confirmed nightly rate, or null if none is confirmed. */
export function getLowestRate(): number | null {
  const prices = rooms.map((r) => r.priceFrom).filter((p): p is number => p !== null);
  return prices.length ? Math.min(...prices) : null;
}

export const getAmenities = async () => [...amenities].sort(byOrder);
export const getMenu = async () => [...menu].sort(byOrder);
export const getOffers = async () => offers;
export const getOffer = async (slug: string) => offers.find((o) => o.slug === slug) ?? null;
export const getReviews = async () => reviews;
export const getGallery = async () => [...gallery].sort(byOrder);
export const getFaqs = async () => [...faqs].sort(byOrder);

/** Synchronous room list for client components (booking flow). */
export const roomsForBooking = () =>
  rooms
    .slice()
    .sort(byOrder)
    .map(({ name, slug, priceFrom, weekendPrice, maxGuests, bedType, images, keyFeatures }) => ({
      name,
      slug,
      priceFrom,
      weekendPrice,
      maxGuests,
      bedType,
      image: images[0],
      keyFeatures,
    }));

/** Offers for client-side promo display; the server re-validates codes. */
export const offersForBooking = () => offers;
