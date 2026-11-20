import urllib.request
import json
import http.cookiejar

BASE = "http://localhost:3000"
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def post(url, data):
    req = urllib.request.Request(
        f"{BASE}{url}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"}
    )
    with opener.open(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

def patch(url, data):
    req = urllib.request.Request(
        f"{BASE}{url}",
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="PATCH"
    )
    with opener.open(req) as resp:
        return json.loads(resp.read().decode("utf-8"))

print("1. Logging in as Admin Dr. Sharmistha...")
login_res = post("/api/staff/login", {
    "email": "dr.sharmistha.bhattacharyya@gmail.com",
    "password": "ADMIN@1234"
})
print("Login result:", login_res)
assert login_res.get("ok"), "Admin login failed"

print("\n2. Creating a new staff account (Receptionist)...")
new_staff = {
    "name": "Ananya Sharma",
    "email": "ananya.reception@gmail.com",
    "phone": "+91 98111 22334",
    "role": "receptionist",
    "password": "Reception@2026!",
    "sendEmail": True
}
team_res = post("/api/staff/team", new_staff)
print("Create staff result:", team_res)
user_id = team_res.get("userId")

print(f"\n3. Testing Admin Password Reset for staff member ({user_id})...")
reset_res = patch(f"/api/staff/team/{user_id}", {
    "password": "NewSecret@2026!",
    "notifyStaff": True
})
print("Reset password result:", reset_res)

print("\n4. Testing login with new password for the staff member...")
# Create a fresh opener without admin cookie
staff_cj = http.cookiejar.CookieJar()
staff_opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(staff_cj))
req = urllib.request.Request(
    f"{BASE}/api/staff/login",
    data=json.dumps({"email": "ananya.reception@gmail.com", "password": "NewSecret@2026!"}).encode("utf-8"),
    headers={"Content-Type": "application/json"}
)
with staff_opener.open(req) as resp:
    staff_login = json.loads(resp.read().decode("utf-8"))
print("Staff login with reset password result:", staff_login)
assert staff_login.get("ok"), "Staff login failed"

print("\n5. Checking staff-login page content to confirm no 'forgot password' links exist...")
req_page = urllib.request.Request(f"{BASE}/staff-login")
with urllib.request.urlopen(req_page) as resp:
    html = resp.read().decode("utf-8")
assert "First time here" not in html, "Found 'First time here' in login page!"
assert "forgot" not in html.lower() or "for account assistance or password resets, contact the clinic admin" in html.lower(), "Found unexpected forgot password reference"
print("Verification passed! No self-service reset or forgot password links exist on staff login page.")
print("\nALL TESTS PASSED SUCCESSFULLY!")
