import raw from "@data/content.json";

export type Section = { heading: string; body: string };
export type Service = {
  name: string; category: string; slug: string; sections: Section[]; short: string;
  fee?: string; stay?: string; anesthesia?: string; flagship: boolean;
};
export type Article = {
  title: string; slug: string; category: string; tag: string; readTime: string;
  metaTitle: string; metaDescription: string; keywords: string[]; excerpt: string;
};

export const services = raw.services as Service[];
export const articles = raw.articles as Article[];
export const faq = raw.faq as { q: string; a: string }[];
export const categories = [...new Set(services.map((s) => s.category))];
export const flagship = services.filter((s) => s.flagship);

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const byCategory = (c: string) => services.filter((s) => s.category === c);

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function relatedService(a: Article): Service | undefined {
  const map: [string, string][] = [
    ["mommy-makeover", "mommy-makeover"], ["tummy-tuck", "tummy-tuck"], ["breast-augmentation", "breast-implant"],
    ["breast-lift", "breast-lift"], ["intimate", "mommy-makeover"], ["facial-contouring", "facelift"],
    ["rhinoplasty", "rhinoplasty"], ["blepharoplasty", "blepharoplasty"],
  ];
  const hit = map.find(([k]) => a.slug.startsWith(k));
  return hit ? getService(hit[1]) : undefined;
}

// Single source for page titles and descriptions (used by pages and by the SEO checker in the staff portal).
export const serviceTitle = (s: Service) => `${s.name} in Faridabad | Dr. Sharmistha`;
export const serviceDescription = (s: Service) =>
  `${s.name} in Faridabad for patients from Delhi NCR and Gurgaon. Procedure, recovery, risks, indicative cost and consultation with AIIMS-trained surgeon Dr. Sharmistha.`.slice(0, 160);
