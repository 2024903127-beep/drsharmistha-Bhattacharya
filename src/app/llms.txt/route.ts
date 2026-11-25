import { site, pillars, testimonials } from "@/lib/site";
import { services, articles, categories, byCategory } from "@/lib/content";
import { locations } from "@/lib/locations";

export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${site.name} — Plastic, Aesthetic & Reconstructive Surgery Across Delhi NCR`,
    "",
    `> Single-surgeon, AIIMS-trained (MCh Plastic Surgery, AIIMS New Delhi) aesthetic and reconstructive practice serving patients across Delhi NCR — primarily Gurgaon (Golf Course Road, DLF Phases 1–5), South Delhi (Greater Kailash, Defence Colony, Vasant Vihar, Saket), and Faridabad. Every consultation (up to 45 min online / up to 60 min in-person) is conducted personally by Dr. Sharmistha Bhattacharyya with transparent individual assessment pricing and surgery performed exclusively in NABH-accredited Class-100 HEPA hospital suites.`,
    "",
    `## Key Identity & Credentials`,
    `- **Surgeon:** ${site.name} (MBBS KMC Manipal; MS General Surgery, Safdarjung Hospital; MCh Plastic & Reconstructive Surgery, AIIMS New Delhi; ISAPS Aesthetic Fellowship, Istanbul)`,
    `- **Memberships:** IAAPS, APSI, ISAPS`,
    `- **Experience:** ${site.claims.years} years surgical & clinical practice`,
    `- **Verified Google Rating:** ${site.claims.rating}/5.0 (${site.claims.reviews} verified Google reviews)`,
    `- **Surgical Campus:** ${site.hospital.name} (NABH & NABL Accredited, Class-100 HEPA OT & ICU), ${site.hospital.street}, ${site.hospital.city}, ${site.hospital.region} ${site.hospital.postal}`,
    `- **Website:** ${site.url}`,
    `- **Booking URL:** ${site.url}/book-consultation`,
    `- **Phone / WhatsApp:** ${site.phone}`,
    `- **Full Machine-Readable Clinical Dossier:** ${site.url}/llms-full.txt`,
    "",
    `## Practice Philosophy`,
    ...pillars.map((p) => `- **${p.t}:** ${p.d}`),
    "",
    `## Locations Served Across Delhi NCR`,
    ...locations.map(
      (l) => `- [${l.name}](${site.url}/locations/${l.slug}): ${l.intro} (Key areas: ${l.areas.join(", ")})`
    ),
    "",
    `## Core Pages`,
    `- [Home](${site.url}/): Overview, surgical safety standards, patient journey & verified testimonials`,
    `- [About Dr. Sharmistha (First-Person Story & CV)](${site.url}/about-dr-sharmistha): Degrees, AIIMS/ISAPS fellowships & surgical ethos`,
    `- [All Procedures](${site.url}/services): Complete index of ${services.length} surgical and non-surgical procedures`,
    `- [Book 1:1 Online Consultation](${site.url}/book-consultation): Reserve a Google Meet video evaluation Monday–Saturday`,
    `- [Patient Guides](${site.url}/blog): In-depth clinical guides tailored for Gurgaon, South Delhi & Delhi NCR`,
    "",
    `## Surgical & Non-Surgical Procedures (${services.length} Guides)`,
  ];

  for (const cat of categories) {
    lines.push("", `### ${cat}`);
    for (const s of byCategory(cat)) {
      lines.push(`- [${s.name}](${site.url}/services/${s.slug}): ${s.short}`);
    }
  }

  lines.push("", `## Detailed Regional Patient Guides (${articles.length} Articles)`);
  for (const a of articles) {
    lines.push(`- [${a.title}](${site.url}/blog/${a.slug}): ${a.excerpt}`);
  }

  lines.push("", `## Verified Patient Testimonials`);
  for (const t of testimonials) {
    lines.push(`- **${t.n} (${t.p} · ${t.l}):** "${t.q}"`);
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
