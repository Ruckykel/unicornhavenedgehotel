import { BadgeSeal } from "./BadgeSeal";

/**
 * First-load reveal: the badge ring draws in (900ms), the mark fades up, then
 * the overlay fades away to the hero. Pure CSS (globals.css), shown once per
 * session and skipped entirely with prefers-reduced-motion.
 */
export function SealLoader() {
  return (
    <div aria-hidden className="seal-loader pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-ink text-porcelain">
      <BadgeSeal className="h-36 w-36 md:h-44 md:w-44" title="" />
    </div>
  );
}
