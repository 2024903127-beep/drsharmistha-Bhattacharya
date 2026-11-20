import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalPageLayout } from "@/components/site/LegalPageLayout";

export const metadata = buildMeta({
  title: "Telemedicine & Informed Consent Policy | NMC Guidelines 2020 | Dr. Sharmistha Bhattacharyya",
  description: "Official informed consent policy for online video consultations with Dr. Sharmistha Bhattacharyya under the National Medical Commission Telemedicine Practice Guidelines, 2020.",
  path: "/telemedicine-consent",
});

export default function TelemedicineConsent() {
  return (
    <LegalPageLayout
      title="Telemedicine &amp; Informed Consent Policy"
      subtitle="Statutory consent terms, technological requirements, and clinical scope for online video consultations pursuant to the National Medical Commission Telemedicine Practice Guidelines."
      badge="NMC Telemedicine Guidelines (2020)"
      lastUpdated="November 2026"
      currentPath="/telemedicine-consent"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">1. Statutory Framework &amp; Practitioner Credentials</h2>
        <p>
          This Telemedicine Informed Consent Policy governs all remote audio-visual consultations conducted through this platform. These services are provided strictly in compliance with the <strong>Telemedicine Practice Guidelines (2020)</strong> notified by the Board of Governors in supersession of the Medical Council of India (MCI) and the Ministry of Health and Family Welfare (MoHFW), Government of India.
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2 text-sm">
          <p><strong>Registered Medical Practitioner (RMP):</strong> Dr. Sharmistha Bhattacharyya</p>
          <p><strong>Qualifications:</strong> MBBS, MS (General Surgery), MCh (Plastic &amp; Reconstructive Surgery, All India Institute of Medical Sciences - AIIMS, New Delhi)</p>
          <p><strong>Specialty:</strong> Plastic, Aesthetic, Cosmetic &amp; Reconstructive Surgery</p>
          <p><strong>Affiliated Hospital:</strong> Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana &ndash; 121002</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">2. CRITICAL EMERGENCY EXCLUSION</h2>
        <div className="rounded-xl border-2 border-rose-300 bg-rose-50/90 p-5 text-sm text-rose-950 space-y-2">
          <p className="font-bold text-rose-900 text-base flex items-center gap-2">
            <span>🚨</span> TELEMEDICINE IS STRICTLY NOT FOR MEDICAL EMERGENCIES
          </p>
          <p>
            Teleconsultation is fundamentally unsuitable for acute, critical, or life-threatening surgical emergencies, including but not limited to: severe uncontrolled bleeding, acute chest pain, sudden difficulty breathing, major crush injuries, acute facial trauma, or suspected acute post-operative infections with high fever.
          </p>
          <p className="font-semibold text-rose-900">
            If you are experiencing an acute medical emergency, do not wait for a video consultation. Immediately call 108 or 112, or proceed directly to the nearest hospital emergency department (e.g., Accord Hospital Emergency, Faridabad).
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">3. Clinical Scope &amp; Technological Requirements</h2>
        <p>
          Online video consultations serve specific, vital clinical functions in aesthetic and plastic surgery:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Initial Assessment &amp; Candidacy Triage:</strong> Evaluating whether your aesthetic goals are realistic, whether surgical intervention is appropriate, or if non-invasive dermatological modalities are preferable.</li>
          <li><strong>Procedure Education:</strong> Explaining surgical approaches (e.g. open vs closed rhinoplasty, subglandular vs subfascial breast augmentation, VASER liposuction vs abdominoplasty), recovery phases, downtime, and associated risks.</li>
          <li><strong>Second Opinions:</strong> Reviewing prior operative summaries and imaging reports for outstation or international patients.</li>
          <li><strong>Outstation Follow-Up:</strong> Monitoring long-term healing for patients residing outside Delhi NCR following initial in-person clearance.</li>
        </ul>
        <div className="rounded-xl bg-forest/5 p-4 border border-forest/15 text-xs text-stone space-y-1">
          <p className="font-semibold text-forest">Technological Mode:</p>
          <p>Consultations are conducted over real-time high-definition video via <strong>Google Meet</strong>. Patients are required to ensure a stable internet connection, adequate facial lighting, and a quiet, private room during the call.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">4. Mandatory Inherent Clinical Limitations</h2>
        <p>
          By booking and attending a teleconsultation, you expressly understand and acknowledge the following medical limitations:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-3 text-sm">
          <p>
            <strong>A. Absence of Physical Examination:</strong> Telemedicine cannot substitute for physical touch, anatomical palpation, tissue pinch-testing, cartilage firmness assessment, or physical measurement of skin laxity.
          </p>
          <p className="border-t border-forest/10 pt-2">
            <strong>B. Visual Distortions:</strong> Video screen resolution, web camera wide-angle lenses, and ambient shadows may slightly alter 3D perceptions of facial proportions, nasal asymmetry, or breast shape.
          </p>
          <p className="border-t border-forest/10 pt-2">
            <strong>C. Non-Binding Surgical Candidacy:</strong> Any preliminary surgical opinion given during a video consultation is tentative and conditional upon an in-person clinical examination at Accord Super Speciality Hospital prior to surgery.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">5. Patient Identification &amp; Privacy Verification</h2>
        <p>
          Under Clause 3.2 of the Telemedicine Practice Guidelines, the identity of both the patient and the doctor must be verified:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>The patient must state their full legal name, age, biological sex, and current location at the commencement of the video call.</li>
          <li>For pediatric or minor consultations (under 18 years), a parent or legal guardian must be present on screen throughout the consultation.</li>
          <li>Dr. Sharmistha will confirm her medical registration credentials and hospital affiliation.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">6. Electronic Prescriptions &amp; Digital Records</h2>
        <p>
          Where medically indicated, Dr. Sharmistha Bhattacharyya may issue a digital prescription:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>Digital prescriptions are generated on the official letterhead of Dr. Sharmistha Bhattacharyya / Accord Hospital, complying with Schedule I of the Telemedicine Practice Guidelines.</li>
          <li>Prescriptions are transmitted securely to the patient&rsquo;s verified email address and unique Patient Portal account.</li>
          <li><em>Statutory Restriction:</em> Schedule X medications, narcotic drugs, and psychotropic substances will <strong>never</strong> be prescribed over telemedicine.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">7. Patient Affirmation &amp; Informed Consent Undertaking</h2>
        <div className="rounded-xl border border-forest/20 bg-forest/5 p-5 text-xs text-stone space-y-3">
          <p className="font-semibold text-forest text-sm">By booking and proceeding with an online consultation, you affirm:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>I have read, understood, and voluntarily agreed to this Telemedicine Informed Consent Policy.</li>
            <li>I understand that this video consultation is not an emergency medical service.</li>
            <li>I understand the inherent clinical limitations of video assessments and accept that surgery requires a separate in-person clinical evaluation.</li>
            <li>I consent to the recording of consultation logs and the creation of an electronic health record under my unique Patient UHID in Accord Hospital&rsquo;s clinical database.</li>
            <li>I confirm that all medical history and symptoms disclosed by me will be accurate, complete, and truthful to the best of my knowledge.</li>
          </ol>
        </div>
      </section>
    </LegalPageLayout>
  );
}
