import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta, breadcrumbLd, faqLd, physicianLd } from "@/lib/seo";
import { locations, getLocation } from "@/lib/locations";
import { flagship, faq } from "@/lib/content";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/site/JsonLd";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => locations.map((l) => ({ slug: l.slug }));

export async function generateMetadata({ params }: P) {
  const l = getLocation((await params).slug);
  if (!l) return {};
  return buildMeta({
    title: `Plastic Surgeon in ${l.name} | Dr. Sharmistha Bhattacharyya`,
    description: `Dr. Sharmistha Bhattacharyya, AIIMS-trained plastic surgeon, for patients from ${l.name}. Consultation options, where surgery is done and procedures offered.`.slice(0, 160),
    path: `/locations/${l.slug}`,
  });
}

export default async function LocationPage({ params }: P) {
  const l = getLocation((await params).slug);
  if (!l) notFound();
  const qa = faq.filter((f) => /where|outstation|consultation/i.test(f.q)).slice(0, 3);
  return (
    <>
      <JsonLd data={[physicianLd, faqLd(qa), breadcrumbLd([{ name: "Home", path: "/" }, { name: "Locations", path: "/locations" }, { name: l.name, path: `/locations/${l.slug}` }])]} />
      <section className="bg-sage">
        <div className="wrap py-12 md:py-16">
          <h1 className="h-display text-5xl text-forest md:text-6xl">Plastic surgeon in {l.name}</h1>
          <p className="mt-5 max-w-2xl text-lg text-stone">{l.intro}</p>
        </div>
      </section>
      <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div className="space-y-6 text-stone">
          <h2 className="font-display text-3xl text-forest">Seeing patients from {l.name}</h2>
          <p>{l.travel}</p><p>{l.consult}</p>
          <p><span className="font-medium text-forest">Areas:</span> {l.areas.join(", ")}.</p>
        </div>
        <div className="border border-forest/20 bg-white p-6">
          <h2 className="font-display text-2xl text-forest">{site.hospital.name}</h2>
          <p className="mt-2 text-stone">{site.hospital.dept}<br />{site.hospital.street}, {site.hospital.city}, {site.hospital.region} {site.hospital.postal}</p>
          {site.hours.map((h) => <p key={h.days} className="mt-3 text-sm text-stone"><span className="font-medium text-ink">{h.days}</span><br />{h.time}</p>)}
          <a href={site.hospital.maps} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-5">Open in Google Maps</a>
        </div>
      </div>
      <section className="wrap pb-14">
        <h2 className="font-display text-3xl text-forest">Popular procedures for patients from {l.name}</h2>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {flagship.map((s) => <li key={s.slug}><Link className="inline-block py-1.5 font-display text-xl text-forest hover:text-gold-deep" href={`/services/${s.slug}/${l.slug}`}>{s.name} in {l.name}</Link></li>)}
        </ul>
      </section>
      <section className="wrap pb-20"><h2 className="mb-6 font-display text-3xl text-forest">Common questions</h2><Faq items={qa} /></section>
      <CtaBand />
    </>
  );
}
