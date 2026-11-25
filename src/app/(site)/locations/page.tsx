import Link from "next/link";
import { buildMeta, breadcrumbLd, physicianLd } from "@/lib/seo";
import { locations } from "@/lib/locations";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "Plastic Surgeon Across Delhi NCR | Gurgaon, South Delhi",
  description:
    "Segregated consultation and surgical care across Delhi NCR — Gurgaon (Golf Course Road), South Delhi, and Faridabad — with AIIMS-trained surgeon Dr. Sharmistha Bhattacharyya.",
  path: "/locations",
  keywords: [
    "plastic surgeon Gurgaon Golf Course Road",
    "plastic surgeon South Delhi",
    "plastic surgeon Delhi NCR",
    "plastic surgeon Faridabad",
    "cosmetic surgery Greater Kailash",
    "cosmetic surgeon DLF Phase 5",
  ],
});

export default function Locations() {
  return (
    <>
      <JsonLd
        data={[
          physicianLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
          ]),
        ]}
      />
      <section className="relative overflow-hidden bg-forest-deep text-ivory">
        <div className="gold-line w-full" />
        <div className="wrap py-14 md:py-20">
          <p className="lux-label text-gold/80">Across Delhi NCR</p>
          <h1 className="h-display mt-4 text-4xl text-ivory md:text-6xl">
            Care Across Delhi NCR — Gurgaon, South Delhi &amp; Faridabad
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-ivory/72 leading-relaxed">
            Begin privately from home with a detailed 1:1 online consultation. Surgical procedures take place personally with Dr.&nbsp;Sharmistha at{" "}
            {site.hospital.name} ({site.hospital.street}, {site.hospital.city}), an NABH-accredited tertiary hospital with Class-100 HEPA suites and ICU backup.
          </p>
        </div>
        <div className="gold-line w-full" />
      </section>

      <section className="wrap py-14 md:py-20">
        <ul className="grid gap-8 md:grid-cols-3">
          {locations.map((l, idx) => (
            <li
              key={l.slug}
              className="glass-card-light flex flex-col justify-between border border-forest/15 bg-white/80 p-6 md:p-7 rounded-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                    0{idx + 1} · {l.region}
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl text-forest">
                  <Link href={`/locations/${l.slug}`} className="hover:text-gold-deep transition-colors">
                    {l.name}
                  </Link>
                </h2>
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-stone/75">
                  {l.portfolioTag}
                </p>
                <div className="my-4 h-px bg-gradient-to-r from-gold/40 to-transparent" />
                <p className="text-sm text-stone leading-relaxed">{l.intro}</p>
                <p className="mt-3 text-xs text-stone/80 leading-relaxed">
                  <strong className="text-forest">Key neighbourhoods:</strong> {l.areas.slice(0, 5).join(", ")}
                </p>
              </div>
              <Link
                href={`/locations/${l.slug}`}
                className="btn btn-line mt-6 w-full justify-center text-sm"
              >
                Explore {l.shortName} patient guide →
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />
    </>
  );
}
