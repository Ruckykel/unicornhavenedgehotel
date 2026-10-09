import type { Amenity } from "@/lib/types";
import { AmenityIcon } from "./icons";

export function AmenityRow({ amenities }: { amenities: Amenity[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
      {amenities.map((a) => (
        <li key={a.name} className="flex flex-col gap-3">
          <AmenityIcon name={a.icon} className="h-7 w-7 text-mangrove" />
          <div>
            <p className="font-semibold">{a.name}</p>
            {a.detail && <p className="mt-1 text-sm text-stone-deep">{a.detail}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export function AmenityChecklist({ items, columns = 2 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`grid gap-x-8 gap-y-3 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((i) => (
        <li key={i} className="flex items-start gap-3 border-b border-mist pb-3">
          <span aria-hidden className="mt-2.5 h-1 w-3 shrink-0 bg-brass" />
          {i}
        </li>
      ))}
    </ul>
  );
}
