import Link from "next/link";
import { ArrowRight, BedDouble, Ruler, Users } from "lucide-react";
import type { Room } from "@/lib/types";
import { SmartImage } from "./SmartImage";
import { PriceTag } from "./PriceTag";

export function RoomCard({ room, priority = false, tone = "light" }: { room: Room; priority?: boolean; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-sage" : "text-stone-deep";
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-mist">
        <SmartImage
          src={room.images[0].src}
          alt={room.images[0].alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-700 ease-quiet group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <h3 className="text-xl">
          <Link href={`/rooms/${room.slug}`} className="after:absolute after:inset-0">
            {room.name}
          </Link>
        </h3>
        <ul className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm ${muted}`}>
          {room.sizeSqm && (
            <li className="flex items-center gap-1.5">
              <Ruler aria-hidden className="h-4 w-4" strokeWidth={1.5} /> {room.sizeSqm} m²
            </li>
          )}
          <li className="flex items-center gap-1.5">
            <Users aria-hidden className="h-4 w-4" strokeWidth={1.5} /> Up to {room.maxGuests} guests
          </li>
          <li className="flex items-center gap-1.5">
            <BedDouble aria-hidden className="h-4 w-4" strokeWidth={1.5} /> {room.bedType}
          </li>
        </ul>
        <p className={`mt-3 text-sm ${muted}`}>{room.keyFeatures.join(" · ")}</p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <PriceTag amount={room.priceFrom} className="text-base" />
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-1 underline-offset-[6px] group-hover:decoration-brass">
            View room <ArrowRight aria-hidden className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
