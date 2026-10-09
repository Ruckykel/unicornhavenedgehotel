import { Star } from "lucide-react";
import type { Review } from "@/lib/types";

/** Scroll-snap row of reviews. Renders nothing when there are no reviews. */
export function TestimonialSlider({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <div>
      <p className="mb-8 flex items-center gap-2 text-sm text-stone-deep">
        <span className="flex text-brass" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="h-4 w-4" fill={i < Math.round(avg) ? "currentColor" : "none"} strokeWidth={1.5} />
          ))}
        </span>
        <span>
          {avg.toFixed(1)} out of 5 from {reviews.length} guest review{reviews.length > 1 ? "s" : ""}
        </span>
      </p>
      <ul className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {reviews.map((r) => (
          <li key={`${r.guestName}-${r.date}`} className="w-[85%] shrink-0 snap-start border-t border-ink pt-6 md:w-auto">
            <blockquote>
              <p className="font-display text-lg leading-snug">&ldquo;{r.quote}&rdquo;</p>
              <footer className="mt-5 text-sm">
                <span className="font-semibold">{r.guestName}</span>
                {r.origin && <span className="text-stone-deep">, {r.origin}</span>}
                <span className="block text-stone-deep">
                  {r.rating}/5 on {r.source}
                </span>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
}
