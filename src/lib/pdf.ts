import "server-only";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { createElement as h } from "react";

// ── Brand colours (Dr. Sharmistha — luxury, forest + gold) ──────────────────
const FOREST   = "#173d32";   // Deep forest green (primary)
const FOREST_D = "#0f2d24";   // Darker forest for headings
const FOREST_L = "#f0f7f4";   // Soft green tint
const GOLD     = "#b99a65";   // Accent gold
const INK_900  = "#0f172a";   // Near-black body
const INK_700  = "#334155";   // Slate body
const INK_500  = "#64748b";   // Muted labels
const INK_300  = "#cbd5e1";   // Light borders
const INK_100  = "#f8fafc";   // Card bg
const GREEN_BG  = "#ecfdf5";
const GREEN_TXT = "#047857";

// ── Shared stylesheet ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 48, paddingHorizontal: 36, fontSize: 9, fontFamily: "Helvetica", color: INK_700, backgroundColor: "#fff" },

  // Header
  headerRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: GOLD, paddingBottom: 14, marginBottom: 16 },
  orgName:     { fontSize: 15, fontFamily: "Helvetica-Bold", color: FOREST_D, letterSpacing: 0.3 },
  orgSub:      { fontSize: 7.5, color: INK_500, marginTop: 2 },
  badge:       { backgroundColor: FOREST_L, borderWidth: 1, borderColor: FOREST, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, marginBottom: 4 },
  badgeText:   { fontSize: 9, fontFamily: "Helvetica-Bold", color: FOREST_D, textTransform: "uppercase", letterSpacing: 0.5 },
  docCode:     { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK_900 },
  docDate:     { fontSize: 7.5, color: INK_500, marginTop: 1 },

  // Cards
  card:        { backgroundColor: INK_100, borderWidth: 1, borderColor: INK_300, borderRadius: 8, padding: 10, marginBottom: 10 },
  cardHL:      { backgroundColor: FOREST_L, borderWidth: 1, borderColor: "#99f6e4", borderRadius: 8, padding: 10, marginBottom: 10 },
  cardTitle:   { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: FOREST_D, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: INK_300, paddingBottom: 3 },

  // Grid
  row:   { flexDirection: "row", alignItems: "flex-start" },
  col2:  { flex: 1, paddingRight: 6 },
  col3:  { flex: 1, paddingRight: 4 },

  // Fields
  label: { fontSize: 7, fontFamily: "Helvetica-Bold", color: INK_500, textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 1.5 },
  value: { fontSize: 8.5, color: INK_900, marginBottom: 5 },
  valueBold: { fontSize: 9, fontFamily: "Helvetica-Bold", color: INK_900, marginBottom: 5 },

  // Amount summary
  amtRow:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderTopWidth: 1, borderTopColor: INK_300, marginTop: 2 },
  amtLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: INK_900 },
  amtValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: FOREST_D },

  // Paid badge
  paidBadge: { backgroundColor: GREEN_BG, borderWidth: 1, borderColor: "#a7f3d0", borderRadius: 4, paddingVertical: 2, paddingHorizontal: 7, alignSelf: "flex-start", marginTop: 1 },
  paidText:  { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: GREEN_TXT },

  // Footer
  footer:     { position: "absolute", bottom: 20, left: 36, right: 36, borderTopWidth: 1, borderTopColor: INK_300, paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: INK_500 },

  // Sign-off
  signoffRow:    { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: INK_300 },
  signoffBox:    { alignItems: "center", width: 180 },
  signoffLine:   { width: "100%", borderBottomWidth: 1, borderBottomColor: INK_900, marginBottom: 4 },
  signoffTitle:  { fontSize: 8, fontFamily: "Helvetica-Bold", color: INK_900, textAlign: "center" },
  signoffSub:    { fontSize: 7, color: INK_500, textAlign: "center" },

  // Note
  note: { fontSize: 8, color: INK_500, marginTop: 8, fontStyle: "italic" },
});

// ── Shared header ─────────────────────────────────────────────────────────────
function Header(docType: string, docCode: string, dateStr: string) {
  return h(View, { style: s.headerRow },
    h(View, {},
      h(Text, { style: s.orgName }, "Dr. Sharmistha Bhattacharyya"),
      h(Text, { style: s.orgSub }, "Plastic and Aesthetic Surgery"),
      h(Text, { style: s.orgSub }, "Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana – 121002"),
      h(Text, { style: s.orgSub }, "+91 96672 07009  |  consultations@drsharmisthabhattacharyya.com"),
    ),
    h(View, { style: { alignItems: "flex-end" } },
      h(View, { style: s.badge }, h(Text, { style: s.badgeText }, docType)),
      h(Text, { style: s.docCode }, docCode),
      h(Text, { style: s.docDate }, `Issued: ${dateStr}`),
    ),
  );
}

// ── Shared footer ─────────────────────────────────────────────────────────────
function Footer(docCode: string) {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  return h(View, { style: s.footer, fixed: true },
    h(Text, { style: s.footerText }, "Dr. Sharmistha Bhattacharyya  •  Confidential Medical Document"),
    h(Text, { style: s.footerText }, `${docCode}  •  Printed ${now} IST`),
  );
}

// =============================================================================
// 1.  PAYMENT RECEIPT PDF
// =============================================================================

export interface ReceiptData {
  invoiceNo: string;
  date: string;         // e.g. "25 Dec 2026"
  patient: string;
  phone: string;
  email?: string | null;
  service: string;
  slot: string;         // e.g. "Wednesday, 25 Dec 2026 at 11:00 AM"
  amountInr: number;
  paymentId: string;
  method?: string;
}

export async function renderReceiptPdf(data: ReceiptData): Promise<Buffer> {
  const rows: [string, string][] = [
    ["Receipt no.", data.invoiceNo],
    ["Date", data.date],
    ["Patient", data.patient],
    ["Phone", data.phone],
    ...(data.email ? [["Email", data.email] as [string, string]] : []),
    ["Service", `Online video consultation — ${data.service}`],
    ["Consultation time", data.slot],
    ["Payment ID", data.paymentId],
    ["Payment method", data.method ?? "Online"],
  ];

  const doc = h(Document, { title: `Receipt — ${data.invoiceNo}` },
    h(Page, { size: "A4", style: s.page },
      Header("Payment Receipt", data.invoiceNo, data.date),

      // Patient & payment details
      h(View, { style: s.card },
        h(Text, { style: s.cardTitle }, "Receipt Details"),
        ...rows.map(([k, v]) =>
          h(View, { style: s.row, key: k },
            h(View, { style: s.col2 },
              h(Text, { style: s.label }, k),
              h(Text, { style: s.value }, v),
            ),
          )
        ),
      ),

      // Amount summary
      h(View, { style: s.cardHL },
        h(View, { style: s.amtRow },
          h(Text, { style: s.amtLabel }, "Amount Paid"),
          h(Text, { style: s.amtValue }, `₹${data.amountInr.toLocaleString("en-IN")}.00`),
        ),
        h(View, { style: s.paidBadge }, h(Text, { style: s.paidText }, "● PAID IN FULL")),
      ),

      // Sign-off
      h(View, { style: s.signoffRow },
        h(View, { style: s.signoffBox },
          h(View, { style: { height: 26 } }),
          h(View, { style: s.signoffLine }),
          h(Text, { style: s.signoffTitle }, "Authorised Signatory"),
          h(Text, { style: s.signoffSub }, "Dr. Sharmistha Bhattacharyya Clinic"),
        ),
      ),

      h(Text, { style: s.note }, "This is a computer-generated receipt and does not require a physical signature."),

      Footer(data.invoiceNo),
    ),
  );

  return Buffer.from(await renderToBuffer(doc));
}

// =============================================================================
// 2.  CONSULTATION SLIP PDF  (sent after booking, before the consultation)
// =============================================================================

export interface ConsultationSlipData {
  slipNo: string;
  date: string;
  patientName: string;
  phone: string;
  email?: string | null;
  service: string;
  slot: string;         // "Wednesday, 25 Dec 2026 at 11:00 AM IST"
  meetLink?: string | null;
  ref: string;
}

export async function renderConsultationSlipPdf(data: ConsultationSlipData): Promise<Buffer> {
  const doc = h(Document, { title: `Consultation Slip — ${data.slipNo}` },
    h(Page, { size: "A4", style: s.page },
      Header("Consultation Slip", data.slipNo, data.date),

      // Patient info
      h(View, { style: s.card },
        h(Text, { style: s.cardTitle }, "Patient Information"),
        h(View, { style: s.row },
          h(View, { style: s.col3 },
            h(Text, { style: s.label }, "Patient Name"),
            h(Text, { style: s.valueBold }, data.patientName),
          ),
          h(View, { style: s.col3 },
            h(Text, { style: s.label }, "Phone"),
            h(Text, { style: s.value }, data.phone),
          ),
          h(View, { style: s.col3 },
            h(Text, { style: s.label }, "Email"),
            h(Text, { style: s.value }, data.email ?? "—"),
          ),
        ),
      ),

      // Appointment
      h(View, { style: s.cardHL },
        h(Text, { style: s.cardTitle }, "Appointment Details"),
        h(View, { style: s.row },
          h(View, { style: s.col2 },
            h(Text, { style: s.label }, "Service"),
            h(Text, { style: s.valueBold }, data.service),
          ),
          h(View, { style: s.col2 },
            h(Text, { style: s.label }, "Reference"),
            h(Text, { style: s.value }, data.ref),
          ),
        ),
        h(View, { style: s.row },
          h(View, { style: s.col2 },
            h(Text, { style: s.label }, "Scheduled Time"),
            h(Text, { style: s.valueBold }, data.slot),
          ),
          h(View, { style: s.col2 },
            h(Text, { style: s.label }, "Google Meet Link"),
            h(Text, { style: s.value }, data.meetLink ?? "Will be shared before consultation"),
          ),
        ),
      ),

      // Instructions
      h(View, { style: { borderLeftWidth: 2.5, borderLeftColor: GOLD, paddingLeft: 8, marginBottom: 8 } },
        h(Text, { style: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: FOREST_D, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2.5 } }, "Patient Instructions"),
        h(Text, { style: { fontSize: 8.5, lineHeight: 1.4, color: INK_700 } },
          "1. Please join the Google Meet link 2–3 minutes before your scheduled time.\n" +
          "2. Ensure you are in a quiet, well-lit space with a stable internet connection.\n" +
          "3. Keep any recent medical reports, photos or prior prescriptions ready to share on screen.\n" +
          "4. For rescheduling or cancellation, contact us at least 12 hours in advance on +91 96672 07009.",
        ),
      ),

      // Sign-off
      h(View, { style: s.signoffRow },
        h(View, { style: s.signoffBox },
          h(View, { style: { height: 26 } }),
          h(View, { style: s.signoffLine }),
          h(Text, { style: s.signoffTitle }, "Dr. Sharmistha Bhattacharyya"),
          h(Text, { style: s.signoffSub }, "MS, MCh | Plastic, Aesthetic & Reconstructive Surgery"),
        ),
      ),

      Footer(data.slipNo),
    ),
  );

  return Buffer.from(await renderToBuffer(doc));
}
