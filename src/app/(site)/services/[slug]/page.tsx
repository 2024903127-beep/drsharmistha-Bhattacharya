import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMeta, breadcrumbLd, faqLd, procedureLd } from "@/lib/seo";
import { services, getService, byCategory, relatedArticles, slugify, serviceTitle, serviceDescription } from "@/lib/content";
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

function stripMarkdown(md: string) {
  return md
    .replace(/[#*_`>]/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 600);
}

export default async function ServicePage({ params }: P) {
  const s = getService((await params).slug);
  if (!s) notFound();
  const path = `/services/${s.slug}`;

  const sections = s.sections;
  const questionFaqs = sections
    .filter((x) => x.heading.trim().endsWith("?"))
    .map((x) => ({ q: x.heading, a: stripMarkdown(x.body) }));

  const facts = [
    ["Surgeon", "Dr. Sharmistha Bhattacharyya (MCh, AIIMS)"],
    ["Hospital stay", s.stay],
    ["Anaesthesia", s.anesthesia],
    ["Surgical plan & investment", "Tailored to 1:1 individual assessment"],
  ].filter((f) => f[1]);

  const jsonLd: object[] = [
    procedureLd(s.name, s.short, path),
    breadcrumbLd([
      { name: "Home", path: "/" },
      { name: "Procedures", path: "/services" },
      { name: s.name, path },
    ]),
  ];
  if (questionFaqs.length > 0) {
    jsonLd.push(faqLd(questionFaqs));
  }

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── Service Hero ── */}
      <section className="relative overflow-hidden bg-forest-deep text-ivory">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 85% 50%, rgba(185,154,101,.07) 0%, transparent 65%)",
          }}
        />
        <div className="gold-line w-full" />
        <div className="relative wrap py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 text-sm text-ivory/50">
            <Link href="/" className="transition-colors hover:text-gold">Home</Link>
            <span aria-hidden>/</span>
            <Link href="/services" className="transition-colors hover:text-gold">Procedures</Link>
            <span aria-hidden>/</span>
            <span className="text-gold/80">{s.category}</span>
          </nav>
          <p className="lux-label text-gold/70">{s.category} · Across Delhi NCR</p>
          <h1 className="h-display mt-4 text-4xl text-ivory md:text-6xl">{s.name} across Delhi NCR</h1>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-ivory/75 leading-relaxed">
            {s.short} Personalised 1:1 consultations and NABH-accredited surgical care by Dr.&nbsp;Sharmistha Bhattacharyya for patients across Gurgaon (Golf Course Road), South Delhi, Faridabad and wider Delhi NCR.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ivory/10 pt-4 text-xs text-ivory/65">
            <span className="font-semibold text-gold">Medically Authored &amp; Reviewed:</span>
            <span>Dr. Sharmistha Bhattacharyya · MBBS, MS (Surgery), MCh Plastic Surgery (AIIMS New Delhi) · IAAPS · APSI · ISAPS</span>
          </div>
        </div>
        <div className="gold-line w-full" />
      </section>

      <div className="wrap grid gap-12 py-12 lg:grid-cols-[1fr_20rem] lg:py-16 min-w-0">
        <article className="min-w-0">
          <div className="relative mb-10 aspect-[16/9] overflow-hidden bg-sage empty:hidden">
            <SafeImage
              src={`/assets/${s.slug}.png`}
              alt={`${s.name} overview, Dr. Sharmistha Bhattacharyya`}
              fallback="none"
              sizes="(min-width:1024px) 720px, 100vw"
            />
          </div>

          <nav aria-label="Questions answered in this guide" className="mb-10 border-y border-forest/15 py-4 text-sm">
            <p className="mb-2 font-medium text-forest">Questions patients ask most</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
              {sections.map((x) => (
                <li key={x.heading}>
                  <a
                    className="inline-block py-1 text-stone underline-offset-4 hover:text-forest hover:underline"
                    href={`#${slugify(x.heading)}`}
                  >
                    {x.heading}
                  </a>
                </li>
              ))}
              {(s.reviews?.length || s.interaction) && (
                <li>
                  <a
                    className="inline-block py-1 text-forest font-medium underline-offset-4 hover:underline"
                    href="#patient-stories"
                  >
                    Patient reviews &amp; consultation story
                  </a>
                </li>
              )}
            </ul>
          </nav>

          {sections.map((x) => (
            <section key={x.heading} id={slugify(x.heading)} className="mb-10 scroll-mt-28">
              <h2 className="font-display text-2xl md:text-3xl text-forest leading-snug">{x.heading}</h2>
              <div className="mt-4">
                <Prose>{x.body}</Prose>
              </div>
              {x.ctaAfter && (
                <div className="mt-6 rounded-sm border border-gold/45 bg-forest-deep p-5 md:p-6 text-ivory shadow-sm">
                  {x.ctaAfter.eyebrow && (
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-gold mb-1.5">
                      {x.ctaAfter.eyebrow}
                    </p>
                  )}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-lg">
                      <h3 className="font-display text-xl md:text-2xl text-ivory leading-snug">
                        {x.ctaAfter.title}
                      </h3>
                      {x.ctaAfter.subtitle && (
                        <p className="mt-1.5 text-sm text-ivory/75 leading-relaxed">
                          {x.ctaAfter.subtitle}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/book-consultation?service=${encodeURIComponent(s.name)}`}
                      className="btn btn-gold shrink-0 justify-center text-sm font-semibold"
                    >
                      {x.ctaAfter.buttonText || "Book a 1:1 consultation"}
                    </Link>
                  </div>
                </div>
              )}
            </section>
          ))}

          {/* ── Reviews + Personal Patient Interaction right after Recovery & Results ── */}
          {(s.reviews?.length || s.interaction) && (
            <section id="patient-stories" className="mt-12 scroll-mt-28 space-y-6 border-t border-forest/15 pt-10">
              {s.reviews && s.reviews.length > 0 && (
                <div>
                  <p className="lux-label text-gold-deep mb-2">Verified Patient Voices</p>
                  <h2 className="font-display text-2xl md:text-3xl text-forest">
                    What patients say after {s.name.toLowerCase()}
                  </h2>
                  <div className="mt-5 grid gap-4">
                    {s.reviews.map((r) => (
                      <figure
                        key={r.author + r.location}
                        className="rounded-sm border border-forest/12 bg-sage/45 p-5 md:p-6"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex gap-0.5 text-gold-deep text-sm" aria-label="5 out of 5 stars">
                            ★★★★★
                          </div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-forest/70">
                            {r.verified ? "Verified Google Review" : "Patient Feedback"}
                          </span>
                        </div>
                        <blockquote className="font-display text-lg text-forest leading-relaxed">
                          &ldquo;{r.quote}&rdquo;
                        </blockquote>
                        <figcaption className="mt-3 text-xs font-medium text-stone">
                          — {r.author} · {r.location}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              )}

              {s.interaction && (
                <div className="rounded-sm border border-gold-deep/35 bg-white p-6 md:p-7 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-block rounded-full bg-forest/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-forest">
                      {s.interaction.badge}
                    </span>
                    <span className="text-xs text-stone">{s.interaction.patientProfile}</span>
                  </div>
                  <h3 className="font-display text-2xl text-forest">
                    Inside the consultation room: a real {s.name.toLowerCase()} conversation
                  </h3>
                  <dl className="mt-4 space-y-4 text-sm md:text-base leading-relaxed text-stone">
                    <div>
                      <dt className="font-semibold text-forest">How she / he walked in</dt>
                      <dd className="mt-1">{s.interaction.initialConcern}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-forest">What we mapped together in 1:1 discussion</dt>
                      <dd className="mt-1">{s.interaction.consultationDiscussion}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-forest">Healing, home-care &amp; outcome</dt>
                      <dd className="mt-1">{s.interaction.outcomeAndAftercare}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 pt-4 border-t border-forest/10 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-stone">
                      Every consultation is strictly confidential and tailored to your anatomy.
                    </span>
                    <Link
                      href={`/book-consultation?service=${encodeURIComponent(s.name)}`}
                      className="text-sm font-semibold text-gold-deep hover:text-forest transition-colors underline underline-offset-4"
                    >
                      Book your private 1:1 consultation →
                    </Link>
                  </div>
                </div>
              )}
            </section>
          )}

          {relatedArticles(s).length > 0 && (
            <section className="mt-14 border-t border-forest/15 pt-8">
              <p className="lux-label text-gold-deep mb-2">Further Reading</p>
              <h2 className="font-display text-2xl text-forest">Detailed patient stories &amp; regional guides</h2>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {relatedArticles(s).map((art) => (
                  <li key={art.slug}>
                    <Link
                      href={`/blog/${art.slug}`}
                      className="block rounded-sm border border-forest/15 bg-white/80 p-4 hover:border-gold-deep/40 transition-colors"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-deep">
                        {art.tag} · {art.readTime}
                      </span>
                      <span className="mt-1 block font-display text-lg leading-snug text-forest">
                        {art.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {s.flagship && (
            <section className="mt-14 border-t border-forest/15 pt-8">
              <h2 className="font-display text-2xl text-forest">{s.name} for patients from across Delhi NCR</h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {locations.map((l) => (
                  <li key={l.slug} className="max-w-full">
                    <Link
                      className="btn btn-line !min-h-10 !px-4 !py-2 text-xs md:text-sm text-center max-w-full whitespace-normal"
                      href={`/services/${s.slug}/${l.slug}`}
                    >
                      {s.name} in {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-10 border-l-2 border-gold pl-4 py-1 text-sm text-stone leading-relaxed bg-forest/[0.03] rounded-r p-3">
            <p>{site.disclaimer}</p>
          </div>
        </article>

        <aside className="lg:sticky lg:top-28 lg:self-start space-y-5 w-full min-w-0">
          {/* Booking card */}
          <div className="glass-card-light rounded-sm border border-forest/15 p-5 md:p-6 overflow-visible w-full" style={{ contain: "none" }}>
            <p className="lux-label mb-2 text-gold-deep/80">Personalised Planning</p>
            <h2 className="font-display text-2xl text-forest">Plan your {s.name.toLowerCase()}</h2>
            <div className="my-4 h-px bg-gradient-to-r from-gold/40 to-transparent" />
            {facts.length > 0 && (
              <dl className="mb-5 space-y-3.5 text-sm">
                {facts.map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-stone/70">{k}</dt>
                    <dd className="font-medium text-ink break-normal leading-snug">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <Link
              href={`/book-consultation?service=${encodeURIComponent(s.name)}`}
              className="btn btn-gold w-full !min-h-12 text-sm font-semibold justify-center text-center"
            >
              Get personalised plan &amp; cost
            </Link>
            <a href={site.phoneHref} className="btn btn-line mt-3 w-full !min-h-12 text-sm font-semibold justify-center">
              Call {site.phone}
            </a>
            <p className="mt-4 text-xs text-stone/80 leading-relaxed">
              Confused about what you need? Book a 1:1 consultation — you receive an honest clinical assessment and an itemised quotation with zero pressure.
            </p>
          </div>

          {/* Related in category */}
          {byCategory(s.category).filter((x) => x.slug !== s.slug).length > 0 && (
            <div className="glass-card-light rounded-sm border border-forest/10 p-6 overflow-visible" style={{ contain: "none" }}>
              <p className="lux-label mb-3 text-gold-deep/70">Same specialty</p>
              <h2 className="font-display text-lg text-forest">Also in {s.category}</h2>
              <div className="my-3 h-px bg-gradient-to-r from-gold/30 to-transparent" />
              <ul className="space-y-1 text-sm">
                {byCategory(s.category)
                  .filter((x) => x.slug !== s.slug)
                  .map((x) => (
                    <li key={x.slug}>
                      <Link
                        className="group inline-flex w-full items-center gap-2 py-1.5 text-stone transition-colors hover:text-gold-deep"
                        href={`/services/${x.slug}`}
                      >
                        <span className="text-gold/40 transition-transform group-hover:translate-x-0.5" aria-hidden>
                          →
                        </span>
                        {x.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
      <CtaBand />
    </>
  );
}
