import { useId } from "react";
import { UNICORN_PATH, UNICORN_VIEWBOX } from "@/lib/unicorn-path";

type Props = {
  className?: string;
  /** `full` = ring + circular lettering + mark; `mark` = inner ring + unicorn (for ≤48px). */
  variant?: "full" | "mark";
  title?: string;
};

/**
 * The Unicorn Haven Edge badge, rebuilt as SVG. The unicorn and inner ring are
 * traced from the client's logo; the outer ring and lettering are live SVG so
 * they stay crisp. Uses currentColor. Ring strokes use pathLength=1 so CSS can
 * animate them (see .seal-loader in globals.css).
 */
export function BadgeSeal({ className, variant = "full", title = "Unicorn Haven Edge" }: Props) {
  const id = useId().replace(/:/g, "");
  const decorative = title === "";

  if (variant === "mark") {
    return (
      <svg
        viewBox={UNICORN_VIEWBOX}
        className={className}
        role={decorative ? undefined : "img"}
        aria-hidden={decorative || undefined}
        aria-label={decorative ? undefined : title}
        fill="currentColor"
      >
        <path d={UNICORN_PATH} />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 462 462"
      className={className}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      <defs>
        <path id={`${id}-top`} d="M 43 231 A 188 188 0 0 1 419 231" />
        <path id={`${id}-bottom`} d="M 21 231 A 210 210 0 0 0 441 231" />
      </defs>
      <circle
        className="seal-ring"
        cx="231"
        cy="231"
        r="226"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        pathLength={1}
      />
      <circle
        className="seal-ring seal-ring-inner"
        cx="231"
        cy="231"
        r="219"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        pathLength={1}
      />
      <g
        className="seal-text"
        fill="currentColor"
        fontFamily="var(--font-bodoni), Georgia, serif"
        fontSize="29"
        letterSpacing="7"
      >
        <text>
          <textPath href={`#${id}-top`} startOffset="50%" textAnchor="middle">
            UNICORN HAVEN EDGE
          </textPath>
        </text>
        <text>
          <textPath href={`#${id}-bottom`} startOffset="50%" textAnchor="middle">
            UNICORN HAVEN EDGE
          </textPath>
        </text>
      </g>
      <svg className="seal-mark" x="89" y="91" width="284" height="284" viewBox={UNICORN_VIEWBOX}>
        <path d={UNICORN_PATH} fill="currentColor" />
      </svg>
    </svg>
  );
}
