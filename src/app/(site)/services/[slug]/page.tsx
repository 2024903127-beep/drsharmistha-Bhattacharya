import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta, breadcrumbLd, procedureLd } from "@/lib/seo";
import { services, getService, byCategory, slugify, serviceTitle, serviceDescription } from "@/lib/content";
import { locations } from "@/lib/locations";
import { site } from "@/lib/site";
import { getOverride } from "@/lib/repo";
import { Prose } from "@/components/site/Prose";
import { JsonLd } from "@/components/site/JsonLd";
import { SafeImage } from "@/components/site/SafeImage";
import { CtaBand } from "@/components/site/CtaBand";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => services.map((s) => ({ slug: s.slug }));

export async function generateMetadata({ params }: P) {
  const s = getService((await params).slug);
  if (!s) return {};
  const o = await getOverride(`services/${s.slug}`);
  return buildMeta({
    title: o?.title || serviceTitle(s),
    description: o?.description || serviceDescription(s),
    path: `/services/${s.slug}`,
  });
}

export default async function ServicePage({ params }: P) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const path = `/services/${s.slug}`;
  const sections = s.sections.map((x) => ({ ...x, heading: x.heading === "Overview" ? `About ${s.name.toLowerCase()}` : x.heading }));
  const facts = [["Indicative fee", s.fee], ["Hospital stay", s.stay], ["Anaesthesia", s.anesthesia]].filter((f) => f[1]);
  return (
    <>
      <JsonLd data={[procedureLd(s.name, s.short, path), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Procedures", path: "/services" }, { name: s.name, path }])]} />
      <section className="bg-sage">
        <div className="wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="text-sm text-stone"><Link href="/services" className="underline-offset-4 hover:underline">Procedures</Link> / {s.category}</nav>
          <h1 className="h-display mt-4 text-5xl text-forest md:text-6xl">{s.name} in Faridabad</h1>
          <p className="mt-4 max-w-2xl text-lg text-stone">{s.short} Performed by Dr. Sharmistha Bhattacharyya for patients across Faridabad, Gurgaon and Delhi NCR.</p>
        </div>
      </section>
      <div className="wrap grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <article>
          <div className="relative mb-10 aspect-[16/9] overflow-hidden bg-sage empty:hidden"><SafeImage src={`/assets/${s.slug}.png`} alt={`${s.name} result, Dr. Sharmistha Bhattacharyya`} fallback="none" sizes="(min-width:1024px) 720px, 100vw" /></div>
          <nav aria-label="On this page" className="mb-10 border-y border-forest/15 py-4 text-sm">
            <p className="mb-2 font-medium text-forest">On this page</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">{sections.map((x) => <li key={x.heading}><a className="inline-block py-1 text-stone underline-offset-4 hover:underline" href={`#${slugify(x.heading)}`}>{x.heading}</a></li>)}</ul>
          </nav>
          {sections.map((x) => (
            <section key={x.heading} id={slugify(x.heading)} className="mb-10 scroll-mt-28">
              <h2 className="font-display text-3xl text-forest">{x.heading}</h2>
              <div className="mt-4"><Prose>{x.body}</Prose></div>
            </section>
          ))}
          {s.flagship && (
            <section className="mt-14 border-t border-forest/15 pt-8">
              <h2 className="font-display text-2xl text-forest">{s.name} for patients from</h2>
              <ul className="mt-4 flex flex-wrap gap-3">{locations.map((l) => <li key={l.slug}><Link className="btn btn-line !min-h-11" href={`/services/${s.slug}/${l.slug}`}>{s.name} in {l.name}</Link></li>)}</ul>
            </section>
          )}
          <p className="mt-10 border-l-2 border-gold pl-4 text-sm text-stone">{site.disclaimer}</p>
        </article>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-forest/20 bg-white p-6">
            <h2 className="font-display text-2xl text-forest">Plan your {s.name.toLowerCase()}</h2>
            {facts.length > 0 && <dl className="mt-4 space-y-3 text-sm">{facts.map(([k, v]) => <div key={k}><dt className="text-stone">{k}</dt><dd className="font-medium text-ink">{v}</dd></div>)}</dl>}
            <Link href={`/book-consultation?service=${encodeURIComponent(s.name)}`} className="btn btn-forest mt-6 w-full">Book online consultation</Link>
            <a href={site.phoneHref} className="btn btn-line mt-3 w-full">Call {site.phone}</a>
            <p className="mt-4 text-xs text-stone">A written, itemised quotation is given after your consultation.</p>
          </div>
          <div className="mt-6 border border-forest/15 p-6">
            <h2 className="font-display text-xl text-forest">Also in {s.category}</h2>
            <ul className="mt-3 space-y-1 text-sm">{byCategory(s.category).filter((x) => x.slug !== s.slug).map((x) => <li key={x.slug}><Link className="inline-block py-1.5 text-stone hover:text-gold-deep" href={`/services/${x.slug}`}>{x.name}</Link></li>)}</ul>
          </div>
        </aside>
      </div>
      <CtaBand />
    </>
  );
}
