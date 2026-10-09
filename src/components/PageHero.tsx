import type { ReactNode } from "react";
import { SmartImage } from "./SmartImage";

type Props = {
  title: string;
  intro?: ReactNode;
  image: { src: string; alt: string };
  /** CSS object-position, for vertical source photos. */
  position?: string;
  children?: ReactNode;
};

/** Image-led page header; the site header sits transparent over it. */
export function PageHero({ title, intro, image, position = "center", children }: Props) {
  return (
    <section data-hero className="relative flex min-h-[62svh] items-end overflow-hidden bg-ink text-porcelain md:min-h-[520px]">
      <SmartImage
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/45" />
      <div className="container-site relative pb-12 pt-32 md:pb-16">
        <h1 className="max-w-3xl text-3xl text-shadow-soft md:text-4xl">{title}</h1>
        {intro && <p className="mt-5 max-w-xl text-lg text-porcelain/90">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
