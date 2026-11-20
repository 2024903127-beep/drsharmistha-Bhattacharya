import "server-only";
import { randomUUID } from "node:crypto";
import { db, dbConfigured } from "./db";
import { slotsFor } from "./slots";
import { istTime, fmtDateLong, fmtTime } from "./fmt";
import { normalizePhone } from "./phone";
import { audit } from "./audit";
import { saveDocument } from "./documents";
import { buildInvoicePdf } from "./invoice";
import { notifyBookingConfirmed, notifyChange, notifyClinic, type A, type P } from "./notify";
import { createMeetEvent, deleteEvent, freeBusy, googleConfigured, moveEvent } from "./integrations/google";
import type { BookingInput } from "./validation";

const HOLD_MINUTES = 10, SLOT_MS = 3600_000;
export const slotStart = (date: string, time: string) => new Date(`${date}T${time}:00+05:30`);
type Actor = { uid?: string; name: string } | null;

export async function expireHolds() {
  await db().from("appointments").update({ status: "expired" }).eq("status", "held").lt("hold_expires_at", new Date().toISOString());
}

export async function availableSlots(date: string): Promise<string[]> {
  const base = slotsFor(date).filter((t) => slotStart(date, t).getTime() > Date.now() + 30 * 60_000);
  if (!base.length || !dbConfigured()) return base;
  await expireHolds();
  const from = new Date(`${date}T00:00:00+05:30`), to = new Date(from.getTime() + 864e5);
  const { data } = await db().from("appointments").select("starts_at").in("status", ["held", "confirmed"]).gte("starts_at", from.toISOString()).lt("starts_at", to.toISOString());
  const taken = new Set((data ?? []).map((r) => istTime(r.starts_at)));
  let busy: { start: string; end: string }[] = [];
  if (googleConfigured()) busy = await freeBusy(from, to).catch(() => []); // calendar outage must not block bookings
  return base.filter((t) => {
    if (taken.has(t)) return false;
    const s = slotStart(date, t).getTime(), e = s + SLOT_MS;
    return !busy.some((b) => new Date(b.start).getTime() < e && new Date(b.end).getTime() > s);
  });
}

// Reserve the slot for 10 minutes while the patient pays. The unique index makes double booking impossible.
export async function createHold(b: BookingInput & { phone: string }, feePaise: number) {
  const { data: patient, error: pe } = await db().from("patients")
    .upsert({ full_name: b.name, phone: normalizePhone(b.phone), ...(b.email ? { email: b.email } : {}) }, { onConflict: "phone" }).select().single();
  if (pe) throw pe;
  await expireHolds();
  const start = slotStart(b.date, b.time), ref = `BK-${randomUUID().slice(0, 8).toUpperCase()}`;
  const { data: appt, error } = await db().from("appointments").insert({
    ref, patient_id: patient.id, service: b.service, mode: "online", starts_at: start.toISOString(), ends_at: new Date(start.getTime() + SLOT_MS).toISOString(),
    status: "held", hold_expires_at: new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString(), fee_paise: feePaise, notes: b.message || null, attribution: b.attribution ?? {},
  }).select().single();
  if (error) return { taken: error.code === "23505", error };
  return { appt, patient };
}

export async function releaseHold(apptId: string) { await db().from("appointments").update({ status: "expired" }).eq("id", apptId).eq("status", "held"); }

// Called by BOTH the browser callback and the Razorpay webhook. Safe to run twice: only one caller wins the status change.
export async function confirmPayment(o: { orderId: string; paymentId: string; method?: string; raw?: object }) {
  const { data: pay } = await db().from("payments").select("*, appointments(*, patients(*))").eq("rzp_order_id", o.orderId).maybeSingle();
  if (!pay) return { ok: false as const, reason: "unknown_order" };
  const appt = pay.appointments, patient: P = appt.patients;
  await db().from("payments").update({ status: "captured", rzp_payment_id: o.paymentId, method: o.method ?? pay.method, captured_at: new Date().toISOString(), raw: o.raw ?? pay.raw }).eq("id", pay.id).neq("status", "refunded");
  const start = new Date(appt.starts_at).getTime();
  const { data: won, error } = await db().from("appointments").update({
    status: "confirmed", confirmed_at: new Date().toISOString(), hold_expires_at: null,
    reminded_24h: start - Date.now() < 24 * 3600e3, reminded_1h: start - Date.now() < 90 * 60e3, // do not remind about a slot booked minutes ago
  }).eq("id", appt.id).in("status", ["held", "expired"]).select().maybeSingle();
  if (error?.code === "23505") { // paid after the hold expired and someone else took the slot
    await db().from("appointments").update({ status: "conflict" }).eq("id", appt.id);
    await audit(null, "payment_slot_conflict", "appointment", appt.id, { orderId: o.orderId });
    await notifyClinic(`Action needed: paid booking ${appt.ref} lost its slot`, `<p>${patient.full_name} (${patient.phone}) paid after the slot hold expired and the slot was taken. Please reschedule or refund (Billing).</p>`);
    return { ok: true as const, conflict: true };
  }
  if (!won) return { ok: true as const, already: true };
  await afterConfirm(won, patient, pay);
  return { ok: true as const };
}

async function afterConfirm(a: any, p: P, pay: any) {
  let meetLink: string | null = a.meet_link;
  if (googleConfigured()) {
    try {
      const ev = await createMeetEvent({ summary: `Online consultation: ${p.full_name} (${a.service})`, description: `Booking ${a.ref}\nPhone: ${p.phone}\nProcedure: ${a.service}`, start: new Date(a.starts_at), end: new Date(a.ends_at), attendeeEmail: p.email ?? undefined, requestId: a.id });
      meetLink = ev.meetLink || null;
      await db().from("appointments").update({ meet_link: meetLink, google_event_id: ev.eventId }).eq("id", a.id);
    } catch (e) {
      await audit(null, "meet_link_failed", "appointment", a.id, { error: String(e) });
      await notifyClinic(`Meet link failed for ${a.ref}`, `<p>Booking ${a.ref} for ${p.full_name} is confirmed but the Google Meet link could not be created. Please send a link manually.</p>`);
    }
  }
  let inv: { docId: string; invoiceNo: string; amountInr: number } | null = null;
  try {
    const { data: no } = await db().rpc("next_invoice_no"), invoiceNo = String(no), amountInr = Math.round(pay.amount_paise / 100);
    const pdf = await buildInvoicePdf({ invoiceNo, date: fmtDateLong(new Date()), patient: p.full_name, phone: p.phone, service: a.service, slot: `${fmtDateLong(a.starts_at)}, ${fmtTime(a.starts_at)} IST`, amountInr, paymentId: pay.rzp_payment_id ?? "", method: pay.method ?? undefined });
    const doc = await saveDocument({ patientId: p.id, appointmentId: a.id, kind: "invoice", filename: `${invoiceNo}.pdf`, mime: "application/pdf", bytes: pdf });
    await db().from("payments").update({ invoice_no: invoiceNo }).eq("id", pay.id);
    inv = { docId: doc.id, invoiceNo, amountInr };
  } catch (e) { await audit(null, "invoice_failed", "payment", pay.id, { error: String(e) }); }
  await notifyBookingConfirmed({ ...a, meet_link: meetLink }, p, inv);
  await notifyClinic(`New booking ${a.ref}`, `<p><b>${p.full_name}</b> (${p.phone}) booked an online consultation for <b>${a.service}</b> on ${fmtDateLong(a.starts_at)}, ${fmtTime(a.starts_at)}.</p>`);
}

const load = async (id: string) => (await db().from("appointments").select("*, patients(*)").eq("id", id).maybeSingle()).data;

export async function rescheduleAppointment(id: string, date: string, time: string, actor: Actor) {
  if (!(await availableSlots(date)).includes(time)) return { ok: false, error: "That time is not available." };
  const start = slotStart(date, time), end = new Date(start.getTime() + SLOT_MS);
  const { data: a, error } = await db().from("appointments").update({ starts_at: start.toISOString(), ends_at: end.toISOString(), reminded_24h: false, reminded_1h: false })
    .eq("id", id).in("status", ["confirmed", "held"]).select("*, patients(*)").maybeSingle();
  if (error?.code === "23505") return { ok: false, error: "That time was just taken." };
  if (!a) return { ok: false, error: "This appointment can no longer be rescheduled." };
  if (a.google_event_id && googleConfigured()) await moveEvent(a.google_event_id, start, end).catch((e) => audit(actor, "calendar_move_failed", "appointment", id, { error: String(e) }));
  await notifyChange("rescheduled", a as A, a.patients);
  await audit(actor, "rescheduled_appointment", "appointment", id, { to: start.toISOString() });
  return { ok: true };
}

export async function cancelAppointment(id: string, actor: Actor) {
  const { data: a } = await db().from("appointments").update({ status: "cancelled" }).eq("id", id).in("status", ["confirmed", "held"]).select("*, patients(*)").maybeSingle();
  if (!a) return { ok: false, error: "This appointment cannot be cancelled." };
  if (a.google_event_id && googleConfigured()) await deleteEvent(a.google_event_id).catch((e) => audit(actor, "calendar_delete_failed", "appointment", id, { error: String(e) }));
  await notifyChange("cancelled", a as A, a.patients);
  await audit(actor, "cancelled_appointment", "appointment", id);
  return { ok: true };
}

export async function completeAppointment(id: string, actor: Actor) {
  const { data } = await db().from("appointments").update({ status: "completed" }).eq("id", id).eq("status", "confirmed").select("id").maybeSingle();
  if (data) await audit(actor, "completed_consultation", "appointment", id);
  return { ok: Boolean(data) };
}

// Run every ~15 minutes by a scheduler (see README): reminders 24h and 1h before, follow-up 2h after completion.
export async function runReminders() {
  const now = Date.now(), iso = (ms: number) => new Date(ms).toISOString(), done = { r24: 0, r1: 0, follow: 0 };
  const run = async (q: PromiseLike<{ data: any[] | null }>, kind: "reminder_24h" | "reminder_1h" | "followup", flag: string) => {
    for (const a of (await q).data ?? []) {
      const res = await notifyChange(kind, a as A, a.patients);
      if (res.some((r) => r.ok)) { await db().from("appointments").update({ [flag]: true }).eq("id", a.id); done[kind === "reminder_24h" ? "r24" : kind === "reminder_1h" ? "r1" : "follow"]++; }
    }
  };
  const base = () => db().from("appointments").select("*, patients(*)");
  await run(base().eq("status", "confirmed").eq("reminded_24h", false).gt("starts_at", iso(now + 2 * 3600e3)).lte("starts_at", iso(now + 24 * 3600e3)), "reminder_24h", "reminded_24h");
  await run(base().eq("status", "confirmed").eq("reminded_1h", false).gt("starts_at", iso(now)).lte("starts_at", iso(now + 3600e3)), "reminder_1h", "reminded_1h");
  await run(base().eq("status", "completed").eq("followup_sent", false).lt("ends_at", iso(now - 2 * 3600e3)).gt("ends_at", iso(now - 3 * 864e5)), "followup", "followup_sent");
  return done;
}
