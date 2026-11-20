import Link from "next/link";
import { site } from "@/lib/site";
import { categories } from "@/lib/content";
import { locations } from "@/lib/locations";

export function Footer() {
  return (
    <footer className="bg-forest-deep pb-24 text-ivory/80 md:pb-0">
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-2xl text-ivory">{site.name}</p>
          <p className="mt-2 text-sm">{site.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed">
            {site.hospital.name}<br />
            {site.hospital.dept}<br />
            {site.hospital.street}, {site.hospital.city}, {site.hospital.region} {site.hospital.postal}
          </p>
        </div>

        <div>
          <p className="font-medium text-ivory">Procedures</p>
          <ul className="mt-3 space-y-1 text-sm">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  className="inline-block py-1 hover:text-gold transition-colors"
                  href={`/services#${c.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium text-ivory">Locations</p>
          <ul className="mt-3 space-y-1 text-sm">
            {locations.map((l) => (
              <li key={l.slug}>
                <Link
                  className="inline-block py-1 hover:text-gold transition-colors"
                  href={`/locations/${l.slug}`}
                >
                  Plastic surgeon in {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-medium text-ivory">Contact &amp; Hours</p>
          <ul className="mt-3 space-y-1">
            <li>
              <a className="inline-block py-1 hover:text-gold transition-colors" href={site.phoneHref}>
                {site.phone}
              </a>
            </li>
            <li>
              <a className="inline-block py-1 hover:text-gold transition-colors" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a
                className="inline-block py-1 hover:text-gold transition-colors"
                href={site.instagram}
                rel="noopener noreferrer"
                target="_blank"
              >
                Instagram
              </a>
            </li>
          </ul>
          {site.hours.map((h) => (
            <p key={h.days} className="mt-3 text-xs leading-relaxed">
              <strong className="text-ivory">{h.days}</strong>
              <br />
              <span className="text-ivory/60">{h.time}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Compliance & Legal Bar */}
      <div className="border-t border-ivory/10 bg-black/10">
        <div className="wrap py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-ivory/70">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="font-semibold text-ivory/90 uppercase tracking-wider text-[10px]">
              Compliance &amp; Legal:
            </span>
            <Link href="/privacy-policy" className="hover:text-gold transition-colors">
              Privacy Policy (DPDP Act)
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-gold transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/data-protection-and-hipaa" className="hover:text-gold transition-colors">
              HIPAA &amp; Data Protection Charter
            </Link>
            <Link href="/telemedicine-consent" className="hover:text-gold transition-colors">
              Telemedicine Consent
            </Link>
            <Link href="/cancellation-and-refund" className="hover:text-gold transition-colors">
              Cancellation &amp; Refunds
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/staff-login" className="text-[11px] text-ivory/40 hover:text-gold transition-colors">
              Staff Portal &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Medical Disclaimer & Copyright */}
      <div className="border-t border-ivory/10">
        <p className="wrap py-6 text-xs leading-relaxed text-ivory/60">
          {site.disclaimer} &copy; {new Date().getFullYear()} {site.name}. All rights reserved. Registered Medical Practitioner (MCh Plastic Surgery, AIIMS New Delhi).
        </p>
      </div>
    </footer>
  );
}
