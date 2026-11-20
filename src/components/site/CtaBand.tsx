import Link from "next/link";
import { site } from "@/lib/site";
import { SafeImage } from "@/components/site/SafeImage";

export function CtaBand({ title = "Begin with a consultation, not a quotation." }: { title?: string }) {
  return (
    <section className="relative w-full overflow-hidden bg-forest-deep text-ivory">
      {/* Background */}
      <div className="absolute inset-0">
        <SafeImage
          src="/assets/hero-bg-ai.jpg"
          alt=""
          sizes="100vw"
          className="object-cover object-center opacity-15"
          fallback="none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/95 to-forest-deep/80" />
      </div>
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="relative wrap py-14 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="lux-label mb-5 text-gold/70">Take the first step</div>
            <h2 className="h-section text-ivory">{title}</h2>
            <p className="mt-4 text-ivory/60 leading-relaxed text-sm md:text-base">
              Online consultations available Monday to Saturday. Dr. Sharmistha
              meets you directly and gives you a written plan with no pressure to decide.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row shrink-0">
            <Link href="/book-consultation" className="btn btn-gold w-full sm:w-auto justify-center">
              Book online consultation
            </Link>
            <a href={site.phoneHref} className="btn btn-line-light w-full sm:w-auto justify-center">
              Call {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
