import Link from "next/link";
import { site } from "@/lib/site";

export type LegalPageItem = {
  title: string;
  href: string;
  tag: string;
};

export const legalNavLinks: LegalPageItem[] = [
  { title: "Privacy Policy (DPDP Act)", href: "/privacy-policy", tag: "DPDP 2023" },
  { title: "Terms & Conditions", href: "/terms-and-conditions", tag: "Agreement" },
  { title: "Data Protection & HIPAA Charter", href: "/data-protection-and-hipaa", tag: "HIPAA & PHI" },
  { title: "Telemedicine & Consent Policy", href: "/telemedicine-consent", tag: "NMC 2020" },
  { title: "Cancellation & Refund Policy", href: "/cancellation-and-refund", tag: "Payments" },
];

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  badge: string;
  lastUpdated: string;
  currentPath: string;
  children: React.ReactNode;
}

export function LegalPageLayout({
  title,
  subtitle,
  badge,
  lastUpdated,
  currentPath,
  children,
}: LegalPageLayoutProps) {
  return (
    <div className="bg-sand/30 py-12 md:py-16">
      <div className="wrap">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs text-stone/70">
          <Link href="/" className="hover:text-forest transition-colors">Home</Link>
          <span>/</span>
          <span>Legal &amp; Compliance</span>
          <span>/</span>
          <span className="text-forest font-medium">{title}</span>
        </nav>

        {/* Header */}
        <header className="border-b border-forest/15 pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-forest/10 px-3.5 py-1 text-xs font-semibold tracking-wide text-forest uppercase">
            <span>⚖️</span>
            <span>{badge}</span>
          </div>
          <h1 className="h-display mt-4 text-3xl font-serif text-forest md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-base text-stone md:text-lg leading-relaxed">
            {subtitle}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone/80">
            <span><strong>Effective Date:</strong> {lastUpdated}</span>
            <span>&bull;</span>
            <span><strong>Data Fiduciary:</strong> {site.name}</span>
            <span>&bull;</span>
            <span><strong>Location:</strong> {site.hospital.name}, Faridabad, Delhi NCR</span>
          </div>
        </header>

        {/* Content Grid */}
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_300px]">
          {/* Main Prose */}
          <article className="prose prose-stone max-w-none space-y-8 text-stone leading-relaxed">
            {children}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="sticky top-24 rounded-2xl border border-forest/15 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-semibold text-forest">
                Compliance &amp; Legal Documents
              </h3>
              <p className="mt-1 text-xs text-stone/70">
                Statutory disclosures, patient data charters, and medical consent policies.
              </p>

              <nav className="mt-4 space-y-1.5" aria-label="Related legal documents">
                {legalNavLinks.map((item) => {
                  const isActive = currentPath === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-forest text-ivory shadow-sm font-semibold"
                          : "text-stone hover:bg-forest/5 hover:text-forest"
                      }`}
                    >
                      <span className="truncate pr-2">{item.title}</span>
                      <span
                        className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          isActive
                            ? "bg-gold/20 text-gold"
                            : "bg-forest/10 text-forest"
                        }`}
                      >
                        {item.tag}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-forest/10 pt-4 text-xs text-stone/80 space-y-2">
                <p className="font-semibold text-forest">Grievance &amp; Privacy Officer</p>
                <p>Compliance Desk &bull; {site.hospital.name}</p>
                <p>
                  Email:{" "}
                  <a href={`mailto:${site.email}`} className="text-forest underline font-medium">
                    {site.email}
                  </a>
                </p>
                <p>
                  Phone:{" "}
                  <a href={site.phoneHref} className="text-forest underline font-medium">
                    {site.phone}
                  </a>
                </p>
                <p className="text-[11px] text-stone/60 pt-1">
                  Complaints acknowledged within 48h, resolved within 30 days as per DPDP Act, 2023.
                </p>
              </div>

              <div className="mt-6 border-t border-forest/10 pt-4">
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950">
                  <p className="font-semibold text-amber-900 mb-1">Medical Emergency Notice</p>
                  <p className="text-[11px] leading-relaxed">
                    This website and teleconsultation service are not for emergencies. In case of acute trauma or urgent medical crisis, call 108 / 112 or visit the nearest hospital emergency room.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
