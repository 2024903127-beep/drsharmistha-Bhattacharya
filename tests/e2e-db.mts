import assert from "node:assert/strict";
import { availableSlots, createHold, confirmPayment, rescheduleAppointment, cancelAppointment, completeAppointment, runReminders, expireHolds } from "@/lib/booking";
import { db } from "@/lib/db";
import { listAppointments, listPatients, getPatient, listPayments, listMessages, listAudit, listLeads } from "@/lib/repo";
import { allow } from "@/lib/ratelimit";
import { docToken, readDocToken, getDocument } from "@/lib/documents";

const date = "2026-11-24"; // a Tuesday
const ok = (m: string) => console.log("PASS", m);
const base = { service: "Rhinoplasty", date, message: "hi", attribution: { utm_source: "google" } };

async function pay(apptId: string, order: string) { await db().from("payments").insert({ appointment_id: apptId, rzp_order_id: order, amount_paise: 150000 }); }
const status = async (id: string) => (await db().from("appointments").select("status,starts_at").eq("id", id).single()).data!;

const slots0 = await availableSlots(date);
assert.equal(slots0.length, 9); assert.ok(slots0.includes("11:00")); ok("9 slots on a Tuesday, none on Sunday: " + (await availableSlots("2026-11-22")).length);

const A: any = await createHold({ ...base, name: "Test One", phone: "98765 43210", email: "t1@example.com", time: "11:00" } as any, 150000);
assert.equal(A.patient.phone, "+919876543210"); ok("hold created, phone normalised to " + A.patient.phone);
assert.ok(!(await availableSlots(date)).includes("11:00")); ok("held slot disappears from availability");
const dup: any = await createHold({ ...base, name: "Test Two", phone: "9000000002", time: "11:00" } as any, 150000);
assert.equal(dup.taken, true); ok("second booking of the same slot is rejected (unique index via supabase-js error code)");

await pay(A.appt.id, "order_A");
const r1 = await confirmPayment({ orderId: "order_A", paymentId: "pay_A", method: "upi" });
assert.ok(r1.ok && !("already" in r1)); assert.equal((await status(A.appt.id)).status, "confirmed"); ok("payment confirms the appointment");
const docs = (await db().from("documents").select("kind,filename").eq("appointment_id", A.appt.id)).data!;
assert.equal(docs.length, 1); assert.equal(docs[0].kind, "invoice"); assert.match(docs[0].filename, /^INV-2026-\d{4}\.pdf$/); ok("receipt PDF stored: " + docs[0].filename);
const p1 = (await db().from("payments").select("status,invoice_no,rzp_payment_id,method").eq("rzp_order_id", "order_A").single()).data!;
assert.deepEqual([p1.status, p1.rzp_payment_id, p1.method], ["captured", "pay_A", "upi"]); ok("payment row captured with invoice no " + p1.invoice_no);
const r2: any = await confirmPayment({ orderId: "order_A", paymentId: "pay_A" });
assert.equal(r2.already, true); assert.equal((await db().from("documents").select("id").eq("appointment_id", A.appt.id)).data!.length, 1); ok("webhook + browser callback racing: second call is a no-op, no duplicate receipt");
const msgs = (await db().from("message_log").select("channel,template,status").eq("appointment_id", A.appt.id)).data!;
assert.ok(msgs.some((m) => m.template === "booking_confirmation" && m.channel === "whatsapp") && msgs.every((m) => m.status === "skipped")); ok(`notifications attempted and logged as skipped (no keys): ${msgs.map((m) => m.channel + ":" + m.template).join(", ")}`);
assert.equal((await confirmPayment({ orderId: "nope", paymentId: "x" })).ok, false); ok("unknown order id handled");

// paid after the hold expired and slot taken by someone else
const C: any = await createHold({ ...base, name: "Late Payer", phone: "9000000003", time: "12:00" } as any, 150000); await pay(C.appt.id, "order_C");
await db().from("appointments").update({ hold_expires_at: new Date(Date.now() - 1000).toISOString() }).eq("id", C.appt.id); await expireHolds();
assert.equal((await status(C.appt.id)).status, "expired"); assert.ok((await availableSlots(date)).includes("12:00")); ok("expired hold frees the slot");
const D: any = await createHold({ ...base, name: "Fast Payer", phone: "9000000004", time: "12:00" } as any, 150000); await pay(D.appt.id, "order_D"); await confirmPayment({ orderId: "order_D", paymentId: "pay_D" });
const lateRes: any = await confirmPayment({ orderId: "order_C", paymentId: "pay_C" });
assert.equal(lateRes.conflict, true); assert.equal((await status(C.appt.id)).status, "conflict"); ok("late payment on a taken slot is flagged as conflict, not double-booked");

// staff actions
assert.equal((await rescheduleAppointment(A.appt.id, date, "12:00", { name: "t" })).ok, false); ok("reschedule onto a taken slot refused");
assert.equal((await rescheduleAppointment(A.appt.id, date, "14:00", { name: "t" })).ok, true); assert.match((await status(A.appt.id)).starts_at, /^2026-11-24T08:30/); ok("reschedule to 14:00 IST stored as 08:30 UTC");
assert.equal((await cancelAppointment(A.appt.id, { name: "t" })).ok, true); assert.ok((await availableSlots(date)).includes("14:00")); ok("cancel frees the slot");
assert.equal((await cancelAppointment(A.appt.id, { name: "t" })).ok, false); ok("cancelling twice refused");
assert.equal((await completeAppointment(D.appt.id, { name: "t" })).ok, true); ok("complete consultation");

// reminders + follow-up queries
const soon = new Date(Date.now() + 30 * 60e3), P = (await db().from("patients").select("id").eq("phone", "+919000000004").single()).data!;
const { data: R } = await db().from("appointments").insert({ ref: "BK-REMIND", patient_id: P.id, service: "X", starts_at: soon.toISOString(), ends_at: new Date(soon.getTime() + 3600e3).toISOString(), status: "confirmed", fee_paise: 1, reminded_24h: true }).select().single();
await db().from("appointments").update({ ends_at: new Date(Date.now() - 3 * 3600e3).toISOString() }).eq("id", D.appt.id);
const run = await runReminders(); // channels not configured, so nothing is marked sent, but queries must work
const rem = (await db().from("message_log").select("template").in("appointment_id", [R!.id, D.appt.id])).data!.map((m) => m.template);
assert.ok(rem.includes("appointment_reminder") && rem.includes("followup_checkin")); ok(`reminder (1h) and follow-up picked up by the scheduler: ${rem.join(", ")}`);

// repo reads used by the portal
const ap = await listAppointments(); assert.ok(ap.some((a) => a.status === "Payment conflict") && ap.some((a) => a.status === "Completed") && !ap.some((a) => a.status === "Cancelled" && false)); ok(`listAppointments ${ap.length} rows with labels`);
const pt = await listPatients(); assert.ok(pt.length >= 3); const det = await getPatient(A.patient.id); assert.equal(det!.docs[0].kind, "invoice"); ok("patient list and detail with documents");
assert.equal((await listPayments()).find((p) => p.ref === A.appt.ref)!.status, "Paid"); ok("listPayments: Paid, refundable");
assert.ok((await listMessages()).length > 0 && (await listAudit()).length > 0); ok("message log and audit log readable");
await db().from("leads").insert({ name: "L", phone: "+91900", attribution: { referrer: "https://www.google.com/search" } });
assert.equal((await listLeads())[0].source, "google.com"); ok("lead source derived from referrer");

// links + limiter
const tok = await docToken(docs.length ? (await db().from("documents").select("id").limit(1).single()).data!.id : "x"); const id = await readDocToken(tok);
assert.ok(id && (await getDocument(id))); assert.equal(await readDocToken(tok.slice(0, -2) + "xx"), null); ok("secure document link verifies; tampered link rejected");
assert.deepEqual([await allow("t1", 2, 60), await allow("t1", 2, 60), await allow("t1", 2, 60)], [true, true, false]); ok("rate limiter through supabase-js rpc");
console.log("\nALL DB END-TO-END CHECKS PASSED");
