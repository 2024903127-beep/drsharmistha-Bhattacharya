import { waDigits } from "../phone";

export type Sent = { ok: boolean; skipped?: boolean; id?: string; error?: string };
export const whatsappConfigured = () => Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
const clean = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 900);

// ─── Template names (approved in Meta WhatsApp Manager) ─────────────────────
export const WA_TEMPLATES = {
  bookingConfirmed:    "booking_confirmed_v3",
  reminder24h:         "appt_reminder_24h_v2",
  documentReady:       "document_ready_v3",
  postConsultFollowup: "post_consult_followup_v2",
  bookingCancelled:    "booking_cancelled_v3",
  paymentConfirmed:    "payment_confirmed_v3",
} as const;

// ─── Low-level sender ────────────────────────────────────────────────────────
async function _send(to: string, payload: object): Promise<Sent> {
  if (!whatsappConfigured()) return { ok: false, skipped: true, error: "WhatsApp is not configured" };
  const r = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
  });
  const j = await r.json().catch(() => ({}));
  return r.ok ? { ok: true, id: j.messages?.[0]?.id } : { ok: false, error: j.error?.message ?? `HTTP ${r.status}` };
}

// ─── Generic template sender (fallback to text if not yet approved) ──────────
export async function sendTemplate(o: {
  to: string;
  name: string;
  params: string[];
  /** Dynamic part of URL button (e.g. document token) */
  buttonToken?: string;
}): Promise<Sent> {
  const components: object[] = [
    { type: "body", parameters: o.params.map((t) => ({ type: "text", text: clean(t) })) },
  ];
  if (o.buttonToken)
    components.push({ type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: o.buttonToken }] });

  const r = await _send(o.to, {
    to: waDigits(o.to),
    type: "template",
    template: { name: o.name, language: { code: process.env.WHATSAPP_LANG ?? "en_US" }, components },
  });
  if (r.ok) return r;

  // Fallback: plain text (works inside 24h conversation window)
  const fallback = o.params.length
    ? `Dr. Sharmistha Bhattacharyya Clinic:\n${o.params.join(" · ")}${o.buttonToken ? `\nLink: https://drsharmisthabhattacharyya.com/d/${o.buttonToken}` : ""}`
    : "Update from Dr. Sharmistha Bhattacharyya's clinic.";
  return sendTextMessage(o.to, fallback);
}

// ─── Typed helpers for each approved template ────────────────────────────────

/** Sent immediately after booking is created */
export function sendBookingConfirmed(to: string, o: {
  name: string; date: string; time: string; service: string; ref: string; meetLink: string;
}) {
  return sendTemplate({
    to, name: WA_TEMPLATES.bookingConfirmed,
    params: [o.name, o.date, o.time, o.service, o.ref, o.meetLink],
  });
}

/** Sent 24 hours before the consultation */
export function sendReminder24h(to: string, o: {
  name: string; date: string; time: string; procedure: string; ref: string;
}) {
  return sendTemplate({
    to, name: WA_TEMPLATES.reminder24h,
    params: [o.name, o.date, o.time, o.procedure, o.ref],
  });
}

/** Sent when a prescription / report is ready to download */
export function sendDocumentReady(to: string, o: {
  name: string; docType: string; issuedOn: string; ref: string; token: string;
}) {
  return sendTemplate({
    to, name: WA_TEMPLATES.documentReady,
    params: [o.name, o.docType, o.issuedOn, o.ref],
    buttonToken: o.token,
  });
}

/** Sent as a follow-up 1–2 days after consultation */
export function sendPostConsultFollowup(to: string, o: {
  name: string; date: string; procedure: string; ref: string;
}) {
  return sendTemplate({
    to, name: WA_TEMPLATES.postConsultFollowup,
    params: [o.name, o.date, o.procedure, o.ref],
  });
}

/** Sent when patient cancels a booking */
export function sendBookingCancelled(to: string, o: {
  name: string; date: string; time: string; service: string; ref: string; refundStatus: string;
}) {
  return sendTemplate({
    to, name: WA_TEMPLATES.bookingCancelled,
    params: [o.name, o.date, o.time, o.service, o.ref, o.refundStatus],
  });
}

/** Sent after successful Razorpay payment */
export function sendPaymentConfirmed(to: string, o: {
  name: string; amount: string; txnId: string; date: string; ref: string;
}) {
  return sendTemplate({
    to, name: WA_TEMPLATES.paymentConfirmed,
    params: [o.name, o.amount, o.txnId, o.date, o.ref],
    buttonToken: o.ref,
  });
}

// ─── Plain text (always works within 24h window) ─────────────────────────────
export async function sendTextMessage(to: string, text: string): Promise<Sent> {
  return _send(to, {
    recipient_type: "individual",
    to: waDigits(to),
    type: "text",
    text: { body: text },
  });
}
