import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { locations } from "@/lib/locations";

export const metadata = buildMeta({
  title: "Plastic Surgeon in Faridabad, Gurgaon and Delhi | Dr. Sharmistha",
  description: "Where Dr. Sharmistha Bhattacharyya sees patients, and how consultations work for patients from Faridabad, Gurgaon and Delhi.",
  path: "/locations",
});

export default function Locations() {
  return (
    <section className="wrap py-14 md:py-20">
      <h1 className="h-display text-5xl text-forest md:text-6xl">Locations</h1>
      <ul className="mt-10 grid gap-8 md:grid-cols-3">
        {locations.map((l) => (
          <li key={l.slug} className="border-t border-gold-deep/60 pt-5">
            <Link href={`/locations/${l.slug}`} className="font-display text-3xl text-forest hover:text-gold-deep">Plastic surgeon in {l.name}</Link>
            <p className="mt-3 text-stone">{l.intro}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
