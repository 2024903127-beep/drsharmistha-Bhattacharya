import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { LegalPageLayout } from "@/components/site/LegalPageLayout";

export const metadata = buildMeta({
  title: "Cancellation & Refund Policy | Consultation Bookings | Dr. Sharmistha Bhattacharyya",
  description: "Official cancellation, rescheduling, and refund terms for online video and in-person consultations with Dr. Sharmistha Bhattacharyya.",
  path: "/cancellation-and-refund",
});

export default function CancellationAndRefund() {
  return (
    <LegalPageLayout
      title="Cancellation &amp; Refund Policy"
      subtitle="Clear, fair, and transparent guidelines governing consultation bookings, rescheduling windows, technical guarantees, and payment refunds."
      badge="Payments &amp; Booking Terms"
      lastUpdated="November 2026"
      currentPath="/cancellation-and-refund"
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">1. Consultation Bookings &amp; Fee Structure</h2>
        <p>
          Consultations with <strong>Dr. Sharmistha Bhattacharyya</strong> are conducted on an exclusive one-on-one basis with dedicated clinical evaluation time (typically 30 to 45 minutes).
        </p>
        <p>
          To secure and reserve a dedicated video consultation slot on Dr. Sharmistha&rsquo;s surgical calendar, payment of the consultation fee (₹{site.consultFeeInr.toLocaleString("en-IN")}) is required at the time of booking. All transactions are securely processed via Razorpay.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">2. Rescheduling Policy</h2>
        <p>
          We understand that personal, professional, or medical circumstances may require you to adjust your appointment:
        </p>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-3">
          <div className="flex items-start gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">✓</span>
            <div>
              <h3 className="font-semibold text-forest text-sm">Rescheduling 4+ Hours Prior</h3>
              <p className="text-xs text-stone mt-0.5 leading-relaxed">
                You may reschedule your appointment to any available future slot within <strong>30 calendar days</strong> at <strong>zero penalty or rescheduling fee</strong>. You can do this through your confirmation link or by contacting our coordination desk on WhatsApp (<a href={site.whatsapp} className="text-forest underline font-medium">{site.phone}</a>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 pt-3 border-t border-forest/10">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">!</span>
            <div>
              <h3 className="font-semibold text-forest text-sm">Rescheduling Within 4 Hours</h3>
              <p className="text-xs text-stone mt-0.5 leading-relaxed">
                If an urgent emergency arises within 4 hours of your appointment time, please call our clinic desk immediately. While slots are reserved exclusively and short-notice changes affect other waiting surgical patients, our team will make every reasonable effort to accommodate you in the next available review opening.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">3. Cancellation &amp; Refund Eligibility</h2>
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
                <td className="p-3.5 text-emerald-700 font-semibold">100% Full Refund</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Cancelled 4 to 24 hours before slot</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Credit or Full Reschedule</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Surgeon Emergency Rescheduling</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Immediate Refund or Priority Slot</td>
                <td className="p-3.5">None (0%)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-medium text-forest">Technical Failure / Connectivity Loss</td>
                <td className="p-3.5 text-emerald-700 font-semibold">100% Full Refund or Immediate Rebooking</td>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">4. Surgeon Emergency Rescheduling Guarantee</h2>
        <p>
          As Senior Consultant at Accord Super Speciality Hospital, Dr. Sharmistha Bhattacharyya may occasionally be called into the operating theatre for urgent microvascular reconstructive procedures, acute polytrauma cases, or critical burn interventions.
        </p>
        <p>
          In the rare event that an emergency surgery conflicts with your booked video consultation, you will be notified at the earliest possible moment. You will be offered:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><strong>Option A:</strong> A priority rescheduled consultation at the next earliest convenient opening for you.</li>
          <li><strong>Option B:</strong> An unconditional, immediate 100% refund of your consultation fee.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">5. Technical Disruption Guarantee</h2>
        <p>
          If your video consultation is disrupted or cannot take place due to technical failures on our platform, server downtime, or sudden Google Meet server connectivity failures:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 text-sm">
          <li>Our coordination team will immediately contact you via phone/WhatsApp to transition to an encrypted backup video channel.</li>
          <li>If the consultation cannot be satisfactorily conducted, you are entitled to a full complimentary rebooking or an immediate 100% refund.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">6. Refund Processing Method &amp; Timelines</h2>
        <div className="rounded-xl border border-forest/15 bg-white p-5 space-y-2 text-sm">
          <p>
            <strong>Mode of Refund:</strong> All approved refunds are processed directly back to the original payment source (Credit Card, Debit Card, Net Banking, or UPI account) through our licensed payment gateway partner (Razorpay).
          </p>
          <p>
            <strong>Processing Timeline:</strong> Refunds are initiated by our administration desk within <strong>24 business hours</strong> of cancellation approval. The funds typically reflect in your bank account or card statement within <strong>5 to 7 business banking days</strong>, depending on your issuing bank&rsquo;s clearing cycle.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">7. Hospital Surgical Admissions &amp; OT Deposits</h2>
        <p className="text-xs text-stone/80">
          <em>Note:</em> The policies on this page apply specifically to outpatient and online consultation bookings. Deposits for hospital inpatient admissions, specialized cosmetic implants (e.g. Mentor/Motiva breast implants), operating theatre slots, and surgical consumables are governed by the formal Hospital Admission Agreement and Accord Super Speciality Hospital&rsquo;s inpatient billing policies, provided to you in writing prior to surgery.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-serif text-forest">8. Billing &amp; Refund Inquiries</h2>
        <p>
          For any questions regarding a payment, cancellation, or refund status, please contact our clinic accounts desk:
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
