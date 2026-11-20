import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { audit } from "@/lib/audit";

// GET /api/staff/patients?q=... -> search patients
export async function GET(req: Request) {
  const s = await apiSession("patients", "consultation", "appointments", "dashboard");
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!dbConfigured()) {
    return NextResponse.json({ ok: true, patients: [] });
  }

  let query = db()
    .from("patients")
    .select("id,patient_no,full_name,phone,email,created_at,appointments(id,starts_at,service,status)")
    .order("created_at", { ascending: false })
    .limit(25);

  if (q) {
    // Search across name, phone, or patient_no
    query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,patient_no.ilike.%${q}%`);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const patients = (data ?? []).map((p: any) => {
    const visits = (p.appointments ?? []).filter((a: any) => a.status !== "expired");
    visits.sort((a: any, b: any) => b.starts_at.localeCompare(a.starts_at));
    const last = visits[0];
    return {
      id: p.id,
      patientNo: p.patient_no || `PT-${p.id.slice(0, 4).toUpperCase()}`,
      name: p.full_name,
      phone: p.phone,
      email: p.email ?? "",
      lastVisit: last ? `${last.service} on ${new Date(last.starts_at).toLocaleDateString("en-IN")}` : "New patient",
      proc: last?.service ?? "General",
    };
  });

  return NextResponse.json({ ok: true, patients });
}

// POST /api/staff/patients -> register patient (and optionally start consultation)
export async function POST(req: Request) {
  const s = await apiSession("patients", "consultation", "appointments");
  if (!s) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = body.name?.trim();
  const rawPhone = body.phone?.trim();
  const email = body.email?.trim() || null;
  const service = body.service?.trim() || "General Plastic Surgery Consultation";
  const mode = body.mode === "online" ? "online" : "in_person";
  const notes = body.notes?.trim() || null;
  const startConsultation = Boolean(body.startConsultation);

  if (!name || !rawPhone) {
    return NextResponse.json({ ok: false, error: "Patient name and phone number are required." }, { status: 400 });
  }

  const phone = normalizePhone(rawPhone);
  if (!phone || phone.length < 10) {
    return NextResponse.json({ ok: false, error: "Please enter a valid 10-digit phone number." }, { status: 400 });
  }

  if (!dbConfigured()) {
    return NextResponse.json({
      ok: true,
      patient: { id: "demo-p1", patientNo: "PT-1001", name, phone, email },
      appointmentId: startConsultation ? "demo-appt-1" : undefined,
    });
  }

  // 1. Check or upsert patient
  const { data: patient, error: pe } = await db()
    .from("patients")
    .upsert(
      { full_name: name, phone, ...(email ? { email } : {}) },
      { onConflict: "phone" }
    )
    .select("id,patient_no,full_name,phone,email")
    .single();

  if (pe || !patient) {
    return NextResponse.json({ ok: false, error: pe?.message || "Failed to save patient." }, { status: 500 });
  }

  await audit(
    { uid: s.uid, name: s.name },
    "registered_patient",
    "patient",
    patient.id,
    { name: patient.full_name, phone: patient.phone, patient_no: patient.patient_no }
  );

  let appointmentId: string | undefined;

  // 2. If immediate consultation requested, create confirmed appointment right now
  if (startConsultation) {
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
      return NextResponse.json({
        ok: false,
        error: `Patient registered as ${patient.patient_no}, but could not create consultation: ${ae?.message}`,
      }, { status: 500 });
    }

    appointmentId = appt.id;
    await audit(
      { uid: s.uid, name: s.name },
      "started_consultation",
      "appointment",
      appt.id,
      { patientId: patient.id, service, mode }
    );
  }

  return NextResponse.json({
    ok: true,
    patient: {
      id: patient.id,
      patientNo: patient.patient_no || `PT-${patient.id.slice(0, 4).toUpperCase()}`,
      name: patient.full_name,
      phone: patient.phone,
      email: patient.email,
    },
    appointmentId,
  });
}
