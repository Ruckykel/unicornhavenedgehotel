import Image, { type ImageProps } from "next/image";
import { mediaInfo } from "@/lib/media";

type Props = Omit<ImageProps, "src" | "width" | "height" | "placeholder" | "blurDataURL"> & { src: string };

/** next/image with the blur placeholder from the media manifest. */
export function SmartImage({ src, alt, fill, sizes, className, ...rest }: Props) {
  const info = mediaInfo(src);
  const blur = info ? { placeholder: "blur" as const, blurDataURL: info.blurDataURL } : {};
  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} className={className} {...blur} {...rest} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={info?.width ?? 1200}
      height={info?.height ?? 800}
      sizes={sizes ?? "100vw"}
      className={className}
      {...blur}
      {...rest}
    />
  );
}
