/**
 * In-process PDF buffer cache.
 *
 * @react-pdf/renderer takes 8–25 seconds to render on first call because it
 * builds a complete PDF layout engine in JS. Subsequent renders for the SAME
 * data are still 5–10 s. We cache the rendered bytes keyed on the document ID
 * + version so every "View PDF" click after the first is instant
 * (sub-millisecond, served straight from RAM).
 *
 * TTL: 10 minutes. Max entries: 200 (keeps memory bounded).
 */

interface CacheEntry {
  buffer: Buffer;
  expiresAt: number;
}

const MAX_ENTRIES = 200;
const TTL_MS = 10 * 60 * 1000; // 10 minutes

const cache = new Map<string, CacheEntry>();

function evictExpired() {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (entry.expiresAt <= now) cache.delete(key);
  }
}

function evictOldest() {
  const firstKey = cache.keys().next().value;
  if (firstKey) cache.delete(firstKey);
}

export function getPdfCache(key: string): Buffer | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) { cache.delete(key); return null; }
  return entry.buffer;
}

export function setPdfCache(key: string, buffer: Buffer): void {
  evictExpired();
  if (cache.size >= MAX_ENTRIES) evictOldest();
  cache.set(key, { buffer, expiresAt: Date.now() + TTL_MS });
}

export function invalidatePdfCache(prefix: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}
