import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifySession, type Session } from "./auth";
import { can, type Module } from "./permissions";
import { db, dbConfigured } from "./db";

// In-memory cache with 60s TTL so tab switching doesn't do a remote DB query on every click.
const staffCache = new Map<string, { role: Session["role"]; name: string; active: boolean; exp: number }>();

export function invalidateStaffCache(uid?: string) {
  if (uid) staffCache.delete(uid);
  else staffCache.clear();
}

// Re-checks the staff row with a 60s fast memory cache so tab navigation is instant,
// while deactivations or role changes take effect immediately via invalidateStaffCache().
export const getSession = cache(async (): Promise<Session | null> => {
  const cookieVal = (await cookies()).get(COOKIE)?.value;
  const s = await verifySession(cookieVal);
  if (!s || !dbConfigured()) return s;

  const now = Date.now();
  const cached = staffCache.get(s.uid);
  if (cached && now < cached.exp) {
    return cached.active ? { ...s, role: cached.role, name: cached.name } : null;
  }

  const { data } = await db().from("staff").select("full_name,role,active").eq("id", s.uid).maybeSingle();
  if (data) {
    staffCache.set(s.uid, { role: data.role, name: data.full_name, active: Boolean(data.active), exp: now + 60_000 });
    return data.active ? { ...s, role: data.role, name: data.full_name } : null;
  }
  return null;
});

// Permission is checked on the server for every protected page. Never trust the UI alone.
export async function requireModule(mod: Module) {
  const s = await getSession();
  if (!s) redirect("/staff-login");
  if (!can(s.role, mod)) redirect("/staff/dashboard");
  return s;
}

// For API routes: returns the session, or null when missing or not allowed.
export async function apiSession(...mods: Module[]) {
  const s = await getSession();
  return s && mods.some((m) => can(s.role, m)) ? s : null;
}
