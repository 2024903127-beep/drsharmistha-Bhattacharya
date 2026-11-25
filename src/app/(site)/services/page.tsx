import Link from "next/link";
import { buildMeta, breadcrumbLd } from "@/lib/seo";
import { categories, byCategory, slugify } from "@/lib/content";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "Plastic Surgery Procedures Across Delhi NCR | Dr. Sharmistha",
  description:
    "Rhinoplasty, facelift, breast surgery, tummy tuck, liposuction, hair transplant, laser and anti-ageing treatments across Delhi NCR — Gurgaon, South Delhi & Faridabad.",
  path: "/services",
});

/* Category icon glyphs — SVG inline, no extra deps */
const categoryGlyph: Record<string, string> = {
  "Face & Neck Surgeries": "✦",
  "Breast Surgeries": "◈",
  "Body & Chest Surgeries": "◉",
  "Hair Restoration": "⟡",
  "Skin & Aesthetic Treatments": "⬡",
};

export default function Services() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Procedures", path: "/services" },
        ])}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden bg-forest-deep text-ivory">
        {/* Decorative background gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 80% 50%, rgba(185,154,101,.08) 0%, transparent 70%), radial-gradient(ellipse 40% 60% at 10% 100%, rgba(23,61,50,.6) 0%, transparent 70%)",
          }}
        />
        {/* Top gold line */}
        <div className="gold-line w-full" />
        <div className="relative wrap py-16 md:py-24">
          <p className="lux-label text-gold/80">All Procedures</p>
          <h1 className="h-display mt-5 text-5xl text-ivory md:text-7xl">
            Procedures &amp; Treatments
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ivory/70">
            Surgical and non-surgical care across five specialties — all planned
            and performed by Dr.&nbsp;Sharmistha Bhattacharyya, AIIMS-trained
            plastic surgeon.
          </p>
          {/* Category quick-nav pills */}
          <nav aria-label="Jump to category" className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c}
                href={`#${slugify(c)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-1.5 text-xs font-semibold tracking-wider text-gold transition-all duration-200 hover:border-gold hover:bg-gold/10"
              >
                <span aria-hidden>{categoryGlyph[c] ?? "◆"}</span>
                {c}
              </a>
            ))}
          </nav>
        </div>
        {/* Bottom gold line */}
        <div className="gold-line w-full" />
      </section>

      {/* ── Category sections ─────────────────────────────────────── */}
      {categories.map((c, idx) => {
        const isDark = idx % 2 === 1;
        return (
          <section
            key={c}
            id={slugify(c)}
            className={`scroll-mt-28 md:scroll-mt-36 py-16 md:py-24 ${isDark ? "bg-forest-deep" : "bg-ivory"}`}
          >
            <div className="wrap">
              {/* Section header */}
              <div className="mb-10 flex flex-col gap-3">
                <p
                  className={`lux-label ${isDark ? "text-gold/80" : "text-gold-deep/90"}`}
                >
                  {categoryGlyph[c] ?? "◆"}&ensp;{c}
                </p>
                <h2
                  className={`h-section ${isDark ? "text-ivory" : "text-forest"}`}
                >
                  {c}
                </h2>
                <div className="gold-line w-24" />
              </div>

              {/* Service cards grid */}
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {byCategory(c).map((s, si) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className={`group flex h-full flex-col rounded-2xl p-6 md:p-7 transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-gold shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                        isDark
                          ? "glass-card text-ivory border border-white/10 hover:border-gold/50"
                          : "glass-card-light text-ink border border-forest/15 hover:border-gold-deep/40 bg-white/70"
                      }`}
                      style={{ animationDelay: `${si * 60}ms`, contain: "none" }}
                    >
                      {/* Top row: number + arrow */}
                      <div className="mb-4 flex items-start justify-between">
                        <span
                          className={`font-mono text-xs font-semibold tracking-widest ${isDark ? "text-gold/50" : "text-gold-deep/50"}`}
                        >
                          {String(si + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-lg transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110 ${isDark ? "text-gold/40 group-hover:text-gold" : "text-gold-deep/30 group-hover:text-gold-deep"}`}
                          aria-hidden
                        >
                          →
                        </span>
                      </div>

                      {/* Service name */}
                      <h3
                        className={`font-display text-xl leading-snug transition-colors duration-200 md:text-2xl ${
                          isDark
                            ? "text-ivory group-hover:text-gold"
                            : "text-forest group-hover:text-gold-deep"
                        }`}
                      >
                        {s.name}
                      </h3>

                      {/* Gold divider */}
                      <div className="my-3.5 h-px bg-gradient-to-r from-gold/40 to-transparent" />

                      {/* Description */}
                      <p
                        className={`flex-1 text-sm leading-relaxed ${isDark ? "text-ivory/65 group-hover:text-ivory/85" : "text-stone group-hover:text-ink"} transition-colors duration-200`}
                      >
                        {s.short}
                      </p>

                      {/* Assessment-based tag */}
                      <div
                        className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
                          isDark
                            ? "border border-gold/20 bg-gold/10 text-gold/85"
                            : "border border-forest/10 bg-sage/60 text-forest"
                        }`}
                      >
                        <span className="font-sans">Tailored to 1:1 assessment</span>
                      </div>

                      {/* Learn more CTA */}
                      <div
                        className={`mt-5 flex items-center gap-1.5 text-xs font-semibold tracking-wider transition-all duration-300 group-hover:gap-3 ${isDark ? "text-gold/70 group-hover:text-gold" : "text-gold-deep/80 group-hover:text-gold-deep"}`}
                      >
                        <span>Learn more</span>
                        <span
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden
                        >
                          →
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <CtaBand />
    </>
  );
}
