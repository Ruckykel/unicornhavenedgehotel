import type { MetadataRoute } from "next";
import { getRooms } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await getRooms();
  const now = new Date();
  const pages: [string, number][] = [
    ["/", 1],
    ["/rooms", 0.9],
    ["/dining", 0.7],
    ["/about", 0.6],
    ["/gallery", 0.6],
    ["/offers", 0.7],
    ["/contact", 0.7],
    ["/privacy", 0.2],
    ["/terms", 0.3],
  ];
  return [
    ...pages.map(([path, priority]) => ({ url: `${SITE_URL}${path}`, lastModified: now, priority })),
    ...rooms.map((r) => ({ url: `${SITE_URL}/rooms/${r.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
