import "server-only";
import { headers } from "next/headers";

// Simple in-memory limiter: fine for a single region and low volume. Swap for
// Upstash or Vercel KV if spam becomes a problem across instances.
const hits = new Map<string, number[]>();

export async function rateLimited(bucket: string, limit = 5, windowMs = 10 * 60_000) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}
