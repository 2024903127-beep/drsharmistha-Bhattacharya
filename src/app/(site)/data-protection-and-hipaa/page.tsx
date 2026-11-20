import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalPageLayout } from "@/components/site/LegalPageLayout";

export const metadata = buildMeta({
  title: "Data Protection & HIPAA Charter | Patient Health Information | Dr. Sharmistha Bhattacharyya",
  description: "Our healthcare data protection charter aligning Indian DPDP Act 2023 compliance with international HIPAA-grade security standards for Protected Health Information (PHI).",
  path: "/data-protection-and-hipaa",
});

export default function DataProtectionAndHipaa() {
  return (
    <LegalPageLayout
      title="Data Protection &amp; HIPAA Charter"
      subtitle="Gold-standard clinical confidentiality, digital security, and Protected Health Information (PHI) safeguards for domestic and international patients."
      badge="HIPAA Principles &amp; DPDP Medical Confidentiality"
      lastUpdated="November 2026"
      currentPath="/data-protection-and-hipaa"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">1. Dual Healthcare Privacy Standard</h2>
        <p>
          At the clinical practice of <strong>Dr. Sharmistha Bhattacharyya</strong> (Department of Plastic &amp; Aesthetic Surgery, Accord Super Speciality Hospital, Faridabad), we recognize that aesthetic, plastic, and reconstructive surgery touches the most intimate aspects of a patient&rsquo;s physical form, identity, and personal dignity.
        </p>
        <p>
          Whether you are a domestic patient from Delhi NCR or an international patient traveling from the United States, United Kingdom, Europe, Australia, or the Gulf, your health data is managed under a dual-tier gold standard:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-forest text-xs font-bold text-ivory">1</span>
              <h3 className="font-serif text-lg font-semibold text-forest">India DPDP Act (2023)</h3>
            </div>
            <p className="text-xs text-stone leading-relaxed">
              Statutory compliance with India&rsquo;s Digital Personal Data Protection Act, 2023, IT (SPDI) Rules 2011, and the National Medical Commission (NMC) Code of Medical Ethics Regulations.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-forest">2</span>
              <h3 className="font-serif text-lg font-semibold text-forest">HIPAA-Aligned Security</h3>
            </div>
            <p className="text-xs text-stone leading-relaxed">
              Voluntary adherence to the privacy, security, and administrative breach notification principles embodied in the US Health Insurance Portability and Accountability Act (HIPAA) Privacy &amp; Security Rules.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">2. What Constitutes Protected Health Information (PHI)?</h2>
        <p>
          Protected Health Information (PHI) encompasses any information created, received, or stored during the course of medical care that identifies you or could reasonably be used to identify you:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li><strong>Patient Identifiers:</strong> Name, address, phone number, email address, national identity numbers, and unique Patient UHIDs.</li>
          <li><strong>Clinical Records:</strong> Surgical consultation summaries, pre-operative clinical workups, operative notes, anaesthetic charting, and histology/biopsy reports.</li>
          <li><strong>Clinical Photographs &amp; Video Footage:</strong> Pre-operative baseline photos, intra-operative anatomical measurement imagery, and serial post-operative wound healing photography.</li>
          <li><strong>Prescription &amp; Medication Logs:</strong> Specific dosages of post-surgical antibiotics, anti-inflammatories, scar creams, and medical implants (e.g. breast implant serial numbers, VASER liposuction parameters).</li>
          <li><strong>Financial &amp; Billing Records:</strong> Consultation payment receipts, surgical package breakdowns, and insurance claim paperwork.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">3. Doctor-Patient Privilege &amp; Absolute Confidentiality</h2>
        <p>
          Under Regulation 2.2 of the Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations and common law doctor-patient privilege:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-3">
          <p className="text-sm">
            <strong>Absolute Professional Secrecy:</strong> Dr. Sharmistha Bhattacharyya and every member of our clinic team are ethically and legally bound to keep every patient consultation completely confidential. We will never disclose that you have consulted us, undergone an aesthetic procedure, or visited our clinic to any friend, family member, employer, or third party without your express written authorization.
          </p>
          <p className="text-sm border-t border-forest/10 pt-2">
            <strong>Exceptions Recognized by Law:</strong> Disclosure of health records occurs strictly and solely when: (a) explicitly mandated by a formal court order or warrant from a competent judicial authority; (b) in cases of infectious statutory notifiable diseases; or (c) where a serious, imminent threat to human life exists.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">4. The &ldquo;Minimum Necessary&rdquo; Rule</h2>
        <p>
          In alignment with HIPAA Privacy Rule 45 CFR &sect; 164.502(b), our staff portal and clinic workflows enforce the <strong>Minimum Necessary Standard</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Role-Based Staff Access (RBAC):</strong> Receptionists and clinic coordinators can access only your appointment scheduling, billing status, and basic contact information. They have zero access to intimate clinical operative notes or surgical examination photos.</li>
          <li><strong>Doctor-Exclusive Clinical Vault:</strong> Full clinical operative notes, high-resolution pre/post surgical photo galleries, and private diagnostic reports are accessible exclusively by treating doctors with authenticated biometric or MFA credentials.</li>
          <li><strong>No Shared Administrative Accounts:</strong> Every staff member signs in under an individually audited login ID. Shared or generic logins are strictly forbidden.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">5. Photographic Privacy &amp; Media Protection</h2>
        <div className="rounded-xl border border-forest/20 bg-forest/5 p-5 space-y-3">
          <h3 className="font-serif text-lg font-semibold text-forest">Zero-Pressure Photographic Consent</h3>
          <p className="text-sm">
            Plastic surgery results can be transformative, but your personal privacy always takes precedence over marketing.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone">
            <li><strong>Medical Record Storage:</strong> Photographs taken in the consultation room are part of your confidential medical record and are never displayed publicly without separate consent.</li>
            <li><strong>Separate Model Release:</strong> If Dr. Sharmistha requests to use anonymized before-and-after photographs for scientific teaching, medical journal publication, or patient education, you will be presented with a separate, written Media Release Form.</li>
            <li><strong>Complete Right to Refuse:</strong> You may decline photographic publication at any time without any reason, without hesitation, and with absolutely no effect on your surgical care.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">6. Technical &amp; Infrastructure Safeguards</h2>
        <p>
          We apply defense-in-depth technical safeguards aligned with the HIPAA Security Rule (45 CFR Part 160 &amp; Part 164, Subparts A and C):
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Encryption in Transit</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              Transport Layer Security (TLS 1.3) with 256-bit certificates and HTTP Strict Transport Security (HSTS) enforced across all portal endpoints.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Encryption at Rest</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              PostgreSQL database storage, patient documents, and backup snapshots encrypted with FIPS 140-2 validated AES-256 cryptographic keys.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Tamper-Evident Audit Trails</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              Every staff read, write, update, or document export triggers an automated log entry in our immutable audit database with user ID and timestamp.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Automatic Session Timeouts</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              Staff workstations and portal sessions automatically lock after periods of inactivity to prevent unauthorized opportunistic access.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">7. Your Rights Under Our Health Data Charter</h2>
        <p>
          You hold comprehensive rights regarding your protected health information:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li><strong>Right to Inspect &amp; Obtain Copies:</strong> You have the right to inspect and obtain electronic or paper copies of your medical records, operative summaries, and prescriptions within 72 hours of request.</li>
          <li><strong>Right to Request Corrections:</strong> If you believe a clinical note contains an error in factual history (e.g. prior surgeries or medication lists), you may request a formal clinical amendment.</li>
          <li><strong>Right to an Accounting of Disclosures:</strong> You may request a list of all instances where your health information was disclosed to third parties (such as pathology laboratories or hospital insurance billing desks).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">8. Inquiries &amp; Privacy Officer</h2>
        <p>
          For questions regarding our HIPAA-aligned data protections, or to exercise your rights under this Charter, please reach our compliance team directly at:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 text-sm space-y-1.5">
          <p><strong>Health Data Privacy Officer:</strong> Clinical Confidentiality Desk</p>
          <p><strong>Practice:</strong> Dr. Sharmistha Bhattacharyya (MCh Plastic Surgery, AIIMS New Delhi)</p>
          <p><strong>Hospital:</strong> Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana &ndash; 121002</p>
          <p><strong>Confidential Email:</strong> <a href={`mailto:${site.email}`} className="text-forest underline font-semibold">{site.email}</a></p>
          <p><strong>Phone:</strong> <a href={site.phoneHref} className="text-forest underline font-semibold">{site.phone}</a></p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
