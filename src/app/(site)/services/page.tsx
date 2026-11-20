import Link from "next/link";
import { buildMeta, breadcrumbLd } from "@/lib/seo";
import { categories, byCategory, slugify } from "@/lib/content";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "Plastic Surgery Procedures in Faridabad | Dr. Sharmistha",
  description: "Rhinoplasty, facelift, breast surgery, tummy tuck, liposuction, hair transplant, laser and anti-ageing treatments in Faridabad by an AIIMS-trained plastic surgeon.",
  path: "/services",
});

export default function Services() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Procedures", path: "/services" }])} />
      <section className="wrap pt-14 md:pt-20">
        <h1 className="h-display text-5xl text-forest md:text-6xl">Procedures and treatments</h1>
        <p className="mt-5 max-w-2xl text-lg text-stone">Surgical and non-surgical care across six areas, all planned and performed by Dr. Sharmistha Bhattacharyya.</p>
      </section>
      <div className="wrap py-14 md:py-20">
        {categories.map((c) => (
          <section key={c} id={slugify(c)} className="scroll-mt-28 border-t border-forest/20 py-10">
            <h2 className="h-section">{c}</h2>
            <ul className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
              {byCategory(c).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="group block">
                    <span className="font-display text-2xl text-forest group-hover:text-gold-deep">{s.name}</span>
                    <span className="mt-1 block text-stone">{s.short}</span>
                    {s.fee && <span className="mt-1 block text-sm text-stone/80">Indicative fee: {s.fee}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <CtaBand />
    </>
  );
}
