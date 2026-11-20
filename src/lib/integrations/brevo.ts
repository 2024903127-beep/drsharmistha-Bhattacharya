import "server-only";
import type { Sent } from "./whatsapp";

export const brevoConfigured = () =>
  Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// ── Premium HTML Email Layout ────────────────────────────────────────────────
export function emailLayout(
  heading: string,
  body: string,
  cta?: { label: string; url: string }
) {
  const phone = "+91 96672 07009";
  const email = "consultations@drsharmisthabhattacharyya.com";
  const address = "Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana – 121002";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(heading)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c2526;-webkit-font-smoothing:antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);border:1px solid #e8e0d0;">

        <!-- Gold accent bar -->
        <tr><td style="height:5px;background:linear-gradient(90deg,#b99a65 0%,#173d32 100%);"></td></tr>

        <!-- Header -->
        <tr><td style="padding:28px 36px 20px;border-bottom:1px solid #f0ece3;">
          <div style="font-size:19px;font-weight:700;color:#173d32;letter-spacing:-0.3px;">Dr. Sharmistha Bhattacharyya</div>
          <div style="font-size:11px;color:#b99a65;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;margin-top:3px;">Plastic &amp; Aesthetic Surgery · Faridabad</div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 36px;">
          <h1 style="margin:0 0 8px;font-size:21px;font-weight:700;color:#111827;line-height:1.3;">${esc(heading)}</h1>
          <div style="font-size:15px;line-height:1.65;color:#374151;">${body}</div>
          ${cta ? `
          <div style="margin-top:28px;text-align:center;">
            <a href="${cta.url}" style="display:inline-block;padding:14px 32px;background:#173d32;color:#f7f4ed;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;box-shadow:0 4px 12px rgba(23,61,50,0.25);">${esc(cta.label)}</a>
          </div>` : ""}
        </td></tr>

        <!-- Support box -->
        <tr><td style="padding:0 36px 24px;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#faf8f4;border:1px solid #e8e0d0;border-radius:10px;padding:14px;">
            <tr><td>
              <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:4px;">Questions or concerns?</div>
              <div style="font-size:12px;color:#6b7280;line-height:1.5;">
                Call / WhatsApp: <a href="tel:${phone.replace(/\s+/g, "")}" style="color:#173d32;text-decoration:none;font-weight:600;">${phone}</a> &nbsp;•&nbsp;
                Email: <a href="mailto:${email}" style="color:#173d32;text-decoration:none;font-weight:600;">${email}</a>
              </div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 36px;background-color:#faf8f4;border-top:1px solid #ede8de;text-align:center;">
          <div style="font-size:12px;font-weight:600;color:#4b5563;margin-bottom:3px;">Dr. Sharmistha Bhattacharyya</div>
          <div style="font-size:11px;color:#9ca3af;line-height:1.5;margin-bottom:10px;">${address}</div>
          <div style="font-size:11px;color:#9ca3af;border-top:1px solid #e5e7eb;padding-top:10px;">
            This email contains confidential patient health information. If received in error, please notify us and delete it immediately.
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Core send function ───────────────────────────────────────────────────────
export async function sendEmail(o: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  attachments?: Array<{ name: string; content: string; type: string }>;
}): Promise<Sent> {
  if (!brevoConfigured())
    return { ok: false, skipped: true, error: "Brevo not configured" };

  const body: Record<string, unknown> = {
    sender: { name: "Dr. Sharmistha Bhattacharyya", email: process.env.BREVO_SENDER_EMAIL },
    to: [{ email: o.to, name: o.toName ?? o.to }],
    subject: o.subject,
    htmlContent: o.html,
  };
  if (o.attachments?.length) body.attachment = o.attachments;

  const r = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY!,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  return r.ok
    ? { ok: true, id: j.messageId }
    : { ok: false, error: j.message ?? `HTTP ${r.status}` };
}

// ── High-level EmailService (matches speech-therapy pattern) ─────────────────
export const EmailService = {

  /** Booking confirmed: sent right after payment succeeds. */
  async sendBookingConfirmation(params: {
    to: string;
    patientName: string;
    service: string;
    dateLabel: string;   // e.g. "Wednesday, 25 December 2026"
    timeLabel: string;   // e.g. "11:00 AM"
    ref: string;
    meetLink?: string | null;
    receiptUrl?: string | null;
    receiptNo?: string | null;
    amountInr?: number | null;
  }) {
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>Your online consultation has been confirmed. Here are your details:</p>

      <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#f0f9f4;border:1px solid #a7f3d0;border-radius:10px;margin:20px 0;padding:16px;">
        <tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Service:</strong> ${esc(params.service)}</td></tr>
        <tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Date:</strong> ${esc(params.dateLabel)}</td></tr>
        <tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Time:</strong> ${esc(params.timeLabel)} IST</td></tr>
        <tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Reference:</strong> ${esc(params.ref)}</td></tr>
        ${params.meetLink ? `<tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Google Meet:</strong> <a href="${params.meetLink}" style="color:#173d32;">${params.meetLink}</a></td></tr>` : ""}
        ${params.receiptNo ? `<tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Receipt no.:</strong> ${esc(params.receiptNo)} &nbsp;·&nbsp; ₹${params.amountInr?.toLocaleString("en-IN")}.00</td></tr>` : ""}
      </table>

      ${!params.meetLink ? `<p style="font-size:14px;color:#4b5563;"><em>Your Google Meet link will be shared before the consultation.</em></p>` : ""}
      <p style="font-size:14px;color:#4b5563;">Please join 2–3 minutes early so we can start on time.</p>
      ${params.receiptUrl ? `<p style="font-size:14px;color:#4b5563;">Your receipt: <a href="${params.receiptUrl}" style="color:#173d32;font-weight:600;">view / download (link valid 30 days)</a></p>` : ""}
    `;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: `Consultation confirmed — ${params.ref}`,
      html: emailLayout("Your consultation is confirmed", content,
        params.meetLink ? { label: "Join Google Meet", url: params.meetLink } : undefined),
    });
  },

  /** Payment receipt with optional PDF attachment. */
  async sendReceipt(params: {
    to: string;
    patientName: string;
    invoiceNo: string;
    amountInr: number;
    receiptUrl: string;
    pdfBase64?: string;
  }) {
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>We have received your payment. Thank you!</p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;margin:20px 0;padding:16px;">
        <tr><td style="font-size:13px;color:#374151;padding:5px 0;"><strong>Receipt no.:</strong> ${esc(params.invoiceNo)}</td></tr>
        <tr><td style="font-size:15px;color:#111827;padding:8px 0 4px;font-weight:700;"><strong>Amount paid:</strong> ₹${params.amountInr.toLocaleString("en-IN")}.00</td></tr>
      </table>
      <p style="font-size:14px;color:#4b5563;">Your receipt is attached as a PDF and also available via the button below (link valid 30 days).</p>
    `;
    const attachments = params.pdfBase64
      ? [{ name: `Receipt-${params.invoiceNo}.pdf`, content: params.pdfBase64, type: "application/pdf" }]
      : undefined;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: `Payment receipt ${params.invoiceNo} — Dr. Sharmistha Bhattacharyya`,
      html: emailLayout("Payment received", content, { label: "View receipt (PDF)", url: params.receiptUrl }),
      attachments,
    });
  },

  /** Document ready (prescription or report). */
  async sendDocumentReady(params: {
    to: string;
    patientName: string;
    kind: "prescription" | "report";
    docUrl: string;
  }) {
    const isReport = params.kind === "report";
    const title = isReport ? "A new report is ready" : "Your prescription is ready";
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>${isReport
        ? "A new clinical report from Dr. Sharmistha Bhattacharyya's clinic has been added to your file."
        : "Your prescription from Dr. Sharmistha Bhattacharyya is ready."
      } The secure link below is valid for <strong>30 days</strong>.</p>
    `;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: `${title} — Dr. Sharmistha Bhattacharyya`,
      html: emailLayout(title, content, { label: `View ${isReport ? "report" : "prescription"} securely`, url: params.docUrl }),
    });
  },

  /** Appointment reminder (24h or 1h). */
  async sendReminder(params: {
    to: string;
    patientName: string;
    service: string;
    dateLabel: string;
    timeLabel: string;
    meetLink?: string | null;
    hoursAhead: number;
  }) {
    const timeHint = params.hoursAhead <= 2 ? "in about 1 hour" : params.hoursAhead <= 6 ? "today" : "tomorrow";
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>This is a reminder that you have an online consultation <strong>${timeHint}</strong>.</p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#fef9ec;border:1px solid #fde68a;border-radius:10px;margin:20px 0;padding:16px;">
        <tr><td style="font-size:13px;color:#92400e;padding:4px 0;"><strong>Service:</strong> ${esc(params.service)}</td></tr>
        <tr><td style="font-size:13px;color:#92400e;padding:4px 0;"><strong>Date:</strong> ${esc(params.dateLabel)}</td></tr>
        <tr><td style="font-size:13px;color:#92400e;padding:4px 0;"><strong>Time:</strong> ${esc(params.timeLabel)} IST</td></tr>
        ${params.meetLink ? `<tr><td style="font-size:13px;color:#92400e;padding:4px 0;"><strong>Google Meet:</strong> <a href="${params.meetLink}" style="color:#173d32;">${params.meetLink}</a></td></tr>` : ""}
      </table>
    `;
    const subject = params.hoursAhead <= 2
      ? `Reminder: your consultation starts in ~1 hour`
      : params.hoursAhead <= 6
      ? `Reminder: your consultation is today at ${params.timeLabel}`
      : `Reminder: your consultation is tomorrow at ${params.timeLabel}`;
    return sendEmail({
      to: params.to, toName: params.patientName, subject,
      html: emailLayout("Upcoming consultation reminder", content,
        params.meetLink ? { label: "Join Google Meet", url: params.meetLink } : undefined),
    });
  },

  /** Rescheduled appointment. */
  async sendRescheduled(params: {
    to: string;
    patientName: string;
    dateLabel: string;
    timeLabel: string;
    meetLink?: string | null;
  }) {
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>Your consultation has been rescheduled to a new time:</p>
      <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#f0f9f4;border:1px solid #a7f3d0;border-radius:10px;margin:20px 0;padding:16px;">
        <tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>New date:</strong> ${esc(params.dateLabel)}</td></tr>
        <tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>New time:</strong> ${esc(params.timeLabel)} IST</td></tr>
        ${params.meetLink ? `<tr><td style="font-size:13px;color:#065f46;padding:5px 0;"><strong>Google Meet:</strong> <a href="${params.meetLink}" style="color:#173d32;">${params.meetLink}</a></td></tr>` : ""}
      </table>
    `;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: "Your consultation has been rescheduled",
      html: emailLayout("Consultation rescheduled", content,
        params.meetLink ? { label: "Join Google Meet", url: params.meetLink } : undefined),
    });
  },

  /** Cancelled appointment. */
  async sendCancelled(params: {
    to: string;
    patientName: string;
    dateLabel: string;
  }) {
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>Your consultation on <strong>${esc(params.dateLabel)}</strong> has been cancelled.</p>
      <p style="font-size:14px;color:#4b5563;">If you would like to book a new time, please contact us on WhatsApp or call us directly.</p>
    `;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: "Your consultation was cancelled",
      html: emailLayout("Consultation cancelled", content),
    });
  },

  /** Post-consultation follow-up. */
  async sendFollowUp(params: {
    to: string;
    patientName: string;
  }) {
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>Thank you for consulting with Dr. Sharmistha Bhattacharyya.</p>
      <p style="font-size:14px;color:#4b5563;">If you have any questions about your plan or care, please reply to this email, send a WhatsApp message, or call us directly. We are here to help.</p>
    `;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: "Thank you for consulting with Dr. Sharmistha",
      html: emailLayout("Thank you for your consultation", content),
    });
  },

  /** Staff invite — new team member receives login details. */
  async sendStaffInvite(params: {
    to: string;
    name: string;
    role: string;
    loginUrl: string;
    tempPassword: string;
  }) {
    const roleLabel = params.role.charAt(0).toUpperCase() + params.role.slice(1);
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.name)}</strong>,</p>
      <p>An official staff account has been created for you on the <strong>Dr. Sharmistha Bhattacharyya Clinic Management Portal</strong>.</p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;margin:20px 0;padding:18px;">
        <tr><td style="font-size:13px;color:#166534;padding:5px 0;"><strong>Role:</strong> ${esc(roleLabel)}</td></tr>
        <tr><td style="font-size:13px;color:#166534;padding:5px 0;"><strong>Portal URL:</strong> <a href="${params.loginUrl}" style="color:#173d32;font-weight:600;">${esc(params.loginUrl)}</a></td></tr>
        <tr><td style="font-size:13px;color:#166534;padding:5px 0;"><strong>Login email (ID):</strong> <span style="font-family:monospace;font-weight:600;">${esc(params.to)}</span></td></tr>
        <tr><td style="font-size:13px;color:#166534;padding:6px 0;"><strong>Password:</strong>
          <code style="background:#ffffff;padding:4px 10px;border-radius:6px;font-size:14px;font-weight:700;color:#14532d;border:1px solid #86efac;letter-spacing:0.5px;">${esc(params.tempPassword)}</code>
        </td></tr>
      </table>

      <p style="font-size:14px;color:#374151;line-height:1.6;">
        Please sign in using the button below. Please keep your login credentials secure and do not share them.
      </p>
      <p style="font-size:13px;color:#6b7280;line-height:1.5;">
        <em>Note: Staff self-service password reset is disabled for security. If you ever need your password reset, please contact Dr. Sharmistha or the clinic administrator directly.</em>
      </p>
    `;
    return sendEmail({
      to: params.to, toName: params.name,
      subject: "Welcome to the Clinic Portal — Your login credentials",
      html: emailLayout("Welcome to the Clinic Team", content, { label: "Sign in to Staff Portal", url: params.loginUrl }),
    });
  },

  /** Staff password reset notice — sent when admin resets password. */
  async sendStaffPasswordResetNotice(params: {
    to: string;
    name: string;
    newPassword: string;
    loginUrl: string;
  }) {
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.name)}</strong>,</p>
      <p>Your password for the <strong>Dr. Sharmistha Bhattacharyya Staff Portal</strong> has been reset by the clinic administrator.</p>
      
      <table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;margin:20px 0;padding:18px;">
        <tr><td style="font-size:13px;color:#1e40af;padding:5px 0;"><strong>Login email (ID):</strong> <span style="font-family:monospace;font-weight:600;">${esc(params.to)}</span></td></tr>
        <tr><td style="font-size:13px;color:#1e40af;padding:6px 0;"><strong>New password:</strong>
          <code style="background:#ffffff;padding:4px 10px;border-radius:6px;font-size:14px;font-weight:700;color:#1e3a8a;border:1px solid #93c5fd;letter-spacing:0.5px;">${esc(params.newPassword)}</code>
        </td></tr>
      </table>

      <p style="font-size:14px;color:#374151;line-height:1.6;">
        You can now sign in to your account with this new password.
      </p>
    `;
    return sendEmail({
      to: params.to, toName: params.name,
      subject: "Your Staff Portal password has been reset — Dr. Sharmistha Bhattacharyya",
      html: emailLayout("Password Reset by Administrator", content, { label: "Sign in to Staff Portal", url: params.loginUrl }),
    });
  },

  /** Enquiry acknowledgement to patient. */
  async sendEnquiryAck(params: {
    to: string;
    patientName: string;
    service?: string;
    preferredDate?: string;
    message?: string;
  }) {
    const rows = [
      params.service ? `<tr><td style="font-size:13px;color:#374151;padding:5px 0;width:40%;"><strong>Service enquired:</strong></td><td style="font-size:13px;color:#111827;padding:5px 0 5px 12px;">${esc(params.service)}</td></tr>` : "",
      params.preferredDate ? `<tr><td style="font-size:13px;color:#374151;padding:5px 0;"><strong>Preferred date:</strong></td><td style="font-size:13px;color:#111827;padding:5px 0 5px 12px;">${esc(params.preferredDate)}</td></tr>` : "",
      params.message ? `<tr><td style="font-size:13px;color:#374151;padding:5px 0;vertical-align:top;"><strong>Your message:</strong></td><td style="font-size:13px;color:#111827;padding:5px 0 5px 12px;">${esc(params.message)}</td></tr>` : "",
    ].join("");
    const content = `
      <p style="margin-top:0;">Dear <strong>${esc(params.patientName)}</strong>,</p>
      <p>Thank you for reaching out to Dr. Sharmistha Bhattacharyya's clinic. We have received your enquiry and will contact you shortly to confirm your appointment.</p>
      ${rows ? `<table width="100%" border="0" cellspacing="0" cellpadding="0"
        style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin:20px 0;padding:16px;">
        <tr><td colspan="2" style="font-size:13px;font-weight:700;color:#111827;padding-bottom:8px;border-bottom:1px solid #e5e7eb;">Your enquiry summary</td></tr>
        ${rows}
      </table>` : ""}
      <p style="font-size:14px;color:#4b5563;">If you have an urgent question, feel free to WhatsApp or call us directly.</p>
    `;
    return sendEmail({
      to: params.to, toName: params.patientName,
      subject: "Enquiry received — Dr. Sharmistha Bhattacharyya",
      html: emailLayout("Enquiry received ✓", content),
    });
  },
};
