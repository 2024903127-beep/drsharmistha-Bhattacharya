import { buildMeta } from "@/lib/seo";
import { site } from "@/lib/site";
import { categories, byCategory } from "@/lib/content";
import { BookingForm } from "@/components/site/BookingForm";

export const metadata = buildMeta({
  title: "Book an Online Consultation | Dr. Sharmistha Bhattacharyya",
  description: "Book a video consultation with plastic surgeon Dr. Sharmistha Bhattacharyya. Choose a time, pay the consultation fee securely and receive your Google Meet link.",
  path: "/book-consultation",
});

export default async function Book({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const options = categories.map((c) => ({ group: c, items: byCategory(c).map((s) => s.name) }));
  return (
    <section className="wrap max-w-3xl py-14 md:py-20">
      <h1 className="h-display text-5xl text-forest md:text-6xl">Book an online consultation</h1>
      <p className="mb-10 mt-5 text-lg text-stone">Pick a time that suits you. You will receive your Google Meet link on WhatsApp and email once payment is confirmed.</p>
      <BookingForm options={options} feeInr={site.consultFeeInr} defaultService={service ?? ""} />
    </section>
  );
}
