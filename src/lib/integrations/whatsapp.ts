import { normalizePhone, waDigits } from "../phone";

export type Sent = {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
  via?: "template" | "text_fallback" | "text";
  templateUsed?: string;
  languageUsed?: string;
};

export type WaTemplateSlot = {
  key:
    | "booking_confirmation"
    | "payment_receipt"
    | "appointment_reminder"
    | "appointment_rescheduled"
    | "appointment_cancelled"
    | "prescription_ready"
    | "report_ready"
    | "followup_checkin";
  envVar: string;
  defaultName: string;
  trigger: string;
  paramLabels: string[];
  hasUrlButton?: boolean;
};

export const WHATSAPP_TEMPLATE_SLOTS: readonly WaTemplateSlot[] = [
  {
    key: "booking_confirmation",
    envVar: "WHATSAPP_TEMPLATE_BOOKING_CONFIRMATION",
    defaultName: "booking_confirmation",
    trigger: "Payment confirmed (with Meet link)",
    paramLabels: ["Patient name", "Service", "Date", "Time", "Meet link"],
  },
  {
    key: "payment_receipt",
    envVar: "WHATSAPP_TEMPLATE_PAYMENT_RECEIPT",
    defaultName: "payment_receipt",
    trigger: "Payment confirmed (receipt button)",
    paramLabels: ["Patient name", "Amount (INR)", "Receipt no."],
    hasUrlButton: true,
  },
  {
    key: "appointment_reminder",
    envVar: "WHATSAPP_TEMPLATE_REMINDER",
    defaultName: "appointment_reminder",
    trigger: "24 hours and 1 hour before consultation",
    paramLabels: ["Patient name", "Date", "Time", "Meet link"],
  },
  {
    key: "appointment_rescheduled",
    envVar: "WHATSAPP_TEMPLATE_RESCHEDULED",
    defaultName: "appointment_rescheduled",
    trigger: "Appointment rescheduled",
    paramLabels: ["Patient name", "New date", "New time", "Meet link"],
  },
  {
    key: "appointment_cancelled",
    envVar: "WHATSAPP_TEMPLATE_CANCELLED",
    defaultName: "appointment_cancelled",
    trigger: "Appointment cancelled",
    paramLabels: ["Patient name", "Original date"],
  },
  {
    key: "prescription_ready",
    envVar: "WHATSAPP_TEMPLATE_PRESCRIPTION_READY",
    defaultName: "prescription_ready",
    trigger: "Prescription sent by staff",
    paramLabels: ["Patient name"],
    hasUrlButton: true,
  },
  {
    key: "report_ready",
    envVar: "WHATSAPP_TEMPLATE_REPORT_READY",
    defaultName: "report_ready",
    trigger: "Report sent by staff",
    paramLabels: ["Patient name"],
    hasUrlButton: true,
  },
  {
    key: "followup_checkin",
    envVar: "WHATSAPP_TEMPLATE_FOLLOWUP",
    defaultName: "followup_checkin",
    trigger: "2 hours after consultation completed",
    paramLabels: ["Patient name"],
  },
] as const;

export const whatsappConfigured = () => Boolean(process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID);
const clean = (s: string) => s.replace(/\s+/g, " ").trim().slice(0, 900);

export function defaultWaLang(): string {
  return process.env.WHATSAPP_LANG?.trim() || "en";
}

/** Resolve logical clinic template slot to the Meta template name (supports Vercel env overrides). */
export function resolveTemplateName(keyOrCustomName: string): string {
  const slot = WHATSAPP_TEMPLATE_SLOTS.find((s) => s.key === keyOrCustomName);
  if (!slot) return keyOrCustomName.trim();
  const override = process.env[slot.envVar]?.trim();
  return override || slot.defaultName;
}

export const WA_TEMPLATES = {
  get bookingConfirmed() {
    return resolveTemplateName("booking_confirmation");
  },
  get reminder24h() {
    return resolveTemplateName("appointment_reminder");
  },
  get documentReady() {
    return resolveTemplateName("prescription_ready");
  },
  get postConsultFollowup() {
    return resolveTemplateName("followup_checkin");
  },
  get bookingCancelled() {
    return resolveTemplateName("appointment_cancelled");
  },
  get paymentConfirmed() {
    return resolveTemplateName("payment_receipt");
  },
};

type RawSendResult = Sent & { code?: number };

// ─── Low-level sender ────────────────────────────────────────────────────────
async function _send(to: string, payload: object): Promise<RawSendResult> {
  if (!whatsappConfigured()) return { ok: false, skipped: true, error: "WhatsApp is not configured" };
  const digits = waDigits(normalizePhone(to));
  if (!digits || digits.length < 10) return { ok: false, error: "Invalid phone number" };
  const r = await fetch(`https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ messaging_product: "whatsapp", ...payload, to: digits }),
  });
  const j = await r.json().catch(() => ({}));
  return r.ok
    ? { ok: true, id: j.messages?.[0]?.id }
    : { ok: false, code: j.error?.code, error: j.error?.message ?? `HTTP ${r.status}` };
}

function alternateEnglishCode(code: string): string | null {
  if (code === "en") return "en_US";
  if (code === "en_US") return "en";
  return null;
}

function isTranslationError(r: RawSendResult): boolean {
  return r.code === 132001 || /translation/i.test(r.error ?? "");
}

// ─── Template sender (transparent diagnostics + optional 24h window fallback) ─
export async function sendTemplate(o: {
  to: string;
  name: string;
  params: string[];
  /** Dynamic part of URL button (e.g. document token) */
  buttonToken?: string;
  /** Optional Meta language code override (defaults to WHATSAPP_LANG or "en") */
  language?: string;
  /** Set false for strict template testing so plain-text fallback does not mask Meta errors */
  allowFallback?: boolean;
}): Promise<Sent> {
  const templateUsed = resolveTemplateName(o.name);
  const components: object[] = [];
  if (o.params.length > 0) {
    components.push({
      type: "body",
      parameters: o.params.map((t) => ({ type: "text", text: clean(t) || "-" })),
    });
  }
  if (o.buttonToken) {
    components.push({
      type: "button",
      sub_type: "url",
      index: "0",
      parameters: [{ type: "text", text: o.buttonToken }],
    });
  }

  const sendAttempt = (lang: string) =>
    _send(o.to, {
      type: "template",
      template: {
        name: templateUsed,
        language: { code: lang },
        ...(components.length > 0 ? { components } : {}),
      },
    });

  let languageUsed = o.language?.trim() || defaultWaLang();
  let r = await sendAttempt(languageUsed);

  // Meta distinguishes "en" vs "en_US"; if translation lookup misses and caller did not lock language, try alternate once.
  if (!r.ok && !o.language?.trim() && isTranslationError(r)) {
    const alt = alternateEnglishCode(languageUsed);
    if (alt) {
      const retry = await sendAttempt(alt);
      if (retry.ok) {
        r = retry;
        languageUsed = alt;
      }
    }
  }

  if (r.ok) {
    return { ok: true, id: r.id, via: "template", templateUsed, languageUsed };
  }

  if (r.skipped) {
    return { ok: false, skipped: true, error: r.error, templateUsed, languageUsed };
  }

  const tplErr = `Template "${templateUsed}" (${languageUsed}) rejected: ${r.error ?? "Unknown Meta error"}`;
  const allowFallback = o.allowFallback !== false && process.env.WHATSAPP_ALLOW_TEXT_FALLBACK !== "false";

  if (!allowFallback) {
    return { ok: false, error: tplErr, templateUsed, languageUsed };
  }

  // Fallback: plain text works only inside an open 24h patient conversation window.
  const fallback = o.params.length
    ? `Dr. Sharmistha Bhattacharyya Clinic:\n${o.params.join(" · ")}${o.buttonToken ? `\nLink: https://drsharmisthabhattacharyya.com/d/${o.buttonToken}` : ""}`
    : "Update from Dr. Sharmistha Bhattacharyya's clinic.";
  const fb = await sendTextMessage(o.to, fallback);

  if (fb.ok) {
    return {
      ok: true,
      id: fb.id,
      via: "text_fallback",
      templateUsed,
      languageUsed,
      error: `${tplErr}. Used 24h text fallback (only delivers if patient messaged in last 24h).`,
    };
  }

  return {
    ok: false,
    error: `${tplErr}; fallback also failed: ${fb.error}`,
    templateUsed,
    languageUsed,
  };
}

// ─── Typed helpers ────────────────────────────────────────────────────────────
export function sendBookingConfirmed(
  to: string,
  o: { name: string; date: string; time: string; service: string; meetLink: string },
) {
  return sendTemplate({
    to,
    name: "booking_confirmation",
    params: [o.name, o.service, o.date, o.time, o.meetLink],
  });
}

export function sendReminder24h(
  to: string,
  o: { name: string; date: string; time: string; meetLink: string },
) {
  return sendTemplate({
    to,
    name: "appointment_reminder",
    params: [o.name, o.date, o.time, o.meetLink],
  });
}

export function sendDocumentReady(
  to: string,
  o: { name: string; token: string; kind?: "prescription" | "report" },
) {
  return sendTemplate({
    to,
    name: o.kind === "report" ? "report_ready" : "prescription_ready",
    params: [o.name],
    buttonToken: o.token,
  });
}

export function sendPostConsultFollowup(to: string, o: { name: string }) {
  return sendTemplate({
    to,
    name: "followup_checkin",
    params: [o.name],
  });
}

export function sendBookingCancelled(to: string, o: { name: string; date: string }) {
  return sendTemplate({
    to,
    name: "appointment_cancelled",
    params: [o.name, o.date],
  });
}

export function sendPaymentConfirmed(
  to: string,
  o: { name: string; amount: string; invoiceNo: string; token: string },
) {
  return sendTemplate({
    to,
    name: "payment_receipt",
    params: [o.name, o.amount, o.invoiceNo],
    buttonToken: o.token,
  });
}

// ─── Plain text (works only within 24h customer-initiated window) ─────────────
export async function sendTextMessage(to: string, text: string): Promise<Sent> {
  const r = await _send(to, {
    recipient_type: "individual",
    type: "text",
    text: { body: text },
  });
  return { ...r, via: "text" };
}

// ─── Live Meta WABA template listing (optional WHATSAPP_WABA_ID) ────────────
export type MetaTemplateItem = {
  name: string;
  status: string;
  language: string;
  category: string;
};

export async function listMetaTemplates(): Promise<{
  wabaConfigured: boolean;
  templates: MetaTemplateItem[];
  error?: string;
}> {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const wabaId = process.env.WHATSAPP_WABA_ID?.trim();
  if (!token || !wabaId) {
    return { wabaConfigured: false, templates: [] };
  }
  try {
    const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(wabaId)}/message_templates?fields=name,status,language,category&limit=100`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      return {
        wabaConfigured: true,
        templates: [],
        error: j.error?.message ?? `HTTP ${r.status}`,
      };
    }
    const items: MetaTemplateItem[] = Array.isArray(j.data)
      ? j.data.map((x: any) => ({
          name: String(x.name ?? ""),
          status: String(x.status ?? "UNKNOWN"),
          language: String(x.language ?? ""),
          category: String(x.category ?? ""),
        }))
      : [];
    return { wabaConfigured: true, templates: items };
  } catch (e) {
    return { wabaConfigured: true, templates: [], error: String(e) };
  }
}

export function whatsappConfigSummary() {
  return {
    configured: whatsappConfigured(),
    lang: defaultWaLang(),
    fallbackEnabled: process.env.WHATSAPP_ALLOW_TEXT_FALLBACK !== "false",
    wabaConfigured: Boolean(process.env.WHATSAPP_WABA_ID?.trim()),
    cronConfigured: Boolean(process.env.CRON_SECRET?.trim()),
    slots: WHATSAPP_TEMPLATE_SLOTS.map((slot) => ({
      ...slot,
      activeName: resolveTemplateName(slot.key),
      overridden: Boolean(process.env[slot.envVar]?.trim()),
    })),
  };
}
