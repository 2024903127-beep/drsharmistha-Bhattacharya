// Test script to send a test email via Brevo
const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_SENDER_EMAIL;
const senderName = "Dr. Sharmistha Bhattacharyya";
const recipient = "rahulmishraoffical69@gmail.com";

if (!apiKey || !senderEmail) {
  console.error("Missing BREVO_API_KEY or BREVO_SENDER_EMAIL in environment.");
  process.exit(1);
}

console.log(`Sending test email from ${senderName} <${senderEmail}> to ${recipient}...`);

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Test Consultation Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f0e8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c2526;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f0e8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);border:1px solid #e8e0d0;">
        <tr><td style="height:5px;background:linear-gradient(90deg,#b99a65 0%,#173d32 100%);"></td></tr>
        <tr><td style="padding:28px 36px 20px;border-bottom:1px solid #f0ece3;">
          <div style="font-size:19px;font-weight:700;color:#173d32;">Dr. Sharmistha Bhattacharyya</div>
          <div style="font-size:11px;color:#b99a65;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;margin-top:3px;">Plastic &amp; Aesthetic Surgery · Faridabad</div>
        </td></tr>
        <tr><td style="padding:32px 36px;">
          <h1 style="margin:0 0 8px;font-size:21px;font-weight:700;color:#111827;">Email System Test — Successful! ✓</h1>
          <div style="font-size:15px;line-height:1.65;color:#374151;">
            <p>Hello Rahul,</p>
            <p>This is a verified test email from the <strong>Dr. Sharmistha Bhattacharyya Doctor Platform</strong> sending system powered by Brevo.</p>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0f9f4;border:1px solid #a7f3d0;border-radius:10px;margin:20px 0;padding:16px;">
              <tr><td style="font-size:13px;color:#065f46;padding:4px 0;"><strong>Sender:</strong> ${senderName} &lt;${senderEmail}&gt;</td></tr>
              <tr><td style="font-size:13px;color:#065f46;padding:4px 0;"><strong>Recipient:</strong> ${recipient}</td></tr>
              <tr><td style="font-size:13px;color:#065f46;padding:4px 0;"><strong>Status:</strong> System Operational</td></tr>
              <tr><td style="font-size:13px;color:#065f46;padding:4px 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td></tr>
            </table>
            <p style="color:#4b5563;font-size:14px;">The rich email template formatting, styling, and Brevo API integration are working as intended.</p>
          </div>
          <div style="margin-top:28px;text-align:center;">
            <a href="http://localhost:3000" style="display:inline-block;padding:14px 32px;background:#173d32;color:#f7f4ed;text-decoration:none;font-size:15px;font-weight:600;border-radius:8px;">Open Clinic Website</a>
          </div>
        </td></tr>
        <tr><td style="padding:20px 36px;background-color:#faf8f4;border-top:1px solid #ede8de;text-align:center;">
          <div style="font-size:12px;font-weight:600;color:#4b5563;">Dr. Sharmistha Bhattacharyya</div>
          <div style="font-size:11px;color:#9ca3af;margin-top:2px;">Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana – 121002</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

async function run() {
  try {
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
        subject: "✓ Test Email: Dr. Sharmistha Bhattacharyya Clinic System",
        htmlContent,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Failed to send email. HTTP Status:", res.status);
      console.error("Response:", JSON.stringify(data, null, 2));
      process.exit(1);
    }

    console.log("SUCCESS! Email sent successfully.");
    console.log("Brevo MessageId:", data.messageId);
  } catch (err) {
    console.error("Error occurred while sending:", err);
    process.exit(1);
  }
}

run();
