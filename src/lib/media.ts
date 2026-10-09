import manifest from "./media-manifest.json";

type Entry = { width: number; height: number; blurDataURL: string };
const m = manifest as Record<string, Entry>;

/** Intrinsic size + blur placeholder for an image under /public/media. */
export function mediaInfo(src: string): Entry | undefined {
  return m[src];
}
