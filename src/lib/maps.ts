import { siteSettings } from "./content";

export function directionsUrl() {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(siteSettings.mapQuery)}`;
}
