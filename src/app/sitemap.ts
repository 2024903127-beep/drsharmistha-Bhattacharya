import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { services, flagship, articles } from "@/lib/content";
import { locations } from "@/lib/locations";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const e = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly",
    lastModified = now
  ) => ({ url: `${site.url}${path}`, lastModified, priority, changeFrequency });

  return [
    // ── Tier 1: highest-value pages ──────────────────────────────
    e("/", 1.0, "weekly"),
    e("/services", 0.95, "weekly"),
    e("/book-consultation", 0.95, "weekly"),
    e("/about-dr-sharmistha", 0.9, "monthly"),

    // ── Tier 2: discovery, locations & guides ─────────────────────
    e("/locations", 0.85, "monthly"),
    e("/blog", 0.85, "weekly"),
    e("/contact", 0.75, "monthly"),

    // ── Service detail pages (high-value clinical Q&A pages) ──────
    ...services.map((s) => e(`/services/${s.slug}`, s.flagship ? 0.92 : 0.86, "monthly")),

    // ── Location hub pages (Gurgaon Golf Course Road, South Delhi, Faridabad)
    ...locations.map((l, idx) => e(`/locations/${l.slug}`, idx < 2 ? 0.88 : 0.8, "monthly")),

    // ── Unlocked long-form patient guides (Gurgaon / South Delhi / NCR)
    ...articles.map((a) => e(`/blog/${a.slug}`, 0.8, "monthly")),

    // ── Service × Location long-tail pages ────────────────────────
    ...flagship.flatMap((s) =>
      locations.map((l, idx) =>
        e(`/services/${s.slug}/${l.slug}`, idx < 2 ? 0.75 : 0.7, "monthly")
      )
    ),

    // ── Tier 3: legal / compliance ────────────────────────────────
    e("/privacy-policy", 0.3, "yearly"),
    e("/terms-and-conditions", 0.3, "yearly"),
    e("/data-protection-and-hipaa", 0.3, "yearly"),
    e("/telemedicine-consent", 0.3, "yearly"),
    e("/cancellation-and-refund", 0.4, "yearly"),
  ];
}
