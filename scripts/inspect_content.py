import json

with open("data/content.json", "r", encoding="utf-8") as f:
    d = json.load(f)

print(f"Total Services: {len(d.get('services', []))}")
for s in d.get("services", []):
    print(f" - {s['name']} ({s['slug']}) | sections: {len(s.get('sections', []))} | flagship: {s.get('flagship')}")

print(f"\nTotal Blog Articles: {len(d.get('articles', []))}")
for a in d.get("articles", []):
    print(f" - {a['title']} ({a['slug']})")

print(f"\nTotal FAQ items: {len(d.get('faq', []))}")
