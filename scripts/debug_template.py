"""
Debug template creation - get full error details
"""
import os, json, requests
from dotenv import load_dotenv
load_dotenv(".env.local")

TOKEN = os.getenv("WHATSAPP_TOKEN")
WABA = "29086788174312639"
HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}

# Minimal test - no emojis, no special chars
test = {
    "name": "booking_confirmation_v2",
    "category": "UTILITY",
    "language": "en_US",
    "components": [
        {
            "type": "HEADER",
            "format": "TEXT",
            "text": "Consultation Confirmed"
        },
        {
            "type": "BODY",
            "text": "Dear {{1}}, your consultation with Dr. Sharmistha Bhattacharyya is confirmed.\n\nDate: {{2}}\nTime: {{3}} IST\nService: {{4}}\nBooking Ref: {{5}}\nMeet Link: {{6}}\n\nPlease join 5 minutes early. Keep medical reports ready. Call us to reschedule.",
            "example": {"body_text": [["Rahul", "22 Nov", "2:00 PM", "Rhinoplasty", "BK-001", "meet.google.com/abc"]]}
        },
        {
            "type": "FOOTER",
            "text": "Dr. Sharmistha Bhattacharyya, Accord Hospital Faridabad"
        },
        {
            "type": "BUTTONS",
            "buttons": [
                {"type": "PHONE_NUMBER", "text": "Call Clinic", "phone_number": "+917838756141"},
                {"type": "URL", "text": "Visit Website", "url": "https://drsharmisthabhattacharyya.com/book"}
            ]
        }
    ]
}

r = requests.post(f"https://graph.facebook.com/v19.0/{WABA}/message_templates", headers=HEADERS, json=test)
print("Status:", r.status_code)
print("Response:", json.dumps(r.json(), indent=2))
