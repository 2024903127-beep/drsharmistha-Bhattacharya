import urllib.request
import json

BASE = "http://localhost:3000"

print("--- STEP 1: Creating live booking via API ---")
booking_payload = {
    "name": "Rahul Mishra",
    "phone": "+918287034496",
    "email": "dr.sharmistha.bhattacharyya@gmail.com",
    "service": "Rhinoplasty (Nose Surgery)",
    "date": "2026-11-21",
    "time": "11:00",
    "message": "Live test booking to verify Google Calendar, Google Meet link, Brevo email, and WhatsApp notifications."
}

req1 = urllib.request.Request(
    f"{BASE}/api/booking/create-order",
    data=json.dumps(booking_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req1) as resp:
        order_res = json.loads(resp.read().decode("utf-8"))
        print("Create Order Result:", order_res)
except Exception as e:
    if hasattr(e, "read"):
        print("Error response:", e.read().decode())
    raise e

booking_ref = order_res.get("bookingRef")
print(f"Booking reference created: {booking_ref}")

print("\n--- STEP 2: Confirming payment & activating calendar/email/whatsapp triggers ---")
verify_payload = {
    "bookingRef": booking_ref,
    "demo": True
}

req2 = urllib.request.Request(
    f"{BASE}/api/booking/verify",
    data=json.dumps(verify_payload).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)

with urllib.request.urlopen(req2) as resp:
    verify_res = json.loads(resp.read().decode("utf-8"))
    print("Verify Result:", verify_res)

print("\n--- STEP 3: Verifying appointment record in database ---")
import ssl, pg8000.native

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

conn = pg8000.native.Connection(
    user="postgres",
    password="xiI4iYiaHT6Ix6LB",
    host="db.cyreyzeipyvvfuyijqfm.supabase.co",
    port=5432,
    database="postgres",
    ssl_context=ctx
)

res = conn.run(f"SELECT id, ref, service, status, starts_at, meet_link, google_event_id FROM appointments WHERE ref = '{booking_ref}';")
if res:
    appt = res[0]
    print(f"Appointment ID: {appt[0]}")
    print(f"Ref: {appt[1]}")
    print(f"Service: {appt[2]}")
    print(f"Status: {appt[3]}")
    print(f"Starts At: {appt[4]}")
    print(f"Google Meet Link: {appt[5]}")
    print(f"Google Event ID: {appt[6]}")

print("\n--- STEP 4: Checking outbound message logs (Email & WhatsApp) ---")
logs = conn.run(f"SELECT channel, template, recipient, status, error, created_at FROM message_log ORDER BY created_at DESC LIMIT 5;")
for l in logs:
    print(f" - [{l[0].upper()}] To: {l[2]} | Status: {l[3]} | Template: {l[1]} | Error: {l[4]}")

conn.close()
print("\nTEST COMPLETED!")
