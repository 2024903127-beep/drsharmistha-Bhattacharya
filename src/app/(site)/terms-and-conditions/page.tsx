import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalPageLayout } from "@/components/site/LegalPageLayout";

export const metadata = buildMeta({
  title: "Terms and Conditions | Medical Consultation Agreement | Dr. Sharmistha Bhattacharyya",
  description: "Official terms and conditions governing in-person and online plastic surgery consultations, patient responsibilities, medical disclaimers, and clinic policies.",
  path: "/terms-and-conditions",
});

export default function TermsAndConditions() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      subtitle="The clinical and legal terms governing the use of this website, online consultation bookings, and patient agreements with Dr. Sharmistha Bhattacharyya."
      badge="Medical Consultation &amp; Service Agreement"
      lastUpdated="November 2026"
      currentPath="/terms-and-conditions"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">1. Acceptance of Terms</h2>
        <p>
          These Terms and Conditions (&ldquo;Agreement&rdquo;) constitute a legally binding agreement between you (&ldquo;Patient&rdquo;, &ldquo;User&rdquo;, or &ldquo;you&rdquo;) and <strong>Dr. Sharmistha Bhattacharyya</strong> (&ldquo;Surgeon&rdquo;, &ldquo;Clinic&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;), MCh Plastic &amp; Reconstructive Surgery (AIIMS New Delhi), practicing at Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana &ndash; 121002.
        </p>
        <p>
          By accessing this website, submitting an enquiry, or booking an online or in-person consultation, you represent that you are at least 18 years of age (or represented by a legal parent or guardian) and possess the legal capacity to enter into this Agreement.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">2. Medical Disclaimer &amp; Absence of Patient Relationship</h2>
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-5 text-sm text-amber-950 space-y-2">
          <p className="font-bold text-amber-900 text-base">IMPORTANT MEDICAL NOTICE</p>
          <p>
            The information, articles, anatomical guides, photographs, and videos available on this website are provided strictly for general public educational and informational purposes.
          </p>
          <p>
            Browsing this site, submitting an enquiry form, reading blog posts, or exchanging administrative WhatsApp messages with our coordination desk <strong>does NOT create a doctor-patient relationship</strong>. A formal doctor-patient relationship is established exclusively when you participate in a formal paid clinical consultation (in-person or video teleconsultation) conducted directly by Dr. Sharmistha Bhattacharyya.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">3. Scope of Consultations (In-Clinic &amp; Online)</h2>
        <p>
          We offer two primary modalities of clinical consultation:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2">
            <h3 className="font-serif text-lg font-semibold text-forest">In-Clinic Consultations</h3>
            <p className="text-xs text-stone leading-relaxed">
              Conducted at the Department of Plastic Surgery, Accord Super Speciality Hospital, Faridabad. Allows for complete physical examination, palpation of tissue, precise anatomical caliper measurements, and detailed review of imaging with Dr. Sharmistha.
            </p>
          </div>
          <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2">
            <h3 className="font-serif text-lg font-semibold text-forest">Online Video Consultations</h3>
            <p className="text-xs text-stone leading-relaxed">
              Conducted securely via Google Meet in compliance with the National Medical Commission Telemedicine Practice Guidelines (2020). Designed for initial candidacy evaluation, procedure discussions, second opinions, and post-operative follow-up for outstation patients.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">4. Mandatory Pre-Surgical In-Person Examination</h2>
        <p className="font-medium text-forest">
          Under no circumstances will any surgical procedure be scheduled or performed based solely on an online video consultation.
        </p>
        <p>
          Plastic, aesthetic, and reconstructive surgery requires thorough three-dimensional physical touch, skin elasticity grading, cartilage thickness evaluation, structural palpation, and surgical markings. A face-to-face physical evaluation at the hospital, alongside mandatory pre-anaesthetic fitness checks (blood panels, ECG, chest X-ray), is obligatory prior to confirming any surgical date.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">5. Biological Variation &amp; No Guarantee of Outcomes</h2>
        <p>
          In full accordance with medical ethics and established surgical science:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Individual Biology:</strong> Surgical healing, scar maturation, tissue contraction, and final contouring depend heavily on each individual&rsquo;s biological makeup, skin thickness, microcirculation, immune response, and age.</li>
          <li><strong>No Absolute Guarantees:</strong> While Dr. Sharmistha Bhattacharyya brings extensive surgical training and precision to every procedure, <strong>no specific cosmetic result, absolute symmetry, or exact dimension can be guaranteed</strong>. Medicine and surgery are not exact mechanical trades.</li>
          <li><strong>Revisional Surgery:</strong> In a small percentage of cases across all plastic surgical disciplines worldwide, minor touch-ups or secondary revisions may be indicated. Any secondary procedures involve separate hospital facility, implant, or anaesthetic expenses.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">6. Patient Clinical Responsibilities</h2>
        <p>
          Safe surgical care is a partnership. To safeguard your health and avoid catastrophic anaesthetic or surgical risks, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Disclose Complete Medical Truth:</strong> Fully disclose all current illnesses, cardiovascular conditions, bleeding tendencies, previous surgeries, and drug allergies during consultation.</li>
          <li><strong>Disclose All Medications &amp; Substances:</strong> Inform the surgeon of all prescription drugs, over-the-counter medications, blood-thinning herbal supplements, vitamin E, aspirin, oral contraceptives, smoking/vaping habits, and alcohol consumption.</li>
          <li><strong>Strict Adherence to Pre- &amp; Post-Op Protocols:</strong> Follow all fasting instructions prior to general or local anaesthesia, wear prescribed compression garments, take prescribed antibiotic/analgesic courses, and attend all scheduled post-op review visits.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">7. Fees, Quotations &amp; Payments</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Consultation Fees:</strong> Online consultation slots require advance payment at booking. In-clinic consultation fees are payable at the hospital desk or online. Consultation fees cover the doctor&rsquo;s clinical assessment time and are non-refundable once the consultation has taken place.</li>
          <li><strong>Surgical Quotations:</strong> Following clinical assessment, an itemized surgical estimate is provided. Surgical estimates remain valid for <strong>30 calendar days</strong>. Quotations encompass surgeon fees, operating theatre charges, hospital room stay, anaesthetist fees, and specialized implants where applicable.</li>
          <li><strong>Payment Processing:</strong> Online payments are processed securely by Razorpay. All fees are denominated in Indian Rupees (INR) and include statutory taxes where applicable.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">8. Intellectual Property &amp; Media Copyright</h2>
        <p>
          All content on this website &ndash; including anatomical descriptions, procedure analyses, medical illustrations, clinical comparison guides, brand identity, and video scripts &ndash; is the exclusive intellectual property of Dr. Sharmistha Bhattacharyya and protected under the Copyright Act, 1957.
        </p>
        <p className="text-xs text-stone/80">
          Reproduction, republication, scraping, automated parsing, or redistribution of any clinical text or images without express written permission is strictly prohibited.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">9. Governing Law &amp; Jurisdiction</h2>
        <p>
          This Agreement, all medical consultations, and all disputes arising out of your relationship with Dr. Sharmistha Bhattacharyya shall be governed by and construed in accordance with the substantive laws of <strong>India</strong>.
        </p>
        <p>
          Any legal proceedings, claims, or arbitration arising under or in connection with this Agreement or medical care rendered shall be subject to the exclusive jurisdiction of the competent civil courts in <strong>Faridabad, Haryana, India</strong>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
