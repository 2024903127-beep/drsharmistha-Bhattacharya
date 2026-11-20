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
    // Core pages
    e("/", 1.0, "weekly"),
    e("/services", 0.95, "weekly"),
    e("/about-dr-sharmistha", 0.9, "monthly"),
    e("/book-consultation", 0.9, "weekly"),
    e("/locations", 0.8, "monthly"),
    e("/contact", 0.7, "monthly"),
    e("/blog", 0.6, "weekly"),

    // Legal / compliance (lower priority, rarely change)
    e("/privacy-policy", 0.3, "yearly"),
    e("/terms-and-conditions", 0.3, "yearly"),
    e("/data-protection-and-hipaa", 0.3, "yearly"),
    e("/telemedicine-consent", 0.3, "yearly"),
    e("/cancellation-and-refund", 0.4, "yearly"),

    // Service detail pages (high-value keyword pages)
    ...services.map((s) => e(`/services/${s.slug}`, 0.85, "monthly")),

    // Location hub pages
    ...locations.map((l) => e(`/locations/${l.slug}`, 0.75, "monthly")),

    // Service × Location long-tail pages (flagship services only)
    ...flagship.flatMap((s) =>
      locations.map((l) => e(`/services/${s.slug}/${l.slug}`, 0.65, "monthly"))
    ),

    // Blog articles (only published, non-draft)
    ...articles.map((a) =>
      e(`/blog/${a.slug}`, 0.55, "monthly")
    ),
  ];
}
