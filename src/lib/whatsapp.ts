import { siteSettings } from "./content";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteSettings.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

const PAGE_TOPICS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [/^\/rooms\/([^/]+)/, (m) => `the ${titleFromSlug(m[1])}`],
  [/^\/rooms/, () => "your rooms"],
  [/^\/dining/, () => "the restaurant"],
  [/^\/offers/, () => "your offers and corporate rates"],
  [/^\/book/, () => "a booking"],
  [/^\/gallery/, () => "staying at the hotel"],
  [/^\/about/, () => "the hotel"],
  [/^\/contact/, () => "the hotel"],
];

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Prefilled WhatsApp message for the page the guest is on. */
export function whatsappMessageForPath(pathname: string) {
  for (const [re, topic] of PAGE_TOPICS) {
    const m = pathname.match(re);
    if (m) return `Hi, I'd like to enquire about ${topic(m)}.`;
  }
  return "Hi, I'd like to enquire about a stay at Unicorn Haven Edge Hotel.";
}
