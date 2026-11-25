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
export const generateStaticParams = () =>
  flagship.flatMap((s) => locations.map((l) => ({ slug: s.slug, location: l.slug })));

export async function generateMetadata({ params }: P) {
  const { slug, location } = await params;
  const s = getService(slug), l = getLocation(location);
  if (!s || !l) return {};
  return buildMeta({
    title: `${s.name} in ${l.name} | Dr. Sharmistha`.slice(0, 60),
    description: `${s.name} for patients from ${l.name}: 1:1 private consultation, personalised surgical planning, recovery and safety standards with AIIMS-trained Dr. Sharmistha.`.slice(0, 160),
    path: `/services/${s.slug}/${l.slug}`,
    keywords: [
      `${s.name.toLowerCase()} in ${l.shortName}`,
      `${s.name.toLowerCase()} ${l.areas[0]}`,
      `${s.name.toLowerCase()} Delhi NCR`,
    ],
  });
}

export default async function ServiceInLocation({ params }: P) {
  const { slug, location } = await params;
  const s = getService(slug), l = getLocation(location);
  if (!s || !l || !s.flagship) notFound();
  const path = `/services/${s.slug}/${l.slug}`;
  const intro = s.sections[0].body.split("\n\n")[0];
  const items = [
    {
      q: `Where is ${s.name.toLowerCase()} performed for patients from ${l.name}?`,
      a: `All surgical procedures are performed personally by Dr. Sharmistha at ${site.hospital.name} (${site.hospital.street}, ${site.hospital.city}), an NABH-accredited hospital with Class-100 HEPA operating suites and on-site ICU support. ${l.travel}`,
    },
    {
      q: `Can my first consultation about ${s.name.toLowerCase()} be online?`,
      a: `Yes. ${l.consult} Your initial 1:1 session of up to 45 minutes covers your anatomical goals and timeline before any in-person hospital visit is scheduled.`,
    },
    {
      q: `How is the cost of ${s.name.toLowerCase()} determined for patients from ${l.shortName}?`,
      a: "Surgical planning and costs are never one-size-fits-all—they depend on an individual anatomical assessment, the surgical technique chosen for natural, lasting results, anaesthesia, and hospital stay. After your consultation, you receive a clear, written, itemised quotation with zero hidden fees.",
    },
  ];
  return (
    <>
      <JsonLd
        data={[
          faqLd(items),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: s.name, path: `/services/${s.slug}` },
            { name: l.name, path },
          ]),
        ]}
      />
      <section className="relative overflow-hidden bg-forest-deep text-ivory">
        <div className="gold-line w-full" />
        <div className="wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs md:text-sm text-ivory/50">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link href={`/services/${s.slug}`} className="hover:text-gold transition-colors">{s.name}</Link>
            <span aria-hidden>/</span>
            <span className="text-gold/80">{l.name}</span>
          </nav>
          <p className="lux-label text-gold/80">{l.portfolioTag}</p>
          <h1 className="h-display mt-3 text-4xl text-ivory md:text-6xl">
            {s.name} for patients in {l.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-ivory/75 leading-relaxed">{l.intro}</p>
        </div>
        <div className="gold-line w-full" />
      </section>

      <div className="wrap grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16">
        <div className="max-w-[68ch] space-y-10 text-stone">
          <section>
            <h2 className="font-display text-3xl text-forest">
              How do consultations &amp; surgery work for {l.shortName} patients?
            </h2>
            <p className="mt-3 leading-relaxed">{l.portfolioNote}</p>
            <p className="mt-3 leading-relaxed">{l.travel}</p>
            <p className="mt-3 leading-relaxed">{l.consult}</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-forest">Which {l.shortName} neighbourhoods do patients visit from?</h2>
            <p className="mt-3">{l.areas.join(", ")}.</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-forest">What is {s.name.toLowerCase()}?</h2>
            <p className="mt-3 leading-relaxed">{intro}</p>
            <Link href={`/services/${s.slug}`} className="btn btn-line mt-4">
              Read the complete {s.name.toLowerCase()} Q&amp;A guide
            </Link>
          </section>
          <section>
            <h2 className="mb-5 font-display text-3xl text-forest">Common questions from {l.shortName} patients</h2>
            <Faq items={items} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-forest/20 bg-white p-6">
            <h2 className="font-display text-2xl text-forest">Personalised Planning</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Surgeon", "Dr. Sharmistha Bhattacharyya, MCh (AIIMS)"],
                ["Surgical centre", `${site.hospital.name}, Delhi NCR`],
                ["Hospital stay", s.stay],
                ["Anaesthesia", s.anesthesia],
                ["Investment", "Tailored to individual assessment"],
              ]
                .filter((r) => r[1])
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-stone">{k}</dt>
                    <dd className="font-medium text-ink">{v}</dd>
                  </div>
                ))}
            </dl>
            <Link
              href={`/book-consultation?service=${encodeURIComponent(s.name)}`}
              className="btn btn-gold mt-6 w-full justify-center"
            >
              Book 1:1 online consultation
            </Link>
            <p className="mt-3 text-xs text-stone/80 leading-relaxed">
              Confused about what you need? Start with a private consultation to receive a tailored plan &amp; transparent quotation.
            </p>
          </div>
          <p className="mt-4 text-xs text-stone">{site.disclaimer}</p>
        </aside>
      </div>
      <CtaBand />
    </>
  );
}
