import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta, breadcrumbLd, faqLd } from "@/lib/seo";
import { flagship, getService } from "@/lib/content";
import { locations, getLocation } from "@/lib/locations";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/site/JsonLd";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";

// Only flagship procedures x real service locations are generated. Do NOT widen this to every
// service x every area: near-duplicate pages are treated as doorway pages by Google.
type P = { params: Promise<{ slug: string; location: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => flagship.flatMap((s) => locations.map((l) => ({ slug: s.slug, location: l.slug })));

export async function generateMetadata({ params }: P) {
  const { slug, location } = await params;
  const s = getService(slug), l = getLocation(location);
  if (!s || !l) return {};
  return buildMeta({
    title: `${s.name} in ${l.name} | Dr. Sharmistha`,
    description: `${s.name} for patients from ${l.name}: how consultation works, where surgery is performed, recovery and indicative cost with AIIMS-trained surgeon Dr. Sharmistha.`.slice(0, 160),
    path: `/services/${s.slug}/${l.slug}`,
  });
}

export default async function ServiceInLocation({ params }: P) {
  const { slug, location } = await params;
  const s = getService(slug), l = getLocation(location);
  if (!s || !l || !s.flagship) notFound();
  const path = `/services/${s.slug}/${l.slug}`;
  const intro = s.sections[0].body.split("\n\n")[0];
  const items = [
    { q: `Where is ${s.name.toLowerCase()} performed for patients from ${l.name}?`, a: `Surgery is performed by Dr. Sharmistha at ${site.hospital.name}, ${site.hospital.street}, ${site.hospital.city}, an accredited multi-speciality hospital. ${l.travel}` },
    { q: `Can my first consultation about ${s.name.toLowerCase()} be online?`, a: `Yes. ${l.consult} An in-person examination is still needed before surgery is planned.` },
    { q: `What does ${s.name.toLowerCase()} cost?`, a: s.fee ? `Indicative fee: ${s.fee}. A written, itemised quotation is given after your consultation. Final cost depends on your anatomy, the technique and hospital stay.` : "The cost depends on your anatomy, the technique and hospital stay. A written, itemised quotation is given after your consultation." },
  ];
  return (
    <>
      <JsonLd data={[faqLd(items), breadcrumbLd([{ name: "Home", path: "/" }, { name: s.name, path: `/services/${s.slug}` }, { name: l.name, path }])]} />
      <section className="bg-sage">
        <div className="wrap py-12 md:py-16">
          <h1 className="h-display text-5xl text-forest md:text-6xl">{s.name} in {l.name}</h1>
          <p className="mt-5 max-w-2xl text-lg text-stone">{l.intro}</p>
        </div>
      </section>
      <div className="wrap grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="max-w-[68ch] space-y-10 text-stone">
          <section>
            <h2 className="font-display text-3xl text-forest">How it works for patients from {l.name}</h2>
            <p className="mt-3 leading-relaxed">{l.travel}</p>
            <p className="mt-3 leading-relaxed">{l.consult}</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-forest">Areas we see patients from</h2>
            <p className="mt-3">{l.areas.join(", ")}.</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-forest">About {s.name.toLowerCase()}</h2>
            <p className="mt-3 leading-relaxed">{intro}</p>
            <Link href={`/services/${s.slug}`} className="btn btn-line mt-4">Read the full {s.name.toLowerCase()} guide</Link>
          </section>
          <section><h2 className="mb-5 font-display text-3xl text-forest">Common questions</h2><Faq items={items} /></section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-forest/20 bg-white p-6">
            <h2 className="font-display text-2xl text-forest">At a glance</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[["Surgeon", "Dr. Sharmistha Bhattacharyya, MCh (AIIMS)"], ["Surgery at", `${site.hospital.name}, ${site.hospital.city}`], ["Hospital stay", s.stay], ["Anaesthesia", s.anesthesia], ["Indicative fee", s.fee]].filter((r) => r[1]).map(([k, v]) => <div key={k}><dt className="text-stone">{k}</dt><dd className="font-medium text-ink">{v}</dd></div>)}
            </dl>
            <Link href={`/book-consultation?service=${encodeURIComponent(s.name)}`} className="btn btn-forest mt-6 w-full">Book online consultation</Link>
          </div>
          <p className="mt-4 text-xs text-stone">{site.disclaimer}</p>
        </aside>
      </div>
      <CtaBand />
    </>
  );
}
