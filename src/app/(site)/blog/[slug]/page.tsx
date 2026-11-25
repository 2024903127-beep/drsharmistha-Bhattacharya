import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta, breadcrumbLd } from "@/lib/seo";
import { articles, getArticle, relatedService } from "@/lib/content";
import { site } from "@/lib/site";
import { Prose } from "@/components/site/Prose";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

// These 8 articles only exist as outlines in the legacy README (title, meta, excerpt).
// They stay noindex until full ~900+ word, doctor-reviewed text is added. Then set `noindex: false`.
const FULL_TEXT_READY = false;

export async function generateMetadata({ params }: P) {
  const a = getArticle((await params).slug);
  if (!a) return {};
  return buildMeta({ title: a.metaTitle, description: a.metaDescription, path: `/blog/${a.slug}`, noindex: !FULL_TEXT_READY });
}

export default async function Article({ params }: P) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const rel = relatedService(a);
  const path = `/blog/${a.slug}`;
  return (
    <>
      <JsonLd data={[breadcrumbLd([{ name: "Home", path: "/" }, { name: "Patient guides", path: "/blog" }, { name: a.title, path }]), { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.metaDescription, author: { "@id": `${site.url}/#physician` }, mainEntityOfPage: `${site.url}${path}` }]} />
      <article className="wrap max-w-3xl py-14 md:py-20">
        <p className="text-sm text-stone">{a.category}, {a.readTime}</p>
        <h1 className="h-display mt-3 text-4xl text-forest md:text-5xl">{a.title}</h1>
        <p className="mt-6 font-display text-2xl leading-snug text-stone">{a.excerpt}</p>
        {rel && (
          <section className="mt-12 border-t border-forest/15 pt-8">
            <h2 className="font-display text-3xl text-forest">What is {rel.name.toLowerCase()}?</h2>
            <div className="mt-4"><Prose>{rel.sections[0].body.split("\n\n").slice(0, 2).join("\n\n")}</Prose></div>
            <Link href={`/services/${rel.slug}`} className="btn btn-line mt-4">Read the full {rel.name.toLowerCase()} guide</Link>
          </section>
        )}
        <p className="mt-10 border-l-2 border-gold pl-4 text-sm text-stone">{site.disclaimer}</p>
      </article>
      <CtaBand />
    </>
  );
}
