import urllib.request
import json
import http.cookiejar

BASE = "http://localhost:3000"
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# Log in
login_req = urllib.request.Request(
    f"{BASE}/api/staff/login",
    data=json.dumps({"email": "dr.sharmistha.bhattacharyya@gmail.com", "password": "ADMIN@1234"}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
with opener.open(login_req) as resp:
    res = json.loads(resp.read().decode())
    print("Login:", res)

# Fetch settings page
with opener.open(f"{BASE}/staff/settings") as resp:
    html = resp.read().decode()
    if "WhatsApp Cloud API" in html:
        print("✓ Settings page loaded!")
        # Check if WhatsApp shows connected
        print("Checking WhatsApp status in HTML...")
        lines = [line.strip() for line in html.split("\n") if "WhatsApp" in line or "Connected" in line]
        for l in lines[:10]:
            print("  ", l)
