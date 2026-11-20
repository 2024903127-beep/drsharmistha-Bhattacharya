import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { createElement as h } from "react";

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const senderName = "Dr. Sharmistha Bhattacharyya";
const recipient = "rahulmishraoffical69@gmail.com";

const s = StyleSheet.create({
  page: { paddingTop: 32, paddingBottom: 48, paddingHorizontal: 36, fontSize: 9, fontFamily: "Helvetica", color: "#334155", backgroundColor: "#fff" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: "#b99a65", paddingBottom: 14, marginBottom: 16 },
  orgName: { fontSize: 15, fontFamily: "Helvetica-Bold", color: "#0f2d24", letterSpacing: 0.3 },
  orgSub: { fontSize: 7.5, color: "#64748b", marginTop: 2 },
  badge: { backgroundColor: "#f0f7f4", borderWidth: 1, borderColor: "#173d32", borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8, marginBottom: 4 },
  badgeText: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f2d24", textTransform: "uppercase", letterSpacing: 0.5 },
  docCode: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  card: { backgroundColor: "#f8fafc", borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 8, padding: 10, marginBottom: 10 },
  cardTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#0f2d24", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: "#cbd5e1", paddingBottom: 3 },
  row: { flexDirection: "row", alignItems: "flex-start" },
  col2: { flex: 1, paddingRight: 6 },
  label: { fontSize: 7, fontFamily: "Helvetica-Bold", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 1.5 },
  value: { fontSize: 8.5, color: "#0f172a", marginBottom: 5 },
  amtRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 7, borderTopWidth: 1, borderTopColor: "#cbd5e1", marginTop: 2 },
  amtLabel: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  amtValue: { fontSize: 14, fontFamily: "Helvetica-Bold", color: "#0f2d24" },
  paidBadge: { backgroundColor: "#ecfdf5", borderWidth: 1, borderColor: "#a7f3d0", borderRadius: 4, paddingVertical: 2, paddingHorizontal: 7, alignSelf: "flex-start", marginTop: 1 },
  paidText: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#047857" },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, borderTopWidth: 1, borderTopColor: "#cbd5e1", paddingTop: 6, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#64748b" }
});

async function run() {
  console.log("Generating sample Receipt PDF with @react-pdf/renderer...");
  
  const doc = h(Document, { title: "Receipt — INV-TEST-001" },
    h(Page, { size: "A4", style: s.page },
      h(View, { style: s.headerRow },
        h(View, {},
          h(Text, { style: s.orgName }, "Dr. Sharmistha Bhattacharyya"),
          h(Text, { style: s.orgSub }, "Plastic and Aesthetic Surgery"),
          h(Text, { style: s.orgSub }, "Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana – 121002"),
          h(Text, { style: s.orgSub }, "+91 96672 07009 | consultations@drsharmisthabhattacharyya.com"),
        ),
        h(View, { style: { alignItems: "flex-end" } },
          h(View, { style: s.badge }, h(Text, { style: s.badgeText }, "Payment Receipt")),
          h(Text, { style: s.docCode }, "INV-TEST-001"),
        )
      ),
      h(View, { style: s.card },
        h(Text, { style: s.cardTitle }, "Receipt Details"),
        h(View, { style: s.row },
          h(View, { style: s.col2 }, h(Text, { style: s.label }, "Patient"), h(Text, { style: s.value }, "Rahul Mishra")),
          h(View, { style: s.col2 }, h(Text, { style: s.label }, "Service"), h(Text, { style: s.value }, "Online Video Consultation — Rhinoplasty")),
        ),
        h(View, { style: s.row },
          h(View, { style: s.col2 }, h(Text, { style: s.label }, "Payment ID"), h(Text, { style: s.value }, "pay_TEST_123456789")),
          h(View, { style: s.col2 }, h(Text, { style: s.label }, "Date"), h(Text, { style: s.value }, new Date().toLocaleDateString("en-IN"))),
        )
      ),
      h(View, { style: s.card },
        h(View, { style: s.amtRow },
          h(Text, { style: s.amtLabel }, "Amount Paid"),
          h(Text, { style: s.amtValue }, "₹1,500.00"),
        ),
        h(View, { style: s.paidBadge }, h(Text, { style: s.paidText }, "● PAID IN FULL")),
      ),
      h(View, { style: s.footer, fixed: true },
        h(Text, { style: s.footerText }, "Dr. Sharmistha Bhattacharyya • Confidential Medical Document"),
        h(Text, { style: s.footerText }, "INV-TEST-001 • Test Generated"),
      )
    )
  );

  const pdfBuffer = Buffer.from(await renderToBuffer(doc));
  const base64Pdf = pdfBuffer.toString("base64");
  console.log(`PDF successfully generated! Size: ${pdfBuffer.length} bytes.`);

  console.log(`Sending receipt email with attached PDF to ${recipient}...`);

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: recipient, name: "Rahul Mishra" }],
      subject: "Receipt with Attached PDF — Dr. Sharmistha Bhattacharyya",
      htmlContent: `<p>Dear Rahul,</p><p>Please find attached your official payment receipt PDF generated via <strong>@react-pdf/renderer</strong>.</p><p>Dr. Sharmistha Bhattacharyya Clinic</p>`,
      attachment: [
        {
          name: "Receipt-INV-TEST-001.pdf",
          content: base64Pdf,
        }
      ]
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("Failed to send attachment email:", res.status, data);
    process.exit(1);
  }

  console.log("SUCCESS! Email with attached PDF sent successfully.");
  console.log("Brevo MessageId:", data.messageId);
}

run();
