# WhatsApp message templates (submit in Meta Business Manager)

WhatsApp only lets a business start a conversation with an APPROVED template. Create these 8 in WhatsApp Manager,
category **Utility**, language **English** (set `WHATSAPP_LANG` to the same code, for example `en`).
Template names must match exactly. Variables are numbered in the order shown. Approval usually takes minutes to a few days.
Do not put medical details in templates. Documents are sent as a secure link button, never as the file itself.

| Name | Body text | Button |
|---|---|---|
| booking_confirmation | Hello {{1}}, your online consultation for {{2}} with Dr. Sharmistha Bhattacharyya is confirmed for {{3}} at {{4}} (IST). Google Meet link: {{5}} | none |
| payment_receipt | Hello {{1}}, we have received your payment of Rs. {{2}}. Your receipt number is {{3}}. | URL, text "View receipt", URL `https://YOURDOMAIN/d/{{1}}` |
| appointment_reminder | Hello {{1}}, a reminder of your consultation with Dr. Sharmistha Bhattacharyya on {{2}} at {{3}} (IST). Google Meet link: {{4}} | none |
| appointment_rescheduled | Hello {{1}}, your consultation has been moved to {{2}} at {{3}} (IST). Google Meet link: {{4}} | none |
| appointment_cancelled | Hello {{1}}, your consultation on {{2}} has been cancelled. Please contact us to book a new time. | none |
| prescription_ready | Hello {{1}}, your prescription from Dr. Sharmistha Bhattacharyya is ready. Tap below to view it securely. The link expires in 30 days. | URL, text "View prescription", URL `https://YOURDOMAIN/d/{{1}}` |
| report_ready | Hello {{1}}, a new report has been added to your record at Dr. Sharmistha Bhattacharyya's clinic. Tap below to view it securely. The link expires in 30 days. | URL, text "View report", URL `https://YOURDOMAIN/d/{{1}}` |
| followup_checkin | Hello {{1}}, thank you for consulting with Dr. Sharmistha Bhattacharyya. If you have any questions about your plan, reply to this message or call +91 96672 07009. | none |

Notes
- Replace YOURDOMAIN with the real domain. For the three URL buttons Meta asks for an example value of {{1}}; use any sample token.
- Variables in {{ }} cannot be empty. The app sends text such as "shared before your consultation" when no Meet link exists yet.
- Until a template shows "Approved", sends fail and the failure appears in Staff portal > WhatsApp and email > Recent messages. Email still goes out.
- Replies from patients arrive in the WhatsApp Business app or Manager inbox of the same number.
