import { SmartImage } from "./SmartImage";

/** The badge's circular crop with a fine double ring — one feature image per page. */
export function CircleImage({
  src,
  alt,
  className = "",
  sizes,
  position = "center",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  position?: string;
}) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <div aria-hidden className="absolute inset-0 rounded-full border border-ink/70" />
      <div aria-hidden className="absolute inset-[7px] rounded-full border border-ink/30" />
      <div className="absolute inset-[16px] overflow-hidden rounded-full bg-mist">
        <SmartImage src={src} alt={alt} fill sizes={sizes ?? "(min-width: 1024px) 40vw, 80vw"} className="object-cover" style={{ objectPosition: position }} />
      </div>
    </div>
  );
}
