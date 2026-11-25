import Link from "next/link";
import { buildMeta, breadcrumbLd, physicianLd } from "@/lib/seo";
import { site, pillars } from "@/lib/site";
import { SafeImage } from "@/components/site/SafeImage";
import { JsonLd } from "@/components/site/JsonLd";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "About Dr. Sharmistha Bhattacharyya | Plastic Surgeon Delhi NCR",
  description:
    "MCh Plastic Surgery from AIIMS New Delhi, ISAPS fellowship trained. Read Dr. Sharmistha Bhattacharyya's personal approach to natural, ethnicity-preserving surgery across Delhi NCR.",
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
      <JsonLd
        data={[
          physicianLd,
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "About Me", path: "/about-dr-sharmistha" },
          ]),
        ]}
      />

      {/* ── Personal Story Hero (First Person) ── */}
      <section className="wrap grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[.8fr_1.2fr]">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden bg-sage shadow-xl">
          <SafeImage
            src="/assets/doctor.jpg"
            alt="Dr. Sharmistha Bhattacharyya, MCh AIIMS plastic surgeon across Delhi NCR"
            priority
            sizes="(min-width:1024px) 384px, 90vw"
            className="object-cover object-top"
          />
        </div>
        <div>
          <p className="lux-label mb-3 text-gold-deep">MCh (AIIMS New Delhi) · Over {site.claims.years} Years of Practice</p>
          <h1 className="h-display text-4xl text-forest md:text-6xl">
            Why I practice plastic surgery the way I do
          </h1>
          <p className="mt-5 text-lg text-forest/90 leading-relaxed font-medium">
            I am Dr. Sharmistha Bhattacharyya — a plastic, aesthetic, and reconstructive surgeon trained at AIIMS New Delhi, serving patients across Delhi NCR (Gurgaon, South Delhi, and Faridabad).
          </p>
          <p className="mt-4 max-w-[64ch] leading-relaxed text-stone">
            Most people who step into my consultation room carry two quiet worries: whether surgery will look artificial, and whether anyone will truly listen without rushing them toward an invoice.
          </p>
          <p className="mt-4 max-w-[64ch] leading-relaxed text-stone">
            That is why I keep my practice strictly one-surgeon from start to finish. I personally take every 1:1 consultation, draw every surgical marking, perform every operation inside an NABH-accredited tertiary hospital, and sit beside you at every follow-up visit across the year ahead.
          </p>
          <p className="mt-4 max-w-[64ch] leading-relaxed text-stone">
            My artistic philosophy is simple: preserve your ethnicity, respect how your facial skeleton and tissues will evolve over the decades to come, and build results that hold gracefully — not just for today&rsquo;s photograph, but 10 or 15 years from now. More than anything, I aim to offer a safe, non-judgmental space where you feel heard, respected, and empowered in your own skin.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/book-consultation" className="btn btn-gold">
              Book a 1:1 consultation with me
            </Link>
            <Link href="/services" className="btn btn-line">
              Explore procedures
            </Link>
          </div>
        </div>
      </section>

      {/* ── Qualifications ── */}
      <section className="bg-sage">
        <div className="wrap py-16 md:py-20">
          <h2 className="h-section">My training &amp; qualifications</h2>
          <p className="mt-3 max-w-2xl text-stone">
            Reconstructive microsurgery at AIIMS taught me respect for blood supply and tissue planes; my international ISAPS fellowship refined subtle aesthetic restraint.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left">
              <thead>
                <tr className="border-b border-forest/30 text-sm text-stone">
                  <th className="py-3 pr-4 font-medium">Degree</th>
                  <th className="py-3 pr-4 font-medium">Institution</th>
                  <th className="py-3 font-medium">Year</th>
                </tr>
              </thead>
              <tbody>
                {degrees.map(([a, b, y]) => (
                  <tr key={a} className="border-b border-forest/15">
                    <td className="py-4 pr-4 font-display text-lg text-forest">{a}</td>
                    <td className="py-4 pr-4">{b}</td>
                    <td className="py-4">{y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Fellowships & Consultation Standard ── */}
      <section className="wrap grid gap-12 py-16 md:py-20 lg:grid-cols-2">
        <div>
          <h2 className="h-section">Fellowships &amp; specialised training</h2>
          <ul className="mt-6 space-y-3 text-stone">
            {fellowships.map((f) => (
              <li key={f} className="border-l-2 border-gold pl-4">{f}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="h-section">Professional memberships</h2>
          <ul className="mt-6 space-y-3 text-stone">
            <li className="border-l-2 border-gold pl-4">IAAPS, Indian Association of Aesthetic Plastic Surgeons</li>
            <li className="border-l-2 border-gold pl-4">APSI, Association of Plastic Surgeons of India</li>
            <li className="border-l-2 border-gold pl-4">ISAPS, International Society of Aesthetic Plastic Surgery</li>
          </ul>
          <h2 className="h-section mt-12">What happens when you meet me</h2>
          <p className="mt-4 text-stone leading-relaxed">
            Whether we begin with an online consultation of up to 45 minutes or meet for up to 60 dedicated minutes in person, we look carefully at your anatomy, tissue quality, skin biology, diet habits, lifestyle routine, and predictable post-surgery needs at home. You leave with a written, tailor-made plan covering technique, expected scars, downtime, and an itemised, transparent cost — with zero obligation to decide on the day.
          </p>
        </div>
      </section>

      {/* ── Practice Philosophy ── */}
      <section className="bg-forest text-ivory">
        <div className="wrap py-16 md:py-20">
          <p className="lux-label mb-3 text-gold/75">My Commitment to You</p>
          <h2 className="h-section text-ivory mb-10 max-w-xl">
            How my team and I look after every patient
          </h2>
          <div className="grid gap-x-14 gap-y-10 md:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.t} className="border-t border-gold/60 pt-5">
                <h3 className="font-display text-2xl">{p.t}</h3>
                <p className="mt-2 text-ivory/75 leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Operating Theatre Gallery ── */}
      <section className="bg-forest-deep text-ivory py-16 md:py-24">
        <div className="wrap">
          <div className="lux-label mb-4 text-gold/70">Clinical Excellence</div>
          <h2 className="h-section text-ivory max-w-xl mb-4">Inside the Operating Theatre</h2>
          <p className="text-ivory/65 max-w-2xl text-base mb-10">
            I perform every surgical procedure personally inside NABH-accredited, Class-100 HEPA surgical suites with dedicated board-certified anaesthesiologists and on-site ICU cover.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm border border-gold/20 shadow-xl group">
              <SafeImage
                src="/assets/img_9320.webp"
                alt="Dr. Sharmistha operating in Class-100 HEPA NABH surgical suite"
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
                alt="Dr. Sharmistha Bhattacharyya performing surgery with anaesthesia team"
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
                alt="Microsurgical loupe precision operating"
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
