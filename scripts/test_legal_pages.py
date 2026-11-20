import urllib.request
import html

BASE = "http://localhost:3000"

pages = [
    ("/privacy-policy", ["Privacy Policy", "Digital Personal Data Protection Act, 2023", "Data Fiduciary"]),
    ("/terms-and-conditions", ["Terms and Conditions", "IMPORTANT MEDICAL NOTICE", "AIIMS New Delhi"]),
    ("/data-protection-and-hipaa", ["Data Protection", "HIPAA", "Protected Health Information", "Minimum Necessary"]),
    ("/telemedicine-consent", ["Telemedicine", "Informed Consent Policy", "Telemedicine Practice Guidelines", "EMERGENCY EXCLUSION"]),
    ("/cancellation-and-refund", ["Cancellation", "Refund Policy", "Razorpay", "Rescheduling Policy"]),
]

print("Testing all newly added legal and compliance pages...")
for path, expected_strings in pages:
    url = f"{BASE}{path}"
    req = urllib.request.Request(url, headers={"User-Agent": "TestClient"})
    with urllib.request.urlopen(req) as resp:
        assert resp.status == 200, f"Expected 200 for {path}, got {resp.status}"
        page_html = html.unescape(resp.read().decode("utf-8"))
        for s in expected_strings:
            assert s in page_html, f"Missing '{s}' in {path}"
        print(f"✓ {path} loaded successfully with expected keywords (Status {resp.status})")

# Test Home Page Footer
print("\nTesting footer links on home page...")
with urllib.request.urlopen(f"{BASE}/") as resp:
    home_html = resp.read().decode("utf-8")
    assert "/privacy-policy" in home_html, "Footer missing /privacy-policy"
    assert "/terms-and-conditions" in home_html, "Footer missing /terms-and-conditions"
    assert "/data-protection-and-hipaa" in home_html, "Footer missing /data-protection-and-hipaa"
    assert "/telemedicine-consent" in home_html, "Footer missing /telemedicine-consent"
    assert "/cancellation-and-refund" in home_html, "Footer missing /cancellation-and-refund"
    print("✓ All 5 compliance documents linked in site footer!")

print("\nALL LEGAL & COMPLIANCE PAGES VERIFIED AND FULLY FUNCTIONAL!")
