import Link from "next/link";
import Image from "next/image";
import { buildMeta, faqLd, physicianLd, howToLd, breadcrumbLd } from "@/lib/seo";
import { site, pillars, journey, testimonials, reels } from "@/lib/site";
import { categories, byCategory, faq, slugify } from "@/lib/content";
import { SafeImage } from "@/components/site/SafeImage";
import { Tilt } from "@/components/site/Tilt";
import { JsonLd } from "@/components/site/JsonLd";
import { Faq } from "@/components/site/Faq";
import { CtaBand } from "@/components/site/CtaBand";

export const metadata = buildMeta({
  title: "Plastic Surgeon in Faridabad | Dr. Sharmistha Bhattacharyya",
  description:
    "AIIMS-trained plastic surgeon in Faridabad serving Delhi NCR and Gurgaon. Rhinoplasty, facelift, breast, body, hair and skin treatments. Book an online consultation.",
  path: "/",
  keywords: [
    "plastic surgeon Faridabad", "cosmetic surgeon Faridabad", "rhinoplasty Faridabad",
    "facelift Faridabad", "gynecomastia Faridabad", "breast surgery Faridabad",
    "liposuction Faridabad", "AIIMS plastic surgeon Delhi NCR", "Dr Sharmistha Bhattacharyya",
    "online plastic surgery consultation", "aesthetic surgeon Gurgaon",
  ],
});

const CATEGORIES = [
  { name: "Face & Neck Surgeries",      glyph: "✦", accent: "#c8ab78", procs: ["Rhinoplasty", "Facelift", "Blepharoplasty", "Chin Lift", "Lip Surgery"] },
  { name: "Breast Surgeries",           glyph: "◈", accent: "#b99a65", procs: ["Breast Implant", "Breast Lift", "Breast Reduction"] },
  { name: "Body & Chest Contouring",    glyph: "◇", accent: "#d4aa72", procs: ["Gynecomastia", "Liposuction", "Tummy Tuck", "Mommy Makeover"] },
  { name: "Hair Restoration",           glyph: "⬡", accent: "#c0a060", procs: ["Hair Transplant", "PRP", "Hair Mesotherapy", "Hair Booster"] },
  { name: "Skin & Aesthetic Treatments",glyph: "◉", accent: "#b89550", procs: ["Laser Toning", "Thread Lift", "Anti-Wrinkle", "Vampire Facelift"] },
];

const REEL_POSTERS = [
  "/assets/poster_rhinoplasty_guide.jpg",
  "/assets/poster_rhinoplasty_candidate.jpg",
  "/assets/poster_rhinoplasty_function.jpg",
  "/assets/poster_rhinoplasty_mirror.jpg",
  "/assets/poster_gynecomastia_shape.jpg",
  "/assets/poster_gynecomastia_ot.jpg",
  "/assets/poster_gynecomastia_compression.jpg",
  "/assets/poster_gynecomastia_underneath.jpg",
  "/assets/poster_liposuction_myths.jpg",
];

export default function Home() {
  const c = site.claims;
  return (
    <>
      <JsonLd data={[
        physicianLd,
        faqLd(faq),
        breadcrumbLd([{ name: "Home", path: "/" }]),
        howToLd(
          "How to book an online consultation with Dr. Sharmistha Bhattacharyya",
          "Book a secure video consultation with AIIMS-trained plastic surgeon Dr. Sharmistha Bhattacharyya in Faridabad.",
          [
            { name: "Visit the booking page", text: "Go to drsharmisthabhattacharyya.com/book-consultation and select your preferred procedure." },
            { name: "Choose a date and time", text: "Select an available slot from the calendar. Online consultations are available Monday to Saturday." },
            { name: "Enter patient details", text: "Provide your name, contact number, email and brief description of your concerns." },
            { name: "Confirm and pay", text: "Complete the consultation fee payment securely via Razorpay. A confirmation is sent instantly." },
            { name: "Join via Google Meet", text: "At your appointment time, join the Google Meet link sent to your email and WhatsApp to consult with Dr. Sharmistha." },
          ]
        ),
      ]} />

      {/* ══════════════════════════════════════════
          § 1  HERO
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-forest-deep text-ivory">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <SafeImage
            src="/assets/hero-bg-ai.jpg"
            alt=""
            priority
            sizes="100vw"
            className="object-cover object-center opacity-25"
            fallback="none"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/95 via-forest-deep/85 to-forest/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/70 via-transparent to-transparent" />
          {/* Contained glow — clipped by overflow-hidden on section */}
          <div
            className="absolute top-0 right-0 h-96 w-96 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at 100% 0%, #b99a65 0%, transparent 70%)" }}
          />
        </div>

        {/* Top gold rule */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        {/* ── MOBILE layout (< md) ── */}
        <div className="relative md:hidden px-5 pt-10 pb-6">
          <div className="flex flex-col items-center text-center">
            <div className="lux-label mb-5 justify-center text-gold/80">MCh · AIIMS · 10+ Years</div>

            {/* Doctor photo — mobile, contained width */}
            <div className="relative mb-7 w-36 h-48 overflow-hidden rounded-sm shadow-2xl ring-1 ring-gold/20 flex-shrink-0">
              <SafeImage src="/assets/doctor.jpg" alt="Dr. Sharmistha Bhattacharyya" priority sizes="144px" />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/15" />
            </div>

            <h1 className="h-display text-[2rem] leading-[1.08] text-ivory w-full">
              Precision plastic surgery,{" "}
              <span className="gold-text">crafted with restraint.</span>
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-ivory/70 max-w-xs">
              Plastic & aesthetic surgeon in Faridabad — serving Delhi NCR & Gurgaon with AIIMS-trained precision.
            </p>
            <div className="mt-6 flex flex-col w-full gap-3">
              <Link href="/book-consultation" className="btn btn-gold w-full justify-center">
                Book online consultation
              </Link>
              <Link href="/services" className="btn btn-line-light w-full justify-center">
                Explore procedures
              </Link>
            </div>
          </div>
        </div>

        {/* ── TABLET + DESKTOP layout (≥ md) ── */}
        <div className="relative hidden md:grid md:grid-cols-2 lg:grid-cols-[1.15fr_.85fr] md:items-center md:gap-10 lg:gap-14 md:py-24 lg:py-32 wrap">
          <div>
            <div className="lux-label mb-7 text-gold/80">MCh · AIIMS New Delhi · 10+ Years Experience</div>
            <h1 className="h-display text-[3rem] leading-[1.06] lg:text-[4.5rem] xl:text-[5rem] text-ivory">
              Precision plastic surgery,{" "}
              <span className="gold-text">crafted with restraint.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base lg:text-lg leading-relaxed text-ivory/72">
              Dr. Sharmistha Bhattacharyya is a plastic and aesthetic surgeon
              in Faridabad, serving patients across Delhi NCR and Gurgaon.
              Every plan is calibrated to your natural anatomy, with transparent
              costs and results designed to age gracefully.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/book-consultation" className="btn btn-gold">Book online consultation</Link>
              <Link href="/services" className="btn btn-line-light">Explore procedures</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5">
              {["Hospital-grade safety", "One surgeon throughout", "Written clinical plan"].map((t) => (
                <span key={t} className="flex items-center gap-2 text-sm text-ivory/55">
                  <span className="size-1.5 rounded-full bg-gold flex-shrink-0" />{t}
                </span>
              ))}
            </div>
          </div>

          {/* Doctor portrait — desktop */}
          <Tilt className="relative mx-auto w-full max-w-[18rem] lg:max-w-[22rem]">
            <div aria-hidden className="absolute -top-3 -left-3 h-10 w-10 border-t-2 border-l-2 border-gold/50" />
            <div aria-hidden className="absolute -bottom-3 -right-3 h-10 w-10 border-b-2 border-r-2 border-gold/50" />
            <div className="relative aspect-[4/5] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,.55)]">
              <SafeImage
                src="/assets/doctor.jpg"
                alt="Dr. Sharmistha Bhattacharyya, plastic surgeon in Faridabad"
                priority
                sizes="(min-width:1024px) 352px, 288px"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/20" />
            </div>
            <div className="glass-card absolute -bottom-4 -left-4 px-4 py-3">
              <div className="font-display text-sm text-gold leading-none">MCh, AIIMS</div>
              <div className="text-xs text-ivory/50 mt-1">Plastic Surgery · New Delhi</div>
            </div>
          </Tilt>
        </div>

        {/* Stats bar — 2×2 on mobile, 4-col on desktop */}
        <div className="relative w-full px-4 pb-7 md:pb-10 md:wrap">
          <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4">
            {[
              { value: c.rating,       top: "on Google",   sub: `${c.reviews} verified reviews` },
              { value: c.years,        top: "years",       sub: "surgical & clinical practice" },
              { value: "MCh",          top: "AIIMS",       sub: "Plastic Surgery · New Delhi" },
              { value: c.satisfaction, top: "satisfaction", sub: "patient outcomes" },
            ].map(({ value, top, sub }) => (
              <div key={value + top} className="stat-glass rounded-sm px-3 py-4 md:px-5 md:py-5">
                <div className="font-display text-2xl md:text-3xl text-gold leading-none">{value}</div>
                <div className="mt-1 text-xs md:text-sm font-medium text-ivory/90">{top}</div>
                <div className="mt-0.5 text-[10px] md:text-xs text-ivory/40 leading-snug">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 2  PROCEDURES
          Mobile: stacked single-column cards
          Tablet: 2-col grid
          Desktop: 5-col grid
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-forest-deep py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 opacity-[.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #b99a65 1px, transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="relative wrap">
          <div className="lux-label mb-4 text-gold/70">Our Specialisations</div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8 md:mb-12">
            <h2 className="h-section text-ivory max-w-xl">
              Procedures for the face, breast,<br className="hidden sm:block" /> body, hair and skin
            </h2>
            <Link href="/services" className="btn btn-line-light self-start shrink-0 text-sm">
              All procedures →
            </Link>
          </div>

          {/* Category cards — responsive grid (no horizontal scroll, no overflow) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/services#${slugify(cat.name)}`}
                className="glass-card group block p-5 md:p-6"
              >
                {/* Glyph + name */}
                <div
                  className="text-3xl mb-3 transition-transform duration-400 group-hover:scale-110 inline-block"
                  style={{ color: cat.accent }}
                >
                  {cat.glyph}
                </div>
                <h3 className="font-display text-base md:text-lg text-ivory leading-tight mb-4">
                  {cat.name}
                </h3>
                <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, ${cat.accent}60, transparent)` }} />
                {/* Procedure list — 2-col on sm/md for wider cards */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-y-2 gap-x-4 mb-4">
                  {cat.procs.slice(0, 4).map((p) => (
                    <li key={p} className="flex items-center gap-2 text-xs text-ivory/55 group-hover:text-ivory/75 transition-colors">
                      <span className="h-px w-2.5 flex-shrink-0" style={{ background: cat.accent }} />
                      {p}
                    </li>
                  ))}
                </ul>
                <div
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wider transition-all group-hover:gap-3"
                  style={{ color: cat.accent }}
                >
                  <span>Explore</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
                <div className="absolute top-0 inset-x-0 h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${cat.accent}50, transparent)` }} />
              </Link>
            ))}
          </div>

          {/* SEO detailed list */}
          <div className="mt-14 divide-y divide-ivory/8 border-y border-ivory/8">
            {categories.map((cat) => (
              <div key={cat} id={slugify(cat)} className="py-7 md:grid md:grid-cols-[12rem_1fr] md:gap-8">
                <h3 className="font-display text-lg text-gold/80 mb-4 md:mb-0">{cat}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {byCategory(cat).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="group block min-h-10">
                        <span className="font-display text-base md:text-lg text-ivory group-hover:text-gold transition-colors">
                          {s.name}
                        </span>
                        <span className="mt-0.5 block text-xs md:text-sm leading-snug text-ivory/45">
                          {s.short}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 3  ABOUT — Doctor credentials
          Mobile: stacked
          Tablet+: side by side
      ══════════════════════════════════════════ */}
      <section className="bg-ivory py-16 md:py-24 lg:py-28 w-full overflow-hidden">
        <div className="wrap">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-14 lg:gap-20">

            {/* Clinic image — hidden on mobile, shown md+ */}
            <div className="relative hidden md:block">
              <div className="relative h-72 md:h-80 lg:h-96 overflow-hidden rounded-sm shadow-xl bg-sage">
                <SafeImage
                  src="/assets/clinic-room.jpg"
                  alt="Consultation room"
                  sizes="(min-width:1024px) 42vw, 48vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
              </div>
              <div className="glass-card-light absolute -bottom-5 -right-5 px-5 py-4 border border-forest/10 shadow-lg">
                <div className="font-display text-2xl text-forest">10+</div>
                <div className="text-sm text-stone">Years of practice</div>
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="lux-label mb-5" style={{ color: "var(--color-gold-deep)" }}>The surgeon</div>
              <h2 className="h-section text-forest">
                One surgeon for every step of your care
              </h2>
              <div className="gold-line mt-5 mb-6 max-w-[8rem]" />
              <p className="text-stone leading-relaxed text-base md:text-lg">
                Dr. Sharmistha Bhattacharyya is an MCh-qualified plastic and
                reconstructive surgeon, trained at AIIMS New Delhi. She conducts
                every consultation personally, performs every operation herself,
                and reviews every patient at every follow-up.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-3">
                {[
                  { label: "Qualification", value: "MCh, AIIMS" },
                  { label: "Experience",    value: `${c.years} yrs surgical` },
                  { label: "Satisfaction",  value: c.satisfaction },
                  { label: "Reviews",       value: `${c.reviews} on Google` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-sm bg-sage/60 px-3 py-3 md:px-4 md:py-4 border border-forest/8">
                    <div className="text-[10px] md:text-xs text-stone uppercase tracking-wider font-medium">{label}</div>
                    <div className="mt-1 font-display text-lg md:text-xl text-forest">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/about-dr-sharmistha" className="btn btn-forest">About Dr. Sharmistha</Link>
                <Link href="/book-consultation" className="btn btn-line">Book consultation</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 4  WHY US — Glassmorphic pillars
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-forest py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 opacity-[.06]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, #b99a65 0, #b99a65 1px, transparent 0, transparent 50%)", backgroundSize: "28px 28px" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-forest-deep/50 via-transparent to-forest-deep/30" />

        <div className="relative wrap">
          <div className="lux-label mb-4 text-gold/70">Why patients choose us</div>
          <h2 className="h-section text-ivory max-w-2xl mb-10 md:mb-14">
            One surgeon for every consultation, operation and follow-up
          </h2>

          {/* 1-col mobile, 2-col sm+  */}
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <div key={p.t} className="glass-card p-6 md:p-8 group">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-display text-4xl text-gold/15 leading-none select-none">0{i + 1}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
                </div>
                <h3 className="font-display text-xl text-ivory mb-3 group-hover:text-gold transition-colors duration-300">{p.t}</h3>
                <p className="text-sm md:text-base text-ivory/55 leading-relaxed group-hover:text-ivory/70 transition-colors duration-300">{p.d}</p>
              </div>
            ))}
          </div>
          <Link href="/about-dr-sharmistha" className="btn btn-line-light mt-10 inline-flex">Read about Dr. Sharmistha</Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 5  PATIENT JOURNEY — Timeline
          Mobile: single col with compact cards
          Desktop: sticky left + right timeline
      ══════════════════════════════════════════ */}
      <section className="bg-ivory w-full py-16 md:py-24 lg:py-28">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="lux-label mb-4" style={{ color: "var(--color-gold-deep)" }}>How it works</div>
              <h2 className="h-section text-forest">Your path, from first call to final review</h2>
              <div className="gold-line mt-5 mb-5 max-w-[8rem]" />
              <p className="text-stone leading-relaxed text-sm md:text-base">Seven steps, in order, with no pressure to commit at any point.</p>
              <Link href="/book-consultation" className="btn btn-gold mt-7 inline-flex">Begin your journey</Link>
            </div>

            <ol className="relative pl-8 md:pl-10 border-l-2 border-gold/30">
              {journey.map(([t, d], i) => (
                <li key={t} className="relative pb-6 last:pb-0 group">
                  <div className="absolute -left-[2.4rem] md:-left-[2.6rem] flex size-9 md:size-10 items-center justify-center rounded-full bg-ivory border-2 border-gold/40 shadow-sm group-hover:border-gold group-hover:bg-forest-deep transition-all duration-300">
                    <span className="font-display text-sm text-gold">{i + 1}</span>
                  </div>
                  <div className="glass-card-light border border-forest/8 px-4 py-4 md:px-5 md:py-5 ml-2 group-hover:border-gold/30 transition-colors">
                    <h3 className="font-display text-base md:text-xl text-forest">{t}</h3>
                    <p className="mt-1.5 text-xs md:text-base text-stone leading-relaxed">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 6  TESTIMONIALS — Glass cards
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden bg-forest-deep py-16 md:py-24 lg:py-28">
        <div className="absolute inset-0 opacity-[.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #b99a65 1px, transparent 0)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative wrap">
          <div className="lux-label mb-4 text-gold/60">Patient stories</div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
            <h2 className="h-section text-ivory max-w-xl">What patients say</h2>
            <div className="glass-card inline-flex items-center gap-4 px-4 py-3 self-start sm:self-auto flex-shrink-0">
              <div>
                <div className="flex gap-0.5 text-gold text-sm leading-none">★★★★★</div>
                <div className="text-[11px] text-ivory/45 mt-1">{c.reviews} verified · Google</div>
              </div>
              <div className="font-display text-3xl text-gold leading-none">{c.rating}</div>
            </div>
          </div>

          {/* 1-col mobile, 3-col lg */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.n} className="glass-card p-5 md:p-7 flex flex-col">
                <div className="flex gap-0.5 text-gold text-sm mb-4">★★★★★</div>
                <blockquote className="font-display text-base md:text-lg leading-relaxed text-ivory/90 flex-1">
                  &ldquo;{t.q}&rdquo;
                </blockquote>
                <div className="gold-line my-4" />
                <figcaption className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-full border border-gold/30 font-display text-gold text-sm bg-gradient-to-br from-gold/20 to-gold/5">
                    {t.n[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-ivory leading-none">{t.n}</div>
                    <div className="text-xs text-ivory/40 mt-1">{t.p} · {t.l}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 7  HOSPITAL
      ══════════════════════════════════════════ */}
      <section className="bg-sage w-full py-16 md:py-24 lg:py-28">
        <div className="wrap grid gap-8 md:grid-cols-2 md:items-center md:gap-14 lg:gap-20">
          <div>
            <div className="lux-label mb-4" style={{ color: "var(--color-gold-deep)" }}>Where surgery happens</div>
            <h2 className="h-section text-forest">Operated in an accredited hospital</h2>
            <div className="gold-line mt-5 mb-5 max-w-[8rem]" />
            <p className="text-stone leading-relaxed text-sm md:text-base">
              All surgery takes place at {site.hospital.name}, {site.hospital.street},{" "}
              {site.hospital.city}: NABH &amp; NABL accredited with Class-100 HEPA operating
              suites, dedicated ICU and on-site anaesthesiologists.
            </p>
            <a href={site.hospital.maps} target="_blank" rel="noopener noreferrer" className="btn btn-forest mt-7 inline-flex">
              Open in Google Maps
            </a>
          </div>

          <div className="space-y-3">
            {/* Clinic image */}
            <div className="relative h-44 md:h-52 overflow-hidden rounded-sm shadow-md bg-sage/80 mb-4">
              <SafeImage
                src="/assets/clinic-room.jpg"
                alt="Clinic consultation room"
                sizes="(min-width:768px) 44vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/50 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-sm bg-forest/80 px-3 py-1.5 text-xs font-semibold text-ivory backdrop-blur-sm uppercase tracking-wide">
                  NABH &amp; NABL Accredited
                </span>
              </div>
            </div>

            {/* Hours */}
            {site.hours.map((h) => (
              <div key={h.days} className="glass-card-light flex items-center gap-4 border border-forest/10 px-4 py-4">
                <div className="size-2.5 rounded-full flex-shrink-0" style={{ background: h.days.includes("Sunday") ? "#ef4444" : "#22c55e" }} />
                <div>
                  <div className="font-display text-sm md:text-base text-forest">{h.days}</div>
                  <div className="text-xs md:text-sm text-stone">{h.time}</div>
                </div>
              </div>
            ))}
            <p className="text-xs md:text-sm text-stone pt-1">
              Serving{" "}
              <Link className="text-forest underline underline-offset-4 decoration-gold-deep/60 hover:text-gold-deep" href="/locations/faridabad">Faridabad</Link>,{" "}
              <Link className="text-forest underline underline-offset-4 decoration-gold-deep/60 hover:text-gold-deep" href="/locations/gurgaon">Gurgaon</Link>{" "}
              &amp;{" "}
              <Link className="text-forest underline underline-offset-4 decoration-gold-deep/60 hover:text-gold-deep" href="/locations/delhi">Delhi</Link>,
              plus outstation patients by video.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 8  REELS — Instagram posts
          Mobile: 2-col grid (portrait)
          Tablet: 2-col wider
          Desktop: 3-col
      ══════════════════════════════════════════ */}
      <section className="bg-ivory w-full py-16 md:py-24 lg:py-28">
        <div className="wrap">
          <div className="lux-label mb-4" style={{ color: "var(--color-gold-deep)" }}>Educational content</div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 md:mb-14">
            <div>
              <h2 className="h-section text-forest max-w-xl">Hear the surgeon explain it</h2>
              <p className="mt-3 text-stone text-sm md:text-base max-w-lg">Short clinical explainers from Dr. Sharmistha on Instagram.</p>
            </div>
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-line self-start shrink-0">
              Follow on Instagram
            </a>
          </div>

          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
            {reels.map((r, i) => (
              <li key={r.u}>
                <a
                  href={r.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-light group block overflow-hidden border border-forest/8"
                >
                  <div className="relative w-full overflow-hidden bg-sage" style={{ aspectRatio: "4/5" }}>
                    <Image
                      src={REEL_POSTERS[i % REEL_POSTERS.length]}
                      alt={r.t}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-forest-deep/20">
                      <div className="grid size-10 md:size-12 place-items-center rounded-full bg-gold/90 backdrop-blur-sm shadow-lg">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-5 ml-0.5 text-forest-deep">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold text-ivory tracking-widest uppercase bg-forest-deep/70 backdrop-blur-sm">IG</span>
                    </div>
                  </div>
                  <div className="p-3 md:p-4">
                    <div className="font-display text-sm md:text-base text-forest group-hover:text-gold-deep transition-colors line-clamp-2 leading-tight">{r.t}</div>
                    <div className="mt-1 text-xs text-stone line-clamp-2 leading-snug hidden md:block">{r.d}</div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          § 9  FAQ
      ══════════════════════════════════════════ */}
      <section className="bg-sage w-full py-16 md:py-24 lg:py-28">
        <div className="wrap">
          <div className="lux-label mb-4" style={{ color: "var(--color-gold-deep)" }}>Common questions</div>
          <h2 className="h-section mb-8 md:mb-12 max-w-2xl text-forest">Questions patients ask first</h2>
          <Faq items={faq} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
