import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalPageLayout } from "@/components/site/LegalPageLayout";

export const metadata = buildMeta({
  title: "Cancellation & Refund Policy | Consultation Bookings | Dr. Sharmistha Bhattacharyya",
  description: "Official cancellation, rescheduling, value protection, and credit terms for consultation bookings with Dr. Sharmistha Bhattacharyya.",
  path: "/cancellation-and-refund",
});

export default function CancellationAndRefund() {
  return (
    <LegalPageLayout
      title="Cancellation &amp; Refund Policy"
      subtitle="Comprehensive scheduling terms, 100% value protection guarantees, rescheduling protocols, and clinical credit policies governing consultation bookings."
      badge="Payments &amp; Booking Terms"
      lastUpdated="November 2026"
      currentPath="/cancellation-and-refund"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">1. Consultation Bookings &amp; Fee Structure</h2>
        <p>
          Consultations with <strong>Dr. Sharmistha Bhattacharyya</strong> (Senior Consultant Plastic &amp; Aesthetic Surgeon, MCh AIIMS New Delhi) represent an exclusive reservation of dedicated surgical, diagnostic, and clinical evaluation time (up to 45 minutes).
        </p>
        <p>
          To secure and block a dedicated slot on Dr. Sharmistha&rsquo;s operating and outpatient calendar, payment of the consultation fee (₹{site.consultFeeInr.toLocaleString("en-IN")}) is required at the time of booking. All transactions are securely processed via Razorpay.
        </p>
        <p className="text-sm text-stone leading-relaxed">
          Because specialist surgical appointments require reserved calendar blocks and clinical coordination mobilized immediately upon confirmation, fees paid are dedicated toward securing that exclusive clinical time and are retained as guaranteed clinical service entitlements.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">2. Rescheduling Policy &amp; Slot Flexibility</h2>
        <p>
          We recognize that personal, professional, or medical circumstances may require you to adjust your scheduled consultation:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">✓</span>
            <div>
              <h3 className="font-semibold text-forest text-sm">Rescheduling 4+ Hours Prior to Slot</h3>
              <p className="text-xs text-stone mt-0.5 leading-relaxed">
                You may reschedule your appointment to any available future slot within <strong>60 calendar days</strong> at <strong>zero penalty or rescheduling fee (0%)</strong>. You can do this directly through your booking confirmation portal or by reaching our coordination desk on WhatsApp (<a href={site.whatsapp} className="text-forest underline font-medium">{site.phone}</a>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-forest/10">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">!</span>
            <div>
              <h3 className="font-semibold text-forest text-sm">Rescheduling Within 4 Hours</h3>
              <p className="text-xs text-stone mt-0.5 leading-relaxed">
                If an urgent emergency arises within 4 hours of your appointment, please contact our desk immediately. Because calendar slots are reserved exclusively and short-notice vacancies cannot be reallocated to other awaiting surgical patients, our team will make every reasonable effort to accommodate you in the next available opening as an administrative courtesy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">3. Cancellation Scenario &amp; Refund Entitlement Schedule</h2>
        <div className="overflow-x-auto rounded-xl border border-forest/15 bg-white">
          <table className="w-full text-left text-xs text-stone">
            <thead className="bg-forest/5 text-forest font-semibold uppercase tracking-wider text-[11px] border-b border-forest/10">
              <tr>
                <th className="p-3.5">Cancellation Scenario</th>
                <th className="p-3.5">Refund Entitlement</th>
                <th className="p-3.5">Processing Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest/10">
              <tr>
                <td className="p-3.5 font-medium text-forest">Cancelled 24+ hours before slot</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Full Refund*</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Cancelled 4 to 24 hours before slot</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Credit or Full Reschedule</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Surgeon Emergency Rescheduling</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Immediate Refund or Priority Slot*</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Technical Failure / Connectivity Loss</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Full Refund or Immediate Rebooking*</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Unnotified No-Show (Missed Slot)</td>
                <td className="p-3.5 text-rose-700 font-semibold">Non-refundable</td>
                <td className="p-3.5">Slot forfeiture</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Completed Consultation</td>
                <td className="p-3.5 text-rose-700 font-semibold">Non-refundable</td>
                <td className="p-3.5">Doctor&rsquo;s time rendered</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-stone/80 leading-relaxed italic">
          *<strong>Value Protection Guarantee:</strong> In accordance with specialized surgical scheduling protocols, all approved refunds and entitlements under this policy are honored in full as <strong>100% Clinical Consultation Credits or Flexible Rescheduling Vouchers</strong> (valid for 90 days, transferable, and fully adjustable against any in-person consultation or surgical/aesthetic procedure fee). Because clinical schedules and surgeon availability are dedicated exclusively upon confirmation, direct monetary reversals to payment cards or bank accounts are not disbursed once an appointment is reserved.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">4. Surgeon Emergency Rescheduling Guarantee</h2>
        <p>
          As Senior Consultant at Accord Super Speciality Hospital, Dr. Sharmistha Bhattacharyya may occasionally be called into the operating theatre for emergent microvascular reconstructive surgeries, acute trauma cases, or critical surgical interventions.
        </p>
        <p>
          In the event that an emergency hospital surgery conflicts with your booked consultation, you will be notified immediately and offered:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li><strong>Option A:</strong> A priority rescheduled consultation at the next earliest available opening of your convenience.</li>
          <li><strong>Option B:</strong> A 100% Clinical Credit Voucher with extended 180-day validity, fully applicable toward any consultation, second opinion, or surgical treatment deposit.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">5. Technical Disruption Guarantee</h2>
        <p>
          If your video consultation cannot take place or is disrupted due to verifiable platform or telecommunications failure:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>Our clinical coordination team will immediately contact you via phone or WhatsApp to transition to an encrypted backup video channel.</li>
          <li>If the consultation cannot be satisfactorily conducted, you will receive an immediate complimentary rebooking or a 100% session credit voucher credited to your account.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">6. Settlement Protocol, Credit Allocation &amp; Timelines</h2>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-3 text-sm">
          <p>
            <strong>Mode of Value Settlement:</strong> To safeguard 100% of your medical investment while eliminating bank intermediary fees, merchant deductions, or gateway reversal penalties, all cancellation entitlements are fulfilled as <strong>100% Clinical Consultation Credits</strong> issued directly by the clinic.
          </p>
          <p>
            <strong>Non-Monetary Reversal Protocol:</strong> In alignment with specialist surgical scheduling governance, liquid cash remittals or banking chargebacks are not provided once dedicated clinical time is locked on the surgical calendar. Instead, 100% of the patient&rsquo;s booking value is preserved without penalty.
          </p>
          <p>
            <strong>Credit Validity &amp; Transferability:</strong> Clinical Credits remain valid for <strong>90 calendar days</strong> from the date of cancellation and may be redeemed against any future online consultation, in-person clinical review at Accord Hospital, or adjusted toward procedural and surgical package fees. Credits may also be transferred to an immediate family member upon written request.
          </p>
          <p>
            <strong>Issuance Timeline:</strong> Approved credit vouchers and rescheduling confirmations are documented and dispatched via WhatsApp and email within <strong>24 business hours</strong> of cancellation submission.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">7. Hospital Surgical Admissions &amp; OT Deposits</h2>
        <p className="text-xs text-stone/80 leading-relaxed">
          <em>Note:</em> The policies on this page apply specifically to outpatient and online consultation bookings. Deposits for hospital inpatient admissions, specialized cosmetic implants (e.g., Mentor/Motiva breast implants), operating theatre blocks, and surgical consumables are governed by the formal Hospital Admission Agreement and Accord Super Speciality Hospital&rsquo;s inpatient billing policies, provided to you in writing prior to surgery.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">8. Billing &amp; Support Inquiries</h2>
        <p>
          For any questions regarding an appointment, rescheduling request, or credit balance, please reach our clinic accounts desk:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 text-sm space-y-1">
          <p><strong>Clinic Accounts &amp; Billing Desk:</strong> Dr. Sharmistha Bhattacharyya Clinic</p>
          <p><strong>Email:</strong> <a href={`mailto:${site.email}`} className="text-forest underline font-semibold">{site.email}</a></p>
          <p><strong>Phone / WhatsApp:</strong> <a href={site.phoneHref} className="text-forest underline font-semibold">{site.phone}</a></p>
          <p><strong>Address:</strong> Accord Super Speciality Hospital, Sector 86, Faridabad, Haryana &ndash; 121002</p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
