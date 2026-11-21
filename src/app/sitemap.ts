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
    e("/book-consultation", 0.95, "weekly"),   // primary conversion page
    e("/about-dr-sharmistha", 0.9, "monthly"),

    // ── Tier 2: discovery + trust pages ──────────────────────────
    e("/locations", 0.8, "monthly"),
    e("/contact", 0.75, "monthly"),
    e("/blog", 0.7, "weekly"),

    // ── Tier 3: legal / compliance ────────────────────────────────
    e("/privacy-policy", 0.3, "yearly"),
    e("/terms-and-conditions", 0.3, "yearly"),
    e("/data-protection-and-hipaa", 0.3, "yearly"),
    e("/telemedicine-consent", 0.3, "yearly"),
    e("/cancellation-and-refund", 0.4, "yearly"),

    // ── Service detail pages (high-value keyword pages) ───────────
    ...services.map((s) => e(`/services/${s.slug}`, 0.88, "monthly")),

    // ── Location hub pages ────────────────────────────────────────
    ...locations.map((l) => e(`/locations/${l.slug}`, 0.78, "monthly")),

    // ── Service × Location long-tail pages ───────────────────────
    ...flagship.flatMap((s) =>
      locations.map((l) => e(`/services/${s.slug}/${l.slug}`, 0.68, "monthly"))
    ),

    // ── Blog articles ─────────────────────────────────────────────
    ...articles.map((a) =>
      e(`/blog/${a.slug}`, 0.58, "monthly")
    ),
  ];
}

