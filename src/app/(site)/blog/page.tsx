import Link from "next/link";
import { buildMeta } from "@/lib/seo";
import { articles } from "@/lib/content";

export const metadata = buildMeta({
  title: "Patient Guides: Plastic Surgery in Delhi NCR | Dr. Sharmistha",
  description: "Honest guides on rhinoplasty, tummy tuck, breast surgery, mommy makeover and facial contouring from Dr. Sharmistha Bhattacharyya.",
  path: "/blog",
});

export default function Blog() {
  return (
    <section className="wrap py-14 md:py-20">
      <h1 className="h-display text-5xl text-forest md:text-6xl">Patient guides</h1>
      <p className="mt-5 max-w-2xl text-lg text-stone">Plain-language answers to the questions patients in Delhi NCR ask before surgery.</p>
      <ul className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
        {articles.map((a) => (
          <li key={a.slug} className="border-t border-forest/20 pt-5">
            <p className="text-sm text-stone">{a.category}, {a.readTime}</p>
            <Link href={`/blog/${a.slug}`} className="mt-1 block font-display text-2xl leading-snug text-forest hover:text-gold-deep">{a.title}</Link>
            <p className="mt-2 text-stone">{a.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
