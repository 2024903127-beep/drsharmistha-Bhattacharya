import { NextResponse } from "next/server";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { audit } from "@/lib/audit";
import { LEAD_STATUSES } from "@/lib/constants";


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await apiSession("leads");
  const { status } = (await req.json().catch(() => ({}))) as { status?: string };
  if (!s || !status || !LEAD_STATUSES.includes(status)) return NextResponse.json({ ok: false }, { status: s ? 400 : 403 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Connect the database first." }, { status: 503 });
  const id = (await params).id;
  const { error } = await db().from("leads").update({ status }).eq("id", id);
  if (!error) await audit(s, "updated_lead", "lead", id, { status });
  return NextResponse.json({ ok: !error });
}
