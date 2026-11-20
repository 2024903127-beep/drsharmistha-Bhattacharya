import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { ALLOWED_MIME, DOC_KINDS, MAX_BYTES, saveDocument } from "@/lib/documents";
import { putFile } from "@/lib/integrations/r2";
import { audit } from "@/lib/audit";

const bad = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const s = await apiSession("consultation", "patients");
  if (!s) return bad("Not allowed.", 403);
  const fd = await req.formData(), f = fd.get("file"), kind = String(fd.get("kind") ?? "report");
  if (!(f instanceof File) || f.size === 0 || f.size > MAX_BYTES) return bad("Choose a file smaller than 4 MB.");
  if (!ALLOWED_MIME.includes(f.type)) return bad("Only PDF and image files (JPG, PNG, WebP, HEIC) are allowed.");
  if (!DOC_KINDS.includes(kind as never) || kind === "invoice") return bad("Unknown document type.");
  const bytes = Buffer.from(await f.arrayBuffer());

  if (!dbConfigured()) { // development without a database: keep the file locally so the screen can be tried
    await putFile(`dev/${randomUUID()}-${f.name.replace(/[^\w.-]/g, "_")}`, bytes, f.type);
    return NextResponse.json({ ok: true, id: `local-${randomUUID()}`, name: f.name, local: true });
  }
  let patientId = String(fd.get("patient") ?? ""), appointmentId = String(fd.get("appointment") ?? "") || null;
  if (appointmentId) {
    const { data } = await db().from("appointments").select("patient_id").eq("id", appointmentId).maybeSingle();
    if (!data) return bad("Appointment not found.", 404);
    patientId = data.patient_id;
  }
  if (!patientId) return bad("No patient selected.");
  const doc = await saveDocument({ patientId, appointmentId, kind, filename: f.name, mime: f.type, bytes, createdBy: s.uid });
  await audit(s, "uploaded_document", "document", doc.id, { kind });
  return NextResponse.json({ ok: true, id: doc.id, name: doc.filename });
}
