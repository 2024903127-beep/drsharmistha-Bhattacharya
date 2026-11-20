import "server-only";
import { db, dbConfigured } from "./db";
import { sendTemplate, type Sent } from "./integrations/whatsapp";
import { EmailService } from "./integrations/brevo";
import { docToken } from "./documents";
import { fmtDateLong, fmtTime } from "./fmt";
import { site } from "./site";

export type P = { id: string; full_name: string; phone: string; email?: string | null };
export type A = { id: string; ref: string; service: string; starts_at: string; meet_link?: string | null };
type Ctx = { a?: string; p?: string };

// ── Logging helper ───────────────────────────────────────────────────────────
async function record(c: Ctx, channel: "whatsapp" | "email", template: string, to: string, r: Sent) {
  if (!dbConfigured()) return;
  try {
    await db().from("message_log").insert({
      appointment_id: c.a ?? null,
      patient_id: c.p ?? null,
      channel, template, recipient: to,
      status: r.ok ? "sent" : r.skipped ? "skipped" : "failed",
      provider_id: r.id ?? null,
      error: r.error ?? null,
    });
  } catch { /* logging must never break sending */ }
}

async function wa(c: Ctx, to: string, template: string, params: string[], buttonToken?: string) {
  const r = await sendTemplate({ to, name: template, params, buttonToken })
    .catch((e): Sent => ({ ok: false, error: String(e) }));
  await record(c, "whatsapp", template, to, r);
  return r;
}

async function logEmail(c: Ctx, to: string | null | undefined, template: string, r: Sent) {
  if (!to) return;
  await record(c, "email", template, to, r);
}

const slot = (a: A) => [fmtDateLong(a.starts_at), fmtTime(a.starts_at)] as const;
const meet = (a: A) => a.meet_link || "shared before your consultation";

// ── Booking confirmed ────────────────────────────────────────────────────────
export async function notifyBookingConfirmed(
  a: A,
  p: P,
  inv: { docId: string; invoiceNo: string; amountInr: number } | null,
) {
  const c = { a: a.id, p: p.id };
  const [d, t] = slot(a);
  const out: Sent[] = [];

  // WhatsApp — booking confirmation
  out.push(await wa(c, p.phone, "booking_confirmation", [p.full_name, a.service, d, t, meet(a)]));

  // WhatsApp — payment receipt (if paid)
  if (inv) {
    out.push(await wa(c, p.phone, "payment_receipt",
      [p.full_name, String(inv.amountInr), inv.invoiceNo],
      await docToken(inv.docId),
    ));
  }

  // Email — booking confirmation
  if (p.email) {
    const receiptUrl = inv ? `${site.url}/d/${await docToken(inv.docId)}` : undefined;
    const r = await EmailService.sendBookingConfirmation({
      to: p.email,
      patientName: p.full_name,
      service: a.service,
      dateLabel: d,
      timeLabel: t,
      ref: a.ref,
      meetLink: a.meet_link,
      receiptUrl: receiptUrl ?? null,
      receiptNo: inv?.invoiceNo ?? null,
      amountInr: inv?.amountInr ?? null,
    }).catch((e): Sent => ({ ok: false, error: String(e) }));
    await logEmail(c, p.email, "booking_confirmation", r);
    out.push(r);
  }

  return out;
}

// ── Document ready (prescription / report) ───────────────────────────────────
export async function notifyDocument(
  doc: { id: string; kind: string },
  p: P,
  appointmentId?: string | null,
) {
  const c = { a: appointmentId ?? undefined, p: p.id };
  const isReport = doc.kind === "report";
  const template = isReport ? "report_ready" : "prescription_ready";
  const token = await docToken(doc.id);
  const url = `${site.url}/d/${token}`;

  const results: Sent[] = [
    await wa(c, p.phone, template, [p.full_name], token),
  ];

  if (p.email) {
    const r = await EmailService.sendDocumentReady({
      to: p.email,
      patientName: p.full_name,
      kind: isReport ? "report" : "prescription",
      docUrl: url,
    }).catch((e): Sent => ({ ok: false, error: String(e) }));
    await logEmail(c, p.email, template, r);
    results.push(r);
  }

  return results;
}

// ── Change notifications ──────────────────────────────────────────────────────
type Change = "rescheduled" | "cancelled" | "reminder_24h" | "reminder_1h" | "followup";

export async function notifyChange(kind: Change, a: A, p: P) {
  const c = { a: a.id, p: p.id };
  const [d, t] = slot(a);
  const results: Sent[] = [];

  if (kind === "rescheduled") {
    results.push(await wa(c, p.phone, "appointment_rescheduled", [p.full_name, d, t, meet(a)]));
    if (p.email) {
      const r = await EmailService.sendRescheduled({ to: p.email, patientName: p.full_name, dateLabel: d, timeLabel: t, meetLink: a.meet_link })
        .catch((e): Sent => ({ ok: false, error: String(e) }));
      await logEmail(c, p.email, "appointment_rescheduled", r);
      results.push(r);
    }
  } else if (kind === "cancelled") {
    results.push(await wa(c, p.phone, "appointment_cancelled", [p.full_name, d]));
    if (p.email) {
      const r = await EmailService.sendCancelled({ to: p.email, patientName: p.full_name, dateLabel: d })
        .catch((e): Sent => ({ ok: false, error: String(e) }));
      await logEmail(c, p.email, "appointment_cancelled", r);
      results.push(r);
    }
  } else if (kind === "reminder_24h" || kind === "reminder_1h") {
    results.push(await wa(c, p.phone, "appointment_reminder", [p.full_name, d, t, meet(a)]));
    if (p.email) {
      const r = await EmailService.sendReminder({
        to: p.email, patientName: p.full_name, service: a.service,
        dateLabel: d, timeLabel: t, meetLink: a.meet_link,
        hoursAhead: kind === "reminder_1h" ? 1 : 24,
      }).catch((e): Sent => ({ ok: false, error: String(e) }));
      await logEmail(c, p.email, "appointment_reminder", r);
      results.push(r);
    }
  } else if (kind === "followup") {
    results.push(await wa(c, p.phone, "followup_checkin", [p.full_name]));
    if (p.email) {
      const r = await EmailService.sendFollowUp({ to: p.email, patientName: p.full_name })
        .catch((e): Sent => ({ ok: false, error: String(e) }));
      await logEmail(c, p.email, "followup_checkin", r);
      results.push(r);
    }
  }

  return results;
}

// ── Clinic-side alert ─────────────────────────────────────────────────────────
export async function notifyClinic(subject: string, html: string) {
  const to = process.env.CLINIC_NOTIFY_EMAIL;
  if (!to) return;
  const { sendEmail, emailLayout } = await import("./integrations/brevo");
  await sendEmail({ to, subject, html: emailLayout(subject, html) });
}
