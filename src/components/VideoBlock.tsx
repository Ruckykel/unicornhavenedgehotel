"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { SmartImage } from "./SmartImage";

type Props = {
  src: string;
  poster: string;
  title: string;
  description: string;
  className?: string;
  /** Aspect ratio of the frame. The supplied films are vertical (9:16). */
  aspect?: string;
  sizes?: string;
};

/** Poster + play button; the video only loads when the guest presses play. */
export function VideoBlock({ src, poster, title, description, className = "", aspect = "aspect-[9/16]", sizes }: Props) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <figure className={className}>
      <div className={`relative overflow-hidden bg-ink ${aspect}`}>
        {active ? (
          <video
            ref={ref}
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            aria-label={description}
          />
        ) : (
          <button type="button" onClick={() => setActive(true)} className="group absolute inset-0 h-full w-full">
            <SmartImage src={poster} alt="" fill sizes={sizes ?? "(min-width: 1024px) 40vw, 100vw"} className="object-cover" />
            <span className="absolute inset-0 bg-ink/25 transition-colors group-hover:bg-ink/35" />
            <span className="absolute left-1/2 top-1/2 inline-flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-porcelain/80 bg-ink/30 text-porcelain backdrop-blur-sm transition-transform group-hover:scale-105">
              <Play aria-hidden className="ml-1 h-7 w-7" strokeWidth={1.5} />
            </span>
            <span className="sr-only">Play video: {title}</span>
          </button>
        )}
      </div>
      <figcaption className="sr-only">{description}</figcaption>
    </figure>
  );
}
