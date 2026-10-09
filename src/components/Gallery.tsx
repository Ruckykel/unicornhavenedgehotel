"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import type { GalleryCategory, GalleryItem } from "@/lib/types";
import { SmartImage } from "./SmartImage";
import { useFocusTrap } from "./useFocusTrap";

const ORDER: GalleryCategory[] = ["Rooms", "Dining", "Lobby & spaces", "Exterior", "Events", "Video"];

type Props = { items: GalleryItem[]; filters?: boolean };

export function Gallery({ items, filters = true }: Props) {
  // Only show tabs for categories that actually have items.
  const categories = ORDER.filter((c) => items.some((i) => i.category === c));
  const [active, setActive] = useState<GalleryCategory | "All">("All");
  const visible = active === "All" ? items : items.filter((i) => i.category === active);
  const [index, setIndex] = useState<number | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);

  return (
    <div>
      {filters && (
        <div role="group" aria-label="Filter gallery" className="scrollbar-none -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
          {(["All", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={active === c}
              onClick={() => setActive(c)}
              className={`min-h-[44px] shrink-0 rounded-sm border px-4 text-sm font-medium transition-colors ${
                active === c ? "border-ink bg-ink text-porcelain" : "border-stone/60 hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 [&>li]:mb-3 md:[&>li]:mb-4">
        {visible.map((item, i) => (
          <li key={item.src} className="break-inside-avoid">
            <button
              type="button"
              className="group relative block w-full overflow-hidden bg-mist"
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setIndex(i);
              }}
            >
              <SmartImage
                src={item.type === "video" ? item.poster! : item.src}
                alt={item.alt}
                sizes="(min-width: 768px) 33vw, 50vw"
                className="h-auto w-full transition-transform duration-700 ease-quiet group-hover:scale-[1.03]"
              />
              {item.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-porcelain text-porcelain">
                    <Play aria-hidden className="ml-0.5 h-5 w-5" />
                  </span>
                </span>
              )}
              <span className="sr-only">Open {item.type === "video" ? "video" : "image"} in viewer</span>
            </button>
          </li>
        ))}
      </ul>

      {index !== null && (
        <Lightbox
          items={visible}
          index={index}
          setIndex={setIndex}
          onClose={() => {
            setIndex(null);
            openerRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

function Lightbox({
  items,
  index,
  setIndex,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const item = items[index];
  const prev = useCallback(() => setIndex((index - 1 + items.length) % items.length), [index, items.length, setIndex]);
  const next = useCallback(() => setIndex((index + 1) % items.length), [index, items.length, setIndex]);

  useFocusTrap(ref, true, onClose);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [prev, next]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery viewer"
      className="fixed inset-0 z-[80] flex flex-col bg-ink/95 text-porcelain"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touchX.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm">
        <p aria-live="polite">
          {index + 1} / {items.length}
        </p>
        <button type="button" onClick={onClose} className="inline-flex h-11 w-11 items-center justify-center">
          <X aria-hidden className="h-6 w-6" strokeWidth={1.5} />
          <span className="sr-only">Close viewer</span>
        </button>
      </div>
      <div className="relative flex-1">
        {item.type === "video" ? (
          <video
            key={item.src}
            src={item.src}
            poster={item.poster}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 m-auto max-h-full max-w-full"
            aria-label={item.alt}
          />
        ) : (
          <SmartImage key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" />
        )}
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <button type="button" onClick={prev} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-porcelain/40 hover:bg-porcelain/10">
          <ChevronLeft aria-hidden className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </button>
        <p className="max-w-prose text-center text-sm text-sage">{item.caption ?? item.alt}</p>
        <button type="button" onClick={next} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-porcelain/40 hover:bg-porcelain/10">
          <ChevronRight aria-hidden className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </button>
      </div>
    </div>
  );
}
