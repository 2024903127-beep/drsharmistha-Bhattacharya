import { buildMeta, breadcrumbLd, physicianLd } from "@/lib/seo";
import { site, pillars } from "@/lib/site";
import { SafeImage } from "@/components/site/SafeImage";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "About Dr. Sharmistha Bhattacharyya | Plastic Surgeon, AIIMS",
  description: "MCh Plastic Surgery from AIIMS New Delhi, ISAPS fellowship trained. Qualifications, memberships and the single-surgeon approach of Dr. Sharmistha Bhattacharyya.",
  path: "/about-dr-sharmistha",
});

const degrees = [
  ["MCh, Plastic and Reconstructive Surgery", "All India Institute of Medical Sciences (AIIMS), New Delhi", "2019"],
  ["MS, General Surgery", "VMMC and Safdarjung Hospital, New Delhi", "2016"],
  ["MBBS", "Kasturba Medical College (KMC), Manipal", "2013"],
];
const fellowships = [
  "ISAPS International Aesthetic Fellowship, Cosmed Clinic, Istanbul: advanced preservation rhinoplasty, structural tip grafting and facial rejuvenation",
  "Microvascular surgery training, Ganga Hospital, Coimbatore; International Society of Reconstructive Microsurgery (ISRM 2018)",
  "Oral and maxillofacial surgery masterclass, AIIMS New Delhi",
  "Aesthetic and functional rhinoplasty, International Rhinoplasty Congress",
  "ATLS (Advanced Trauma Life Support) certified, American College of Surgeons and AIIMS New Delhi",
  "Surgical safety and critical care protocols, AIIMS New Delhi",
];

export default function About() {
  return (
    <>
      <JsonLd data={[physicianLd, breadcrumbLd([{ name: "Home", path: "/" }, { name: "About", path: "/about-dr-sharmistha" }])]} />
      <section className="wrap grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[.8fr_1.2fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-sage"><SafeImage src="/assets/doctor.jpg" alt="Dr. Sharmistha Bhattacharyya" priority sizes="(min-width:1024px) 384px, 90vw" /></div>
        <div>
          <h1 className="h-display text-5xl text-forest md:text-6xl">Dr. Sharmistha Bhattacharyya</h1>
          <p className="mt-5 text-lg text-stone">Plastic, cosmetic and reconstructive surgeon, Faridabad. More than {site.claims.years} years of surgical and clinical practice, trained at AIIMS New Delhi.</p>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-stone">With an artistic approach, Dr. Sharmistha predicts how your anatomy will evolve — crafting results that hold beautifully not just today, but years to come. Each consultation is a detailed, private 1:1 session, and every surgical blueprint is a tailor-made solution calibrated to your natural anatomy, your ethnicity, and your individual goals.</p>
          <p className="mt-4 max-w-[62ch] leading-relaxed text-stone">She provides a safe, non-judgmental space for open conversation about your desires and preferences — empowering clients with body positivity and the confidence to take ownership of their body and life. Her practice includes South Asian facial anatomy, safety protocols for melanin-rich skin, complex breast reconstruction and limb salvage surgery.</p>
        </div>
      </section>

      <section className="bg-sage">
        <div className="wrap py-16 md:py-20">
          <h2 className="h-section">Qualifications</h2>
          <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[34rem] text-left">
            <thead><tr className="border-b border-forest/30 text-sm text-stone"><th className="py-3 pr-4 font-medium">Degree</th><th className="py-3 pr-4 font-medium">Institution</th><th className="py-3 font-medium">Year</th></tr></thead>
            <tbody>{degrees.map(([a, b, y]) => <tr key={a} className="border-b border-forest/15"><td className="py-4 pr-4 font-display text-lg text-forest">{a}</td><td className="py-4 pr-4">{b}</td><td className="py-4">{y}</td></tr>)}</tbody>
          </table></div>
        </div>
      </section>

      <section className="wrap grid gap-12 py-16 md:py-20 lg:grid-cols-2">
        <div>
          <h2 className="h-section">Fellowships and training</h2>
          <ul className="mt-6 space-y-3 text-stone">{fellowships.map((f) => <li key={f} className="border-l-2 border-gold pl-4">{f}</li>)}</ul>
        </div>
        <div>
          <h2 className="h-section">Professional memberships</h2>
          <ul className="mt-6 space-y-3 text-stone">
            <li className="border-l-2 border-gold pl-4">IAAPS, Indian Association of Aesthetic Plastic Surgeons</li>
            <li className="border-l-2 border-gold pl-4">APSI, Association of Plastic Surgeons of India</li>
            <li className="border-l-2 border-gold pl-4">ISAPS, International Society of Aesthetic Plastic Surgery</li>
          </ul>
          <h2 className="h-section mt-12">The consultation standard</h2>
          <p className="mt-4 text-stone">Up to 60 dedicated minutes with anatomical examination, tissue assessment and standardised multi-angle photography. You leave with a written plan covering technique, scars, downtime, revision likelihood and a transparent, itemised cost discussed individually based on your assessment. No hidden fees, no obligation to book on the day.</p>
        </div>
      </section>

      <section className="bg-forest text-ivory">
        <div className="wrap grid gap-x-14 gap-y-10 py-16 md:grid-cols-2 md:py-20">
          {pillars.map((p) => <div key={p.t} className="border-t border-gold/60 pt-5"><h3 className="font-display text-2xl">{p.t}</h3><p className="mt-2 text-ivory/75">{p.d}</p></div>)}
        </div>
      </section>

      {/* Real Operating Theatre Gallery */}
      <section className="bg-forest-deep text-ivory py-16 md:py-24">
        <div className="wrap">
          <div className="lux-label mb-4 text-gold/70">Clinical Excellence</div>
          <h2 className="h-section text-ivory max-w-xl mb-4">In the Operating Theatre</h2>
          <p className="text-ivory/60 max-w-2xl text-base mb-10">
            Every procedure is planned with microsurgical precision and performed personally by Dr. Sharmistha in NABH-accredited, Class-100 HEPA surgical suites.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-gold/20 shadow-xl group">
              <SafeImage
                src="/assets/img_9320.webp"
                alt="Operating theatre under surgical lighting"
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs text-gold uppercase tracking-wider font-semibold">Surgical Safety</div>
                <div className="font-display text-base text-ivory mt-0.5">Class-100 HEPA Surgical Suite</div>
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-gold/20 shadow-xl group">
              <SafeImage
                src="/assets/img_9318.webp"
                alt="Dr. Sharmistha Bhattacharyya in surgery"
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs text-gold uppercase tracking-wider font-semibold">Anaesthesia Monitoring</div>
                <div className="font-display text-base text-ivory mt-0.5">Continuous Hemodynamic Care</div>
              </div>
            </div>

            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-gold/20 shadow-xl group">
              <SafeImage
                src="/assets/img_9577.webp"
                alt="Surgical loupe precision operating"
                sizes="(min-width:768px) 33vw, 100vw"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-xs text-gold uppercase tracking-wider font-semibold">Aesthetic Precision</div>
                <div className="font-display text-base text-ivory mt-0.5">Loupe-Assisted Tissue Handling</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
