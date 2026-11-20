"""
Creates all 6 WhatsApp Business message templates for Dr. Sharmistha Bhattacharyya clinic.
Meta API constraints:
  - Footer: max 60 characters
  - Body: max 1024 characters
  - URL buttons with {{1}} params need "example" field
  - Language: en_US
Run with: python scripts/create_whatsapp_templates.py
"""
import os, json, time
import requests
from dotenv import load_dotenv

load_dotenv(".env.local")
TOKEN = os.getenv("WHATSAPP_TOKEN")
WABA = "29086788174312639"
CALL = "+917838756141"
SITE = "https://drsharmisthabhattacharyya.com"
H = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

FOOTER = "Dr. Sharmistha Bhattacharyya | Accord Hospital"  # 47 chars

templates = [
    # ── 1. BOOKING CONFIRMATION ───────────────────────────────────────────────
    {
        "name": "booking_confirmed_v3",
        "category": "UTILITY",
        "language": "en_US",
        "components": [
            {"type": "HEADER", "format": "TEXT", "text": "Consultation Confirmed"},
            {
                "type": "BODY",
                "text": (
                    "Dear {{1}},\n\n"
                    "Your consultation with Dr. Sharmistha Bhattacharyya (MS, MCh - Plastic Surgery, AIIMS) is confirmed.\n\n"
                    "Date: {{2}}\nTime: {{3}} IST\nService: {{4}}\nRef: {{5}}\nMeet Link: {{6}}\n\n"
                    "Please join 5 minutes early with your medical reports, prescriptions and a valid ID. "
                    "To reschedule, inform us 24 hours in advance. Walk-in slots available at Accord Super Speciality Hospital, Faridabad. "
                    "We look forward to seeing you!"
                ),
                "example": {
                    "body_text": [["Rahul Mishra", "Sat 22 Nov 2026", "2:00 PM", "Rhinoplasty Consult", "BK-001", "meet.google.com/abc-def"]]
                }
            },
            {"type": "FOOTER", "text": FOOTER},
            {
                "type": "BUTTONS",
                "buttons": [
                    {"type": "PHONE_NUMBER", "text": "Call Clinic", "phone_number": CALL},
                    {"type": "URL", "text": "Book / Manage Appointment", "url": SITE + "/book"}
                ]
            }
        ]
    },

    # ── 2. REMINDER 24H BEFORE ────────────────────────────────────────────────
    {
        "name": "appt_reminder_24h_v2",
        "category": "UTILITY",
        "language": "en_US",
        "components": [
            {"type": "HEADER", "format": "TEXT", "text": "Your Consultation is Tomorrow"},
            {
                "type": "BODY",
                "text": (
                    "Hello {{1}},\n\n"
                    "Reminder: Your consultation with Dr. Sharmistha Bhattacharyya is tomorrow.\n\n"
                    "Date: {{2}}\nTime: {{3}} IST\nProcedure: {{4}}\nRef: {{5}}\n\n"
                    "Checklist:\n"
                    "- Previous medical reports and test results\n"
                    "- Before photos (if applicable for your procedure)\n"
                    "- List of current medications and supplements\n"
                    "- Questions or concerns you want to discuss\n"
                    "- Valid government-issued photo ID\n\n"
                    "To reschedule or cancel, please inform us at least 12 hours in advance. See you tomorrow!"
                ),
                "example": {
                    "body_text": [["Rahul Mishra", "Sat 22 Nov 2026", "2:00 PM", "Rhinoplasty Consult", "BK-001"]]
                }
            },
            {"type": "FOOTER", "text": FOOTER},
            {
                "type": "BUTTONS",
                "buttons": [
                    {"type": "PHONE_NUMBER", "text": "Call to Reschedule", "phone_number": CALL},
                    {"type": "URL", "text": "Manage My Booking", "url": SITE + "/book"}
                ]
            }
        ]
    },

    # ── 3. DOCUMENT READY ─────────────────────────────────────────────────────
    {
        "name": "document_ready_v3",
        "category": "UTILITY",
        "language": "en_US",
        "components": [
            {"type": "HEADER", "format": "TEXT", "text": "Your Document is Ready"},
            {
                "type": "BODY",
                "text": (
                    "Dear {{1}},\n\n"
                    "Your {{2}} from Dr. Sharmistha Bhattacharyya's clinic is now ready for secure download.\n\n"
                    "Document Type: {{2}}\nIssued On: {{3}}\nReference: {{4}}\n\n"
                    "Use the Download button below to securely access your document. "
                    "This link is private and unique to you - please do not share it with anyone else to protect your medical privacy.\n\n"
                    "The secure download link will expire in 30 days. Please download and save your document within this period. "
                    "Contact our clinic for any questions about your document or treatment plan."
                ),
                "example": {
                    "body_text": [["Rahul Mishra", "Prescription", "21 Nov 2026", "BK-001"]]
                }
            },
            {"type": "FOOTER", "text": FOOTER},
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "Download Document",
                        "url": SITE + "/d/{{1}}",
                        "example": [SITE + "/d/BK-001-abc123"]
                    },
                    {"type": "PHONE_NUMBER", "text": "Call Clinic", "phone_number": CALL}
                ]
            }
        ]
    },

    # ── 4. POST CONSULTATION FOLLOW-UP ────────────────────────────────────────
    {
        "name": "post_consult_followup_v2",
        "category": "UTILITY",
        "language": "en_US",
        "components": [
            {"type": "HEADER", "format": "TEXT", "text": "Follow-Up: How Are You Feeling?"},
            {
                "type": "BODY",
                "text": (
                    "Dear {{1}},\n\n"
                    "Thank you for your consultation with Dr. Sharmistha Bhattacharyya. We hope your experience was comfortable and informative.\n\n"
                    "Date: {{2}}\nProcedure: {{3}}\nRef: {{4}}\n\n"
                    "Your next steps:\n"
                    "- Follow the post-consultation care instructions shared during your session\n"
                    "- Take prescribed medications on time and complete the full course\n"
                    "- Attend your follow-up appointment as advised by Dr. Sharmistha\n"
                    "- Avoid strenuous activity and sun exposure as recommended\n\n"
                    "Call us immediately if you experience unusual swelling, fever above 101F, severe pain, or any unexpected symptoms. Your health is our top priority."
                ),
                "example": {
                    "body_text": [["Rahul Mishra", "21 Nov 2026", "Rhinoplasty Consult", "BK-001"]]
                }
            },
            {"type": "FOOTER", "text": FOOTER},
            {
                "type": "BUTTONS",
                "buttons": [
                    {"type": "PHONE_NUMBER", "text": "Call for Urgent Help", "phone_number": CALL},
                    {"type": "URL", "text": "Book Follow-Up", "url": SITE + "/book"}
                ]
            }
        ]
    },

    # ── 5. BOOKING CANCELLATION ───────────────────────────────────────────────
    {
        "name": "booking_cancelled_v3",
        "category": "UTILITY",
        "language": "en_US",
        "components": [
            {"type": "HEADER", "format": "TEXT", "text": "Appointment Cancellation Notice"},
            {
                "type": "BODY",
                "text": (
                    "Dear {{1}},\n\n"
                    "Your appointment with Dr. Sharmistha Bhattacharyya has been cancelled as requested.\n\n"
                    "Date: {{2}}\nTime: {{3}} IST\nService: {{4}}\nRef: {{5}}\nRefund Status: {{6}}\n\n"
                    "Refunds (if applicable) are processed within 5 to 7 business days to your original payment method. "
                    "Our team is always here to help you rebook at a more convenient time. "
                    "We hope to welcome you back soon - please feel free to book a new appointment whenever you are ready."
                ),
                "example": {
                    "body_text": [["Rahul Mishra", "22 Nov 2026", "2:00 PM", "Rhinoplasty Consult", "BK-001", "Refund of Rs.500 initiated"]]
                }
            },
            {"type": "FOOTER", "text": FOOTER},
            {
                "type": "BUTTONS",
                "buttons": [
                    {"type": "PHONE_NUMBER", "text": "Call Clinic", "phone_number": CALL},
                    {"type": "URL", "text": "Book New Appointment", "url": SITE + "/book"}
                ]
            }
        ]
    },

    # ── 6. PAYMENT CONFIRMED ──────────────────────────────────────────────────
    {
        "name": "payment_confirmed_v3",
        "category": "UTILITY",
        "language": "en_US",
        "components": [
            {"type": "HEADER", "format": "TEXT", "text": "Payment Successfully Received"},
            {
                "type": "BODY",
                "text": (
                    "Dear {{1}},\n\n"
                    "We have received your payment. Thank you for choosing Dr. Sharmistha Bhattacharyya. Your appointment is now fully confirmed.\n\n"
                    "Amount Paid: Rs. {{2}}\nTransaction ID: {{3}}\nDate: {{4}}\nBooking Ref: {{5}}\n\n"
                    "Your official invoice will be shared via email and is available to download on our website. "
                    "You will receive a separate confirmation message with your Google Meet link, and a reminder 24 hours before your consultation.\n\n"
                    "For any payment queries or refund requests, contact us and quote your Booking Reference number."
                ),
                "example": {
                    "body_text": [["Rahul Mishra", "1,500", "pay_QeK123XYZ", "21 Nov 2026", "BK-001"]]
                }
            },
            {"type": "FOOTER", "text": FOOTER},
            {
                "type": "BUTTONS",
                "buttons": [
                    {
                        "type": "URL",
                        "text": "View Invoice",
                        "url": SITE + "/invoices/{{1}}",
                        "example": [SITE + "/invoices/BK-001"]
                    },
                    {"type": "PHONE_NUMBER", "text": "Call Clinic", "phone_number": CALL}
                ]
            }
        ]
    }
]

# Validate lengths before sending
for t in templates:
    for c in t["components"]:
        if c["type"] == "FOOTER":
            if len(c["text"]) > 60:
                print(f"WARNING: Footer too long ({len(c['text'])} chars) in {t['name']}: '{c['text']}'")
        if c["type"] == "BODY":
            if len(c["text"]) > 1024:
                print(f"WARNING: Body too long ({len(c['text'])} chars) in {t['name']}")

print(f"Submitting {len(templates)} templates to WABA {WABA}...\n")
results = []
for t in templates:
    r = requests.post(f"https://graph.facebook.com/v19.0/{WABA}/message_templates", headers=H, json=t)
    body = r.json()
    ok = r.status_code == 200
    results.append({"name": t["name"], "ok": ok, "id": body.get("id"), "status": body.get("status"), "err": body.get("error", {})})
    icon = "OK" if ok else "FAIL"
    print(f"[{icon}] {t['name']}: id={body.get('id')} | approval={body.get('status')} | err={body.get('error', {}).get('error_user_msg', '')}")
    if not ok:
        print(f"       Full error: {json.dumps(body.get('error', {}))}")
    time.sleep(0.8)

print("\n── FINAL SUMMARY ──")
ok_count = sum(1 for r in results if r["ok"])
print(f"Success: {ok_count}/{len(templates)}")
for r in results:
    icon = "OK" if r["ok"] else "FAIL"
    print(f"  [{icon}] {r['name']} -> id={r['id']}, approval={r['status']}")
