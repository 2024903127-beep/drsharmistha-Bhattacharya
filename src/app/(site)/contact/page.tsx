import { buildMeta, physicianLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/site/JsonLd";
import { LeadForm } from "@/components/site/LeadForm";

export const metadata = buildMeta({
  title: "Contact Dr. Sharmistha Bhattacharyya | Delhi NCR",
  description: "Call, WhatsApp or book a 1:1 online consultation with Dr. Sharmistha Bhattacharyya serving Gurgaon, South Delhi & across Delhi NCR. Surgical centre: Accord Super Speciality Hospital, Sector 86.",
  path: "/contact",
});

export default function Contact() {
  return (
    <section className="wrap grid gap-14 py-14 md:py-20 lg:grid-cols-2">
      <JsonLd data={physicianLd} />
      <div>
        <h1 className="h-display text-5xl text-forest md:text-6xl">Contact</h1>
        <dl className="mt-10 space-y-6 text-stone">
          <div><dt className="font-display text-xl text-forest">Phone and WhatsApp</dt><dd><a className="inline-block py-1 underline underline-offset-4" href={site.phoneHref}>{site.phone}</a> &nbsp; <a className="inline-block py-1 underline underline-offset-4" href={site.whatsapp} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a></dd></div>
          <div><dt className="font-display text-xl text-forest">Email</dt><dd><a className="inline-block py-1 underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
          <div><dt className="font-display text-xl text-forest">Hospital</dt><dd>{site.hospital.name}<br />{site.hospital.dept}<br />{site.hospital.street}, {site.hospital.city}, {site.hospital.region} {site.hospital.postal}<br /><a className="inline-block py-1 underline underline-offset-4" href={site.hospital.maps} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></dd></div>
          <div><dt className="font-display text-xl text-forest">Hours</dt><dd>{site.hours.map((h) => <span key={h.days} className="block">{h.days}: {h.time}</span>)}</dd></div>
        </dl>
      </div>
      <div className="border border-forest/15 bg-white p-6 md:p-8">
        <h2 className="font-display text-3xl text-forest">Send an enquiry</h2>
        <p className="mb-6 mt-2 text-stone">Want a fixed time with Dr. Sharmistha? <a className="underline underline-offset-4" href="/book-consultation">Book an online consultation</a>.</p>
        <LeadForm />
      </div>
    </section>
  );
}
