import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { COOKIE, signSession } from "@/lib/auth";
import { demoPassword, demoUsers } from "@/lib/demo-users";
import { db, dbConfigured } from "@/lib/db";
import { allow, clientIp } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

const deny = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const { email: raw, password } = (await req.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = raw?.trim().toLowerCase() ?? "";
  if (!email || !password) return deny("Enter your email and password.", 400);

  // Run rate limit checks in parallel for lower latency
  const [ipOk, emailOk] = await Promise.all([
    allow(`login:ip:${clientIp(req)}`, 20, 600),
    allow(`login:${email}`, 8, 600),
  ]);
  if (!ipOk || !emailOk) return deny("Too many attempts. Wait ten minutes and try again.", 429);

  let user: { uid: string; name: string; role: "admin" | "doctor" | "receptionist" | "coordinator" } | null = null;
  if (dbConfigured()) {
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anon) return deny("Sign-in is not configured.", 503);
    const { data, error } = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, anon, { auth: { persistSession: false } }).auth.signInWithPassword({ email, password });
    if (error || !data.user) { await audit(null, "login_failed", "staff", undefined, { email }); return deny("Email or password is incorrect.", 401); }
    const { data: s } = await db().from("staff").select("id,full_name,role,active").eq("id", data.user.id).maybeSingle();
    if (!s || !s.active) return deny("This account is not active. Ask the clinic owner for access.", 403);
    user = { uid: s.id, name: s.full_name, role: s.role };
  } else {
    // Development demo accounts (no database). Disabled in production unless explicitly allowed for a private preview.
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_AUTH !== "true") return deny("Sign-in is not enabled yet.", 503);
    const u = demoUsers.find((x) => x.email === email);
    if (!u || password !== demoPassword()) return deny("Email or password is incorrect.", 401);
    user = { uid: u.uid, name: u.name, role: u.role };
  }

  // Generate session token and write audit log concurrently
  const [token] = await Promise.all([
    signSession(user),
    audit(user, "signed_in", "staff", user.uid).catch(() => null),
  ]);

  const res = NextResponse.json({ ok: true, role: user.role });
  res.cookies.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 8 * 3600 });
  return res;
}
