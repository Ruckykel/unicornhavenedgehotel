"use client";

import { useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  label: string;
  children: ReactNode[];
  /** Tailwind width classes for each slide. */
  slideClass?: string;
  tone?: "light" | "dark";
};

/** Scroll-snap carousel: native swipe on touch, buttons and arrow keys elsewhere. */
export function Carousel({ label, children, slideClass = "w-full", tone = "light" }: Props) {
  const ref = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(children.length <= 1);

  function onScroll() {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  function go(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const slide = el.firstElementChild as HTMLElement | null;
    el.scrollBy({ left: dir * (slide?.offsetWidth ?? el.clientWidth), behavior: "smooth" });
  }

  const btn =
    tone === "dark"
      ? "border-porcelain/40 text-porcelain hover:bg-porcelain/10"
      : "border-ink/30 text-ink hover:bg-ink hover:text-porcelain";

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={ref}
        onScroll={onScroll}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto focus-visible:outline-offset-4"
      >
        {children.map((c, i) => (
          <li
            key={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${children.length}`}
            className={`shrink-0 snap-start ${slideClass}`}
          >
            {c}
          </li>
        ))}
      </ul>
      {children.length > 1 && (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={atStart}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-30 ${btn}`}
          >
            <ChevronLeft aria-hidden className="h-5 w-5" strokeWidth={1.5} />
            <span className="sr-only">Previous</span>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={atEnd}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors disabled:opacity-30 ${btn}`}
          >
            <ChevronRight aria-hidden className="h-5 w-5" strokeWidth={1.5} />
            <span className="sr-only">Next</span>
          </button>
        </div>
      )}
    </div>
  );
}
