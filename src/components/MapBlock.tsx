"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { siteSettings } from "@/lib/content";
import { SmartImage } from "./SmartImage";

/**
 * Google Maps embed behind a click-to-load facade, so slow connections never
 * pay for the map unless the guest asks for it.
 */
export function MapBlock({ className = "" }: { className?: string }) {
  const [load, setLoad] = useState(false);
  const q = encodeURIComponent(siteSettings.mapQuery);
  return (
    <div className={`relative overflow-hidden bg-mist ${className}`}>
      {load ? (
        <iframe
          title={`Map showing ${siteSettings.name}, ${siteSettings.mapQuery}`}
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <>
          <SmartImage
            src="/media/spaces/aerial-wide.jpg"
            alt="Aerial view of the hotel compound and Elelenwo Street"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/30" />
          <button
            type="button"
            onClick={() => setLoad(true)}
            className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-sm bg-porcelain px-5 py-3 text-sm font-semibold text-ink hover:bg-white"
          >
            <MapPin aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Show interactive map
          </button>
        </>
      )}
    </div>
  );
}
