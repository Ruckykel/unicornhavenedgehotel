export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.unicornhavenedgehotel.com").replace(/\/$/, "");

export const NAV_LINKS = [
  { href: "/rooms", label: "Rooms" },
  { href: "/dining", label: "Dining" },
  { href: "/about", label: "The Hotel" },
  { href: "/gallery", label: "Gallery" },
  { href: "/offers", label: "Offers" },
  { href: "/contact", label: "Contact" },
] as const;

export function pageTitle(page: string) {
  return `${page} | Unicorn Haven Edge Hotel, Port Harcourt`;
}
