import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta, breadcrumbLd, articleLd } from "@/lib/seo";
import { articles, getArticle, relatedService } from "@/lib/content";
import { locations } from "@/lib/locations";
import { site } from "@/lib/site";
import { Prose } from "@/components/site/Prose";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

const FULL_TEXT_READY = true;

export async function generateMetadata({ params }: P) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return buildMeta({
    title: a.metaTitle,
    description: a.metaDescription,
    path: `/blog/${a.slug}`,
    type: "article",
    keywords: a.keywords,
    noindex: !FULL_TEXT_READY,
  });
}

export default async function ArticlePage({ params }: P) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const rel = relatedService(a);
  const path = `/blog/${a.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Patient guides", path: "/blog" },
            { name: a.title, path },
          ]),
          articleLd({
            title: a.title,
            description: a.metaDescription,
            slug: a.slug,
          }),
        ]}
      />

      <section className="relative overflow-hidden bg-forest-deep text-ivory">
        <div className="gold-line w-full" />
        <div className="wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-xs md:text-sm text-ivory/55">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/blog" className="hover:text-gold transition-colors">Patient guides</Link>
            <span aria-hidden>/</span>
            <span className="text-gold/80">{a.category}</span>
          </nav>
          <p className="lux-label text-gold/80">{a.tag} · {a.readTime}</p>
          <h1 className="h-display mt-3 max-w-4xl text-3xl text-ivory md:text-5xl leading-tight">
            {a.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-ivory/75 leading-relaxed speakable">
            {a.excerpt}
          </p>
        </div>
        <div className="gold-line w-full" />
      </section>

      <article className="wrap max-w-3xl py-12 md:py-16">
        {/* E-E-A-T Medical Reviewer Attribution Bar */}
        <div className="mb-10 rounded-sm border border-forest/15 bg-sage/55 p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 text-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
              Medically Authored &amp; Clinically Reviewed
            </p>
            <p className="mt-1 font-display text-lg text-forest">
              Dr. Sharmistha Bhattacharyya · MBBS, MS (Surgery), MCh Plastic Surgery (AIIMS New Delhi)
            </p>
            <p className="text-xs text-stone mt-0.5">
              IAAPS · APSI · ISAPS Aesthetic Fellow · Surgical Care at Accord Super Speciality Hospital (NABH Accredited)
            </p>
          </div>
          <Link href="/about-dr-sharmistha" className="btn btn-line !min-h-9 !px-3.5 text-xs shrink-0">
            Surgeon profile →
          </Link>
        </div>

        {/* Full Clinical Editorial Article Body */}
        {a.body ? (
          <Prose>{a.body}</Prose>
        ) : (
          rel && (
            <Prose>{rel.sections[0].body}</Prose>
          )
        )}

        {/* Related Procedure Guide CTA Box */}
        {rel && (
          <section className="mt-12 rounded-sm border border-gold/40 bg-forest-deep p-6 md:p-7 text-ivory">
            <p className="lux-label text-gold mb-2">Detailed Procedure Q&amp;A</p>
            <h2 className="font-display text-2xl md:text-3xl text-ivory">
              Explore {rel.name} Q&amp;A across Delhi NCR
            </h2>
            <p className="mt-2.5 text-sm md:text-base text-ivory/75 leading-relaxed">
              {rel.short} Review techniques, medical vs. aesthetic indications, recovery milestones, and safety comparisons.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`/services/${rel.slug}`} className="btn btn-gold text-sm">
                Read {rel.name} Q&amp;A guide
              </Link>
              <Link
                href={`/book-consultation?service=${encodeURIComponent(rel.name)}`}
                className="btn btn-line-light text-sm"
              >
                Book 1:1 consultation
              </Link>
            </div>
          </section>
        )}

        {/* Delhi NCR Locations Mesh */}
        <section className="mt-10 border-t border-forest/15 pt-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone/75 mb-3">
            Consultations Across Delhi NCR
          </p>
          <div className="flex flex-wrap gap-2.5">
            {locations.map((l) => (
              <Link
                key={l.slug}
                href={`/locations/${l.slug}`}
                className="btn btn-line !min-h-9 !px-3.5 text-xs"
              >
                {l.name}
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-10 border-l-2 border-gold pl-4 py-1 text-sm text-stone leading-relaxed bg-forest/[0.03] rounded-r p-3">
          {site.disclaimer}
        </p>
      </article>
      <CtaBand />
    </>
  );
}
