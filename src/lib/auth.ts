// Signed-cookie sessions. Credentials are checked against Supabase Auth (or demo users in development). Edge-safe: no Node imports.
export type Role = "admin" | "doctor" | "receptionist" | "coordinator";
export type Session = { uid: string; name: string; role: Role; exp: number };
export const COOKIE = "staff_session";

const enc = new TextEncoder();
function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") throw new Error("AUTH_SECRET is required in production");
  return s ?? "dev-only-secret-change-me";
}
let _cachedKey: CryptoKey | null = null;
const key = async () => (_cachedKey ??= await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]));
const b64 = (b: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

export async function signToken(payload: Record<string, unknown>, ttlMs: number) {
  const body = b64(enc.encode(JSON.stringify({ ...payload, exp: Date.now() + ttlMs })));
  const sig = b64(await crypto.subtle.sign("HMAC", await key(), enc.encode(body)));
  return `${body}.${sig}`;
}

export async function verifyToken<T>(token?: string): Promise<(T & { exp: number }) | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    if (!(await crypto.subtle.verify("HMAC", await key(), unb64(sig), enc.encode(body)))) return null;
    const p = JSON.parse(new TextDecoder().decode(unb64(body))) as T & { exp: number };
    return p.exp > Date.now() ? p : null;
  } catch { return null; }
}

export const signSession = (s: Omit<Session, "exp">, hours = 8) => signToken({ ...s, t: "s" }, hours * 3600_000);
export async function verifySession(token?: string): Promise<Session | null> {
  const p = await verifyToken<Session & { t?: string }>(token);
  return p && p.t === "s" ? p : null;
}
