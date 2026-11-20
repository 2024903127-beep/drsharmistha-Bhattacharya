import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSession } from "@/lib/session";
import { dbConfigured } from "@/lib/db";
import { cancelAppointment, completeAppointment, rescheduleAppointment } from "@/lib/booking";

const body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("complete") }), z.object({ action: z.literal("cancel") }),
  z.object({ action: z.literal("reschedule"), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), time: z.string().regex(/^\d{2}:\d{2}$/) }),
]);

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await apiSession("appointments", "consultation");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Connect the database to change appointments." }, { status: 503 });
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  const id = (await params).id, actor = { uid: s.uid, name: s.name };
  const r = p.data.action === "complete" ? await completeAppointment(id, actor) : p.data.action === "cancel" ? await cancelAppointment(id, actor) : await rescheduleAppointment(id, p.data.date, p.data.time, actor);
  return NextResponse.json(r, { status: r.ok ? 200 : 409 });
}
