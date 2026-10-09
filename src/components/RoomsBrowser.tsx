"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Room } from "@/lib/types";
import { RoomCard } from "./RoomCard";
import { PriceTag } from "./PriceTag";

type Filter = { label: string; test: (r: Room) => boolean };

const typeOf = (r: Room) => (/suite/i.test(r.name) ? "Suites" : "Rooms");

export function RoomsBrowser({ rooms }: { rooms: Room[] }) {
  const types = [...new Set(rooms.map(typeOf))];
  const guestCounts = [...new Set(rooms.map((r) => r.maxGuests))].sort((a, b) => a - b);
  const filters: Filter[] = [
    { label: "All", test: () => true },
    ...(types.length > 1 ? types.map((t) => ({ label: t, test: (r: Room) => typeOf(r) === t })) : []),
    ...(guestCounts.length > 1
      ? guestCounts.map((n) => ({ label: `${n}+ guests`, test: (r: Room) => r.maxGuests >= n }))
      : []),
  ];
  const [active, setActive] = useState("All");
  const filter = filters.find((f) => f.label === active) ?? filters[0];
  const visible = rooms.filter(filter.test);

  return (
    <>
      <h2 className="sr-only">All rooms</h2>
      {filters.length > 1 && (
        <div role="group" aria-label="Filter rooms" className="scrollbar-none -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {filters.map((f) => (
            <button
              key={f.label}
              type="button"
              aria-pressed={active === f.label}
              onClick={() => setActive(f.label)}
              className={`min-h-[44px] shrink-0 rounded-sm border px-4 text-sm font-medium transition-colors ${
                active === f.label ? "border-ink bg-ink text-porcelain" : "border-stone/60 hover:border-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} of {rooms.length} rooms
      </p>

      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((r, i) => (
          <RoomCard key={r.slug} room={r} priority={i === 0} />
        ))}
      </div>

      <div className="mt-section-sm md:mt-section">
        <details className="group md:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between border-y border-ink/15 py-5 text-xl font-display [&::-webkit-details-marker]:hidden">
            Compare rooms
            <ChevronDown aria-hidden className="h-5 w-5 transition-transform group-open:rotate-180" strokeWidth={1.5} />
          </summary>
          <CompareTable rooms={rooms} />
        </details>
        <div className="hidden md:block">
          <h2 className="mb-8 text-2xl">Compare rooms</h2>
          <CompareTable rooms={rooms} />
        </div>
      </div>
    </>
  );
}

function CompareTable({ rooms }: { rooms: Room[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">Room comparison: size, bed, guests and price</caption>
        <thead>
          <tr className="border-b border-ink text-stone-deep">
            <th scope="col" className="py-3 pr-4 font-medium">Room</th>
            <th scope="col" className="py-3 pr-4 font-medium">Size</th>
            <th scope="col" className="py-3 pr-4 font-medium">Bed</th>
            <th scope="col" className="py-3 pr-4 font-medium">Guests</th>
            <th scope="col" className="py-3 text-right font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.slug} className="border-b border-mist">
              <th scope="row" className="py-4 pr-4 font-display text-lg font-normal">
                <Link href={`/rooms/${r.slug}`} className="hover:underline">
                  {r.name}
                </Link>
              </th>
              <td className="py-4 pr-4">{r.sizeSqm ? `${r.sizeSqm} m²` : "—"}</td>
              <td className="py-4 pr-4">{r.bedType}</td>
              <td className="py-4 pr-4">Up to {r.maxGuests}</td>
              <td className="py-4 text-right">
                <PriceTag amount={r.priceFrom} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
