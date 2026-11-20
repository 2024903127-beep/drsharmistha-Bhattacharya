import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { db, dbConfigured } from "@/lib/db";
import { allow, clientIp } from "@/lib/ratelimit";
import { normalizePhone } from "@/lib/phone";
import { notifyClinic } from "@/lib/notify";
import { esc } from "@/lib/integrations/brevo";

export async function POST(req: Request) {
  const parsed = leadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Check your details" }, { status: 400 });
  const l = parsed.data;
  if (l.website_hp) return NextResponse.json({ ok: true });
  if (!(await allow(`lead:${clientIp(req)}`, 5, 600))) return NextResponse.json({ ok: false, error: "Too many enquiries. Please call us." }, { status: 429 });
  if (dbConfigured()) {
    const { error } = await db().from("leads").insert({ name: l.name, phone: normalizePhone(l.phone), email: l.email || null, service: l.service ?? null, message: l.message ?? null, attribution: l.attribution ?? {} });
    if (error) return NextResponse.json({ ok: false, error: "Could not save your enquiry. Please call us." }, { status: 500 });
    await notifyClinic("New website enquiry", `<p><b>${esc(l.name)}</b>, ${esc(l.phone)}</p><p>${esc(l.message ?? "")}</p>`);
  }
  return NextResponse.json({ ok: true });
}
