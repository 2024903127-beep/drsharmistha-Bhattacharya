import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { audit } from "@/lib/audit";

// POST /api/staff/consultations -> start a new consultation for an existing patient
export async function POST(req: Request) {
  const s = await apiSession("consultation", "patients", "appointments");
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const patientId = body.patientId?.trim();
  const service = body.service?.trim() || "General Plastic Surgery Consultation";
  const mode = body.mode === "online" ? "online" : "in_person";
  const notes = body.notes?.trim() || null;

  if (!patientId) {
    return NextResponse.json({ ok: false, error: "Patient ID is required." }, { status: 400 });
  }

  if (!dbConfigured()) {
    return NextResponse.json({ ok: true, appointmentId: "demo-appt-new" });
  }

  // Verify patient exists
  const { data: patient, error: pe } = await db()
    .from("patients")
    .select("id,full_name,patient_no")
    .eq("id", patientId)
    .maybeSingle();

  if (pe || !patient) {
    return NextResponse.json({ ok: false, error: "Patient not found." }, { status: 404 });
  }

  const start = new Date();
  const end = new Date(start.getTime() + 45 * 60_000);
  const ref = `BK-${randomUUID().slice(0, 8).toUpperCase()}`;

  const { data: appt, error: ae } = await db()
    .from("appointments")
    .insert({
      ref,
      patient_id: patient.id,
      service,
      mode,
      starts_at: start.toISOString(),
      ends_at: end.toISOString(),
      status: "confirmed",
      fee_paise: 0,
      notes,
    })
    .select("id")
    .single();

  if (ae || !appt) {
    return NextResponse.json({ ok: false, error: ae?.message || "Could not start consultation." }, { status: 500 });
  }

  await audit(
    { uid: s.uid, name: s.name },
    "started_consultation",
    "appointment",
    appt.id,
    { patientId: patient.id, service, mode, patient_no: patient.patient_no }
  );

  return NextResponse.json({ ok: true, appointmentId: appt.id });
}
