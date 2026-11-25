import { NextResponse } from "next/server";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { getDocument } from "@/lib/documents";
import { notifyDocument } from "@/lib/notify";
import { audit } from "@/lib/audit";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await apiSession("consultation", "patients");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Connect the database to send documents." }, { status: 503 });
  const doc = await getDocument((await params).id);
  if (!doc || doc.kind === "invoice") return NextResponse.json({ ok: false, error: "Document not found." }, { status: 404 });
  const { data: p } = await db().from("patients").select("id,full_name,phone,email").eq("id", doc.patient_id).single();
  const { data: a } = await db().from("documents").select("appointment_id").eq("id", doc.id).single();
  const r = await notifyDocument(doc, p!, a?.appointment_id);
  await audit(s, "sent_document", "document", doc.id, { kind: doc.kind });
  const [w, e] = r;
  const word = (x: typeof w) =>
    x.via === "text_fallback"
      ? `24h fallback only (${x.error ?? "template failed"})`
      : x.ok
        ? "sent"
        : x.skipped
          ? "not set up"
          : `failed (${x.error ?? "unknown error"})`;
  return NextResponse.json({ ok: w.ok || e.ok, summary: `WhatsApp: ${word(w)}. Email: ${e.skipped && !p?.email ? "no email on file" : word(e)}.` });
}
