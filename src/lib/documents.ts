import "server-only";
import { randomUUID } from "node:crypto";
import { db } from "./db";
import { getFile, putFile } from "./integrations/r2";
import { signToken, verifyToken } from "./auth";
import { site } from "./site";

export const DOC_KINDS = ["prescription_pad", "prescription_photo", "prescription_typed", "report", "invoice"] as const;
export const ALLOWED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp", "image/heic"];
// Vercel rejects request bodies over about 4.5 MB, so stay under it. Photos are compressed in the browser first.
export const MAX_BYTES = 4 * 1024 * 1024;

export async function saveDocument(o: { patientId: string; appointmentId?: string | null; kind: string; filename: string; mime: string; bytes: Buffer; createdBy?: string | null }) {
  const key = `patients/${o.patientId}/${randomUUID()}-${o.filename.replace(/[^\w.-]+/g, "_").slice(-80)}`;
  await putFile(key, o.bytes, o.mime);
  const { data, error } = await db().from("documents").insert({
    patient_id: o.patientId, appointment_id: o.appointmentId ?? null, kind: o.kind, storage_key: key, filename: o.filename, mime: o.mime, size_bytes: o.bytes.length, created_by: o.createdBy ?? null,
  }).select().single();
  if (error) throw error;
  return data as { id: string; patient_id: string; kind: string; filename: string; mime: string; storage_key: string };
}

export async function getDocument(id: string) {
  const { data } = await db().from("documents").select("id,patient_id,kind,filename,mime,storage_key").eq("id", id).maybeSingle();
  return data as { id: string; patient_id: string; kind: string; filename: string; mime: string; storage_key: string } | null;
}

export async function streamDocument(doc: { filename: string; mime: string; storage_key: string }) {
  return new Response(await getFile(doc.storage_key), {
    headers: { "Content-Type": doc.mime, "Content-Disposition": `inline; filename="${doc.filename.replace(/[^\w.-]/g, "_")}"`, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex", "X-Content-Type-Options": "nosniff" },
  });
}

// Patients have no login. They open a signed, expiring link: https://domain/d/<token>
export const docToken = (id: string, days = 30) => signToken({ t: "d", doc: id }, days * 864e5);
export const readDocToken = async (token: string) => { const p = await verifyToken<{ t?: string; doc?: string }>(token); return p?.t === "d" ? p.doc ?? null : null; };
export const docUrl = async (id: string, days = 30) => `${site.url}/d/${await docToken(id, days)}`;
