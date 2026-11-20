import "server-only";
import { db, dbConfigured } from "./db";

const mem = new Map<string, { n: number; t: number }>(); // development fallback only
export const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";

// Returns true when the request is allowed.
export async function allow(key: string, max: number, windowSec: number) {
  if (dbConfigured()) {
    const { data, error } = await db().rpc("rate_limit", { p_key: key, p_max: max, p_window_seconds: windowSec });
    return error ? true : Boolean(data); // fail open: a limiter outage must not block patients
  }
  const now = Date.now(), e = mem.get(key);
  if (!e || now - e.t > windowSec * 1000) { mem.set(key, { n: 1, t: now }); return true; }
  return ++e.n <= max;
}
