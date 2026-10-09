"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { getLowestRate, roomsForBooking } from "@/lib/content";
import { BookingWidget } from "./BookingWidget";
import { PriceTag } from "./PriceTag";
import { buttonClass } from "./Button";
import { useFocusTrap } from "./useFocusTrap";

/** Fixed bottom bar on mobile; opens a compact booking sheet. Hidden on /book. */
export function MobileBookingBar() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const roomSlug = pathname.match(/^\/rooms\/([^/]+)/)?.[1];
  const room = roomSlug ? roomsForBooking().find((r) => r.slug === roomSlug) : undefined;
  const price = room ? room.priceFrom : getLowestRate();

  useEffect(() => setOpen(false), [pathname]);
  useFocusTrap(sheetRef, open, () => {
    setOpen(false);
    triggerRef.current?.focus();
  });

  if (pathname.startsWith("/book")) return null;

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-porcelain/10 bg-mangrove text-porcelain md:hidden">
        <div className="flex h-[68px] items-center justify-between gap-3 px-4">
          <p className="text-sm leading-tight">
            {room && <span className="block text-xs text-sage">{room.name}</span>}
            <PriceTag amount={price} />
          </p>
          <button
            ref={triggerRef}
            type="button"
            className={buttonClass("primary", "px-4")}
            aria-expanded={open}
            aria-controls="booking-sheet"
            onClick={() => setOpen(true)}
          >
            Check availability
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[55] bg-ink/50 transition-opacity md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        id="booking-sheet"
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-sheet-title"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto bg-porcelain px-4 pb-6 pt-4 md:hidden"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="booking-sheet-title" className="text-xl">
            {room ? `Book the ${room.name}` : "Check availability"}
          </h2>
          <button
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
          >
            <X aria-hidden className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        <BookingWidget variant="compact" room={room?.slug} onSubmitted={() => setOpen(false)} />
      </div>
    </>
  );
}
