"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  mobileSrc: string;
  desktopSrc: string;
  poster: string;
  className?: string;
};

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * Muted looping hero video. Never autoplays on Save-Data, slow connections or
 * reduced motion — the poster (rendered by the parent as the LCP image) shows
 * instead. Includes a pause control (WCAG 2.2.2).
 */
export function HeroVideo({ mobileSrc, desktopSrc, poster, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInfo }).connection;
    const slow = conn?.saveData || /(^|-)2g$|^3g$/.test(conn?.effectiveType ?? "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (slow || reduced) return;
    // Start the video only after the page has loaded and gone idle, so it
    // never competes with the poster, fonts or scripts for bandwidth.
    const start = () => setSrc(window.matchMedia("(min-width: 1024px)").matches ? desktopSrc : mobileSrc);
    const idle = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(start, { timeout: 2500 });
      else setTimeout(start, 1200);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener("load", idle);
  }, [mobileSrc, desktopSrc]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !src) return;
    v.play().catch(() => setPlaying(false));
  }, [src]);

  if (!src) return null;

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  }

  return (
    <>
      <video
        ref={ref}
        className={`${className} transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 right-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink/40 text-porcelain backdrop-blur hover:bg-ink/60"
      >
        {playing ? <Pause aria-hidden className="h-4 w-4" /> : <Play aria-hidden className="h-4 w-4" />}
        <span className="sr-only">{playing ? "Pause background video" : "Play background video"}</span>
      </button>
    </>
  );
}
