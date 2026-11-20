import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, verifySession, type Session } from "./auth";
import { can, type Module } from "./permissions";
import { db, dbConfigured } from "./db";

// Re-checks the staff row on every request, so deactivating someone or changing a role takes effect immediately.
export const getSession = cache(async (): Promise<Session | null> => {
  const s = await verifySession((await cookies()).get(COOKIE)?.value);
  if (!s || !dbConfigured()) return s;
  const { data } = await db().from("staff").select("full_name,role,active").eq("id", s.uid).maybeSingle();
  return data?.active ? { ...s, role: data.role, name: data.full_name } : null;
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
