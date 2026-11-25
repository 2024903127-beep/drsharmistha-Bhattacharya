import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSession } from "@/lib/session";
import { getLastRxSnapshot, saveLastRxSnapshot } from "@/lib/templates-repo";

const SnapshotSchema = z.object({
  patientId: z.string().min(1).max(120),
  appointmentId: z.string().max(120).nullable().optional(),
  snapshot: z.object({
    notes: z.string().max(1500).optional(),
    service: z.string().max(200).optional(),
    medicines: z.array(
      z.object({
        name: z.string().max(160),
        dose: z.string().max(80),
        freq: z.string().max(80),
        days: z.string().max(80),
        timing: z.string().max(120).optional(),
      })
    ),
    investigations: z.array(
      z.object({
        name: z.string().max(160),
        bodyPart: z.string().max(120).optional(),
      })
    ),
    beforeSurgery: z.string().max(4000).optional(),
    dayOfSurgery: z.string().max(4000).optional(),
    afterDischarge: z.string().max(4000).optional(),
    advice: z.string().max(4000).optional(),
    followUp: z.string().max(240).optional(),
  }),
});

export async function GET(req: Request) {
  const s = await apiSession("consultation", "patients");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  const patientId = new URL(req.url).searchParams.get("patientId") || "";
  if (!patientId) return NextResponse.json({ ok: false, error: "Missing patientId." }, { status: 400 });
  const snapshot = await getLastRxSnapshot(patientId);
  return NextResponse.json({ ok: true, snapshot });
}

export async function POST(req: Request) {
  const s = await apiSession("consultation");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = SnapshotSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid Rx snapshot." }, { status: 400 });
  await saveLastRxSnapshot(
    parsed.data.patientId,
    parsed.data.appointmentId ?? null,
    parsed.data.snapshot,
    s.uid
  );
  return NextResponse.json({ ok: true });
}
