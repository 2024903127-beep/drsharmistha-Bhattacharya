import Link from "next/link";
import { buildMeta, breadcrumbLd } from "@/lib/seo";
import { articles } from "@/lib/content";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "Patient Guides Across Delhi NCR | Dr. Sharmistha",
  description:
    "Clinical guides by AIIMS-trained surgeon Dr. Sharmistha Bhattacharyya covering rhinoplasty, mommy makeover, tummy tuck, breast surgery, blepharoplasty & facial contouring for Gurgaon, South Delhi & Faridabad.",
  path: "/blog",
});

export default function Blog() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Patient guides", path: "/blog" },
        ])}
      />
      <section className="relative overflow-hidden bg-forest-deep text-ivory">
        <div className="gold-line w-full" />
        <div className="wrap py-14 md:py-20">
          <p className="lux-label text-gold/80">Doctor-Authored Clinical Reading</p>
          <h1 className="h-display mt-3 text-4xl text-ivory md:text-6xl">
            Patient guides across Delhi NCR
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-ivory/75 leading-relaxed">
            Calm, transparent answers written personally by Dr.&nbsp;Sharmistha Bhattacharyya (MCh, AIIMS New Delhi) for patients visiting from Gurgaon (Golf Course Road), South Delhi, and Faridabad.
          </p>
        </div>
        <div className="gold-line w-full" />
      </section>

      <section className="wrap py-14 md:py-20">
        <ul className="grid gap-8 md:grid-cols-2">
          {articles.map((a, idx) => (
            <li
              key={a.slug}
              className="glass-card-light flex flex-col justify-between border border-forest/15 bg-white/80 p-6 md:p-7 rounded-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-gold-deep font-semibold uppercase tracking-wider">
                  <span>0{idx + 1} · {a.category}</span>
                  <span className="text-stone/70">{a.readTime}</span>
                </div>
                <Link
                  href={`/blog/${a.slug}`}
                  className="mt-3 block font-display text-2xl leading-snug text-forest hover:text-gold-deep transition-colors"
                >
                  {a.title}
                </Link>
                <p className="mt-3 text-sm md:text-base text-stone leading-relaxed">{a.excerpt}</p>
              </div>
              <Link
                href={`/blog/${a.slug}`}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-forest hover:text-gold-deep transition-colors"
              >
                Read complete clinical guide →
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
