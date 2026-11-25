import { site, pillars, journey, testimonials } from "@/lib/site";
import { services, articles, faq } from "@/lib/content";
import { locations } from "@/lib/locations";

export const dynamic = "force-static";

export function GET() {
  const parts: string[] = [
    `# ${site.name} — Complete Clinical Knowledge Base (Delhi NCR)`,
    `Canonical URL: ${site.url}`,
    `Surgeon: Dr. Sharmistha Bhattacharyya (MBBS, MS General Surgery, MCh Plastic & Reconstructive Surgery — AIIMS New Delhi; ISAPS Aesthetic Fellow)`,
    `Surgical Centre: ${site.hospital.name}, ${site.hospital.street}, ${site.hospital.city}, ${site.hospital.region} ${site.hospital.postal} (NABH & NABL Accredited, Class-100 HEPA suites, dedicated ICU)`,
    `Consultation Hours: Monday to Saturday, 10:00 AM – 7:00 PM IST (Online 1:1 consultations & in-person evaluations)`,
    `Book Consultation: ${site.url}/book-consultation | Contact: ${site.phone} | ${site.email}`,
    "",
    "---",
    "",
    "## Clinical Pillars",
    ...pillars.map((p) => `### ${p.t}\n${p.d}`),
    "",
    "## 7-Step Patient Journey",
    ...journey.map(([t, d], i) => `${i + 1}. **${t}:** ${d}`),
    "",
    "## Geographic Coverage Across Delhi NCR",
    ...locations.map(
      (l) =>
        `### ${l.headline}\nURL: ${site.url}/locations/${l.slug}\nNeighbourhoods: ${l.areas.join(", ")}\n${l.intro}\n${l.portfolioNote}\n${l.travel}`
    ),
    "",
    "## Frequently Asked Questions",
    ...faq.map((f) => `### ${f.q}\n${f.a}`),
    "",
    "## Verified Patient Reviews",
    ...testimonials.map((t) => `- **${t.n}** (${t.p}, ${t.l}): "${t.q}"`),
    "",
    "---",
    "",
    "## Detailed Q&A Procedure Dossiers",
  ];

  for (const s of services) {
    parts.push(
      `### ${s.name} (${s.category})`,
      `URL: ${site.url}/services/${s.slug}`,
      `Summary: ${s.short}`,
      `Hospital Stay: ${s.stay || "Assessed individually"} | Anaesthesia: ${s.anesthesia || "Assessed individually"} | Pricing: Individualised upon 1:1 clinical assessment`,
      ""
    );
    for (const sec of s.sections) {
      parts.push(`#### ${sec.heading}`, sec.body, "");
    }
  }

  parts.push("---", "", "## In-Depth Patient Guides");
  for (const a of articles) {
    parts.push(`### ${a.title}`, `URL: ${site.url}/blog/${a.slug}`, `Summary: ${a.excerpt}`, "");
    const fullBody = (a as { body?: string }).body;
    if (fullBody) parts.push(fullBody, "");
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
