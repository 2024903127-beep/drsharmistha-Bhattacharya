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
    title: `${l.headline} | Dr. Sharmistha`.slice(0, 60),
    description: `Dr. Sharmistha Bhattacharyya (MCh AIIMS), plastic & aesthetic surgeon for ${l.name}. 1:1 private consultations, accredited surgical care & personalised procedures.`.slice(0, 160),
    path: `/locations/${l.slug}`,
    keywords: [
      `plastic surgeon ${l.name}`,
      `cosmetic surgeon ${l.shortName}`,
      ...l.areas.map((a) => `cosmetic surgery ${a}`),
      "AIIMS plastic surgeon Delhi NCR",
    ],
  });
}

export default async function LocationPage({ params }: P) {
  const l = getLocation((await params).slug);
  if (!l) notFound();
  const qa = faq.filter((f) => /where|outstation|consultation|pricing/i.test(f.q)).slice(0, 4);
  return (
    <>
      <JsonLd
        data={[
          physicianLd,
          faqLd(qa),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Locations", path: "/locations" },
            { name: l.name, path: `/locations/${l.slug}` },
          ]),
        ]}
      />
      <section className="relative overflow-hidden bg-forest-deep text-ivory">
        <div className="gold-line w-full" />
        <div className="wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs md:text-sm text-ivory/50">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/locations" className="hover:text-gold transition-colors">Delhi NCR Locations</Link>
            <span aria-hidden>/</span>
            <span className="text-gold/80">{l.name}</span>
          </nav>
          <p className="lux-label text-gold/80">{l.portfolioTag}</p>
          <h1 className="h-display mt-3 text-4xl text-ivory md:text-6xl">{l.headline}</h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-ivory/75 leading-relaxed">{l.intro}</p>
        </div>
        <div className="gold-line w-full" />
      </section>

      <div className="wrap grid gap-12 py-14 md:py-20 lg:grid-cols-2">
        <div className="space-y-6 text-stone leading-relaxed">
          <h2 className="font-display text-3xl text-forest">
            How do consultations &amp; surgery work for patients from {l.shortName}?
          </h2>
          <p>{l.portfolioNote}</p>
          <p>{l.travel}</p>
          <p>{l.consult}</p>
          <p className="rounded-sm bg-sage/60 p-4 border border-forest/10 text-sm">
            <span className="font-semibold text-forest">Neighbourhoods we regularly serve:</span>{" "}
            {l.areas.join(", ")}.
          </p>
        </div>
        <div className="border border-forest/20 bg-white p-6 md:p-7 h-fit">
          <p className="lux-label text-gold-deep mb-2">Accredited Surgical Centre</p>
          <h2 className="font-display text-2xl text-forest">{site.hospital.name}</h2>
          <p className="mt-2 text-stone text-sm leading-relaxed">
            {site.hospital.dept}
            <br />
            {site.hospital.street}, {site.hospital.city}, {site.hospital.region} {site.hospital.postal}
          </p>
          {site.hours.map((h) => (
            <p key={h.days} className="mt-3 text-sm text-stone">
              <span className="font-medium text-ink">{h.days}</span>
              <br />
              {h.time}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/book-consultation" className="btn btn-gold text-sm">
              Book 1:1 online consultation
            </Link>
            <a href={site.hospital.maps} target="_blank" rel="noopener noreferrer" className="btn btn-line text-sm">
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>

      <section className="wrap pb-14">
        <h2 className="font-display text-3xl text-forest">
          Popular procedures for patients from {l.name}
        </h2>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {flagship.map((s) => (
            <li key={s.slug}>
              <Link
                className="inline-block py-1.5 font-display text-xl text-forest hover:text-gold-deep transition-colors"
                href={`/services/${s.slug}/${l.slug}`}
              >
                {s.name} in {l.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap pb-20">
        <h2 className="mb-6 font-display text-3xl text-forest">Questions patients from {l.shortName} often ask</h2>
        <Faq items={qa} />
      </section>
      <CtaBand />
    </>
  );
}
