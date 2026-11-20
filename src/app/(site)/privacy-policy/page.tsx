import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalPageLayout } from "@/components/site/LegalPageLayout";

export const metadata = buildMeta({
  title: "Privacy Policy | DPDP Act 2023 & Medical Data Protection | Dr. Sharmistha Bhattacharyya",
  description: "Comprehensive healthcare privacy policy of Dr. Sharmistha Bhattacharyya in accordance with the Digital Personal Data Protection Act (DPDP Act, 2023) and Indian Medical Council regulations.",
  path: "/privacy-policy",
});

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      subtitle="Our statutory commitment to protecting your personal, clinical, and sensitive health information under the Digital Personal Data Protection Act, 2023 (DPDP Act) and the National Medical Commission Regulations."
      badge="DPDP Act 2023 &amp; Healthcare Data Compliance"
      lastUpdated="November 2026"
      currentPath="/privacy-policy"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">1. Introduction &amp; Data Fiduciary Details</h2>
        <p>
          This Privacy Policy governs the collection, processing, storage, and protection of personal data and Sensitive Personal Data or Information (SPDI) by <strong>Dr. Sharmistha Bhattacharyya</strong> (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;Data Fiduciary&rdquo;), Senior Consultant Plastic, Aesthetic &amp; Reconstructive Surgeon, practicing at the Department of Plastic Surgery, Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana &ndash; 121002.
        </p>
        <p>
          We operate this digital healthcare platform (<a href={site.url} className="text-forest underline font-medium">{site.url}</a>) in strict adherence to:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>The Digital Personal Data Protection Act, 2023 (DPDP Act, Act No. 22 of 2023)</strong>;</li>
          <li><strong>The Information Technology Act, 2000</strong> and the <em>IT (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</em>;</li>
          <li><strong>The National Medical Commission (NMC) Code of Medical Ethics Regulations</strong> and Indian Medical Council (Professional Conduct, Etiquette and Ethics) Regulations;</li>
          <li><strong>The Telemedicine Practice Guidelines (2020)</strong> issued by the Board of Governors in supersession of the Medical Council of India and NITI Aayog.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">2. Categories of Personal &amp; Health Data Collected</h2>
        <p>
          To deliver surgical evaluations, safe aesthetic procedures, teleconsultations, and post-operative surgical follow-ups, we collect only necessary and proportionate categories of data:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-3">
          <h3 className="font-semibold text-forest text-base">A. Identity &amp; Contact Data</h3>
          <p className="text-sm">
            Full name, age, biological sex, date of birth, residential address, personal mobile phone number, WhatsApp contact number, and email address.
          </p>

          <h3 className="font-semibold text-forest text-base pt-2 border-t border-forest/10">B. Clinical &amp; Sensitive Health Information</h3>
          <p className="text-sm">
            Chief aesthetic or functional complaint, past medical and surgical history, systemic illnesses (e.g. hypertension, diabetes, bleeding tendencies), drug allergies, current medications (such as anticoagulants or aspirin), smoking history, pre-anaesthetic fitness records, laboratory blood investigations, and diagnostic imaging (e.g., CT facial bones, mammograms, ultrasound scans).
          </p>

          <h3 className="font-semibold text-forest text-base pt-2 border-t border-forest/10">C. Clinical Photographs &amp; Anatomical Imagery</h3>
          <p className="text-sm">
            Standardized medical baseline and post-operative photographs of surgical zones (e.g., nasal profile, abdominal contour, breast proportions, facial angles). All clinical photography is taken exclusively with your explicit consent and stored within encrypted clinical medical record partitions.
          </p>

          <h3 className="font-semibold text-forest text-base pt-2 border-t border-forest/10">D. Teleconsultation &amp; Prescription Records</h3>
          <p className="text-sm">
            Video consultation logs (date, time, duration), doctor&rsquo;s clinical examination notes, and formal digital prescriptions generated under the Telemedicine Practice Guidelines.
          </p>

          <h3 className="font-semibold text-forest text-base pt-2 border-t border-forest/10">E. Financial &amp; Billing Data</h3>
          <p className="text-sm">
            Consultation fee payments, transaction reference IDs, and payment method summaries. <em>Note: All credit card, debit card, UPI, and banking transactions are processed directly by RBI-licensed payment gateways (Razorpay). We do not store or process your complete credit card numbers, CVVs, or UPI MPINs.</em>
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">3. Lawful Grounds &amp; Purposes of Processing</h2>
        <p>
          In accordance with Section 4 and Section 7 of the DPDP Act, 2023, your personal data is processed exclusively for specified, lawful healthcare purposes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Direct Medical Treatment &amp; Clinical Care:</strong> Providing in-person plastic surgery consultations, virtual teleconsultations, pre-operative planning, and post-operative surgical wound monitoring.</li>
          <li><strong>Statutory Medical Compliance:</strong> Fulfilling mandatory statutory obligations under the NMC Act to maintain accurate electronic patient health records.</li>
          <li><strong>Appointment &amp; Care Coordination:</strong> Transmitting automated appointment confirmations, Google Meet links, reminder notifications, digital invoices, and prescription PDFs via encrypted email and official clinic messaging channels.</li>
          <li><strong>Medical Emergencies:</strong> Responding to acute post-surgical complications or emergencies as permissible under Section 7(c) and 7(d) of the DPDP Act.</li>
        </ul>
        <div className="rounded-xl bg-forest/5 p-4 border border-forest/15 text-sm text-forest">
          <strong>Strict Prohibition on Marketing Exploitation:</strong> We will never sell, rent, commercialize, or transfer your personal health data to pharmaceutical marketing firms, insurance brokers, cosmetic sales desks, or third-party ad networks.
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">4. Clinical Photography &amp; Patient Dignity</h2>
        <p>
          In plastic, aesthetic, and reconstructive surgery, medical photography is a critical clinical tool for pre-operative planning, intra-operative anatomical measurement, and objective assessment of healing. We maintain the highest standards of dignity:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Clinical Record Keeping:</strong> Photographs captured during consultations are stored exclusively in confidential electronic medical records (EMR) accessible solely by Dr. Sharmistha and authorized medical staff.</li>
          <li><strong>No Public Publication Without Explicit Media Release:</strong> No photograph or video of any patient will ever be published on this website, social media, or scientific journals without a separate, voluntary, written, and revocable Model/Media Consent Form.</li>
          <li><strong>De-Identification:</strong> Where authorized educational publication occurs, all non-surgical identifying features (such as tattoos, distinctive jewelry, or unoperated facial features) are carefully cropped or obscured.</li>
          <li><strong>Zero Pressure:</strong> Declining educational photo release has zero impact on the quality, cost, or dedication of your surgical care.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">5. Your Statutory Rights as a Data Principal</h2>
        <p>
          Under Chapter III of the Digital Personal Data Protection Act, 2023, you hold the following non-negotiable statutory rights:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Right to Access Information</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              You may request a summary of the personal and health data held about you, the identities of all data processors, and the clinical categories processed.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Right to Correction &amp; Updating</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              You have the right to correct inaccurate demographic information or update clinical disclosures (such as new allergies or change of address).
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Right to Erasure (Subject to Law)</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              You may request the deletion of non-clinical personal data once the purpose of processing has lapsed, subject to statutory medical record-keeping laws.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-4">
            <h4 className="font-semibold text-forest text-sm">Right to Nominate</h4>
            <p className="mt-1 text-xs text-stone leading-relaxed">
              You may nominate an individual who, in the event of your death or incapacity, shall exercise your rights as a Data Principal under the DPDP Act.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">6. Data Retention &amp; Mandatory Medical Storage</h2>
        <p>
          While the DPDP Act promotes data minimization, healthcare practitioners in India are governed by statutory clinical record retention mandates:
        </p>
        <ul className="list-disc pl-6 space-y-1.5">
          <li><strong>Outpatient &amp; Teleconsultation Records:</strong> Retained for a minimum of <strong>3 (three) years</strong> from the date of the last consultation as mandated by Regulation 1.3 of the Indian Medical Council Regulations.</li>
          <li><strong>Inpatient &amp; Surgical Records:</strong> Preserved by Accord Super Speciality Hospital for the full statutory hospital archive period (minimum 5 to 7 years, or until 3 years after a minor reaches the age of majority).</li>
          <li><strong>Billing &amp; Tax Records:</strong> Preserved for 8 years in compliance with the Income Tax Act, 1961.</li>
        </ul>
        <p className="text-xs text-stone/80">
          Upon the expiration of the statutory retention period, digital records are permanently wiped using cryptographic sanitization protocols.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">7. Technical &amp; Operational Security Safeguards</h2>
        <p>
          We employ state-of-the-art technical and organizational safeguards to protect health data against unauthorized access, breach, or disclosure:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Transport Layer Encryption (TLS 1.3):</strong> All browser sessions, video teleconsultations, and API requests are encrypted end-to-end with high-grade SSL/TLS.</li>
          <li><strong>Database Encryption:</strong> Electronic medical records and patient databases are hosted in ISO 27001 and SOC 2 Type II certified data centers (Supabase / AWS Asia Pacific Mumbai region, India) with AES-256 encryption at rest.</li>
          <li><strong>Role-Based Access Control (RBAC):</strong> Strict role segregation ensures receptionists cannot inspect clinical surgical notes, and administrative staff cannot alter medical charts.</li>
          <li><strong>Immutable Audit Logging:</strong> Every staff view, record query, and document download is recorded with a tamper-evident timestamp and user ID in our system audit log.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">8. Grievance Redressal &amp; Data Protection Contact</h2>
        <p>
          In compliance with Section 13 of the DPDP Act, 2023, you may contact our designated Grievance &amp; Data Protection Officer regarding any inquiry, consent withdrawal, or privacy concern:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2 text-sm">
          <p><strong>Grievance &amp; Compliance Officer:</strong> Clinical Data Privacy Desk</p>
          <p><strong>Practice:</strong> Dr. Sharmistha Bhattacharyya (Plastic &amp; Aesthetic Surgery)</p>
          <p><strong>Hospital:</strong> Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana &ndash; 121002</p>
          <p><strong>Email:</strong> <a href={`mailto:${site.email}`} className="text-forest underline font-semibold">{site.email}</a></p>
          <p><strong>Telephone / WhatsApp:</strong> <a href={site.phoneHref} className="text-forest underline font-semibold">{site.phone}</a></p>
          <p className="text-xs text-stone/70 pt-2 border-t border-forest/10">
            <strong>Response SLA:</strong> Inquiries are formally acknowledged within 48 hours and investigated to resolution within 30 days. If you remain unsatisfied, you hold the statutory right to escalate your grievance to the <strong>Data Protection Board of India (DPBI)</strong>.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
