import type { Metadata } from "next";
import { site } from "./site";

// ─── Core meta builder ────────────────────────────────────────────────────────
export function buildMeta(o: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  keywords?: string[];
  imageUrl?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const url = `${site.url}${o.path}`;
  const img = o.imageUrl ?? `${site.url}/assets/og.jpg`;
  return {
    title: o.title,
    description: o.description,
    keywords: o.keywords,
    alternates: { canonical: url },
    robots: o.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 } },
    openGraph: {
      title: o.title, description: o.description, url, siteName: site.brand,
      type: o.type ?? "website", locale: "en_IN",
      images: [
        {
          url: img,
          secureUrl: img,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: o.title,
        },
      ],
      ...(o.publishedTime ? { publishedTime: o.publishedTime } : {}),
      ...(o.modifiedTime ? { modifiedTime: o.modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image", site: "@drsharmistha", creator: "@drsharmistha",
      title: o.title, description: o.description, images: [img],
    },
  };
}

// ─── Shared address ───────────────────────────────────────────────────────────
const addr = {
  "@type": "PostalAddress",
  streetAddress: `${site.hospital.name}, ${site.hospital.street}`,
  addressLocality: site.hospital.city,
  addressRegion: site.hospital.region,
  postalCode: site.hospital.postal,
  addressCountry: "IN",
};

// ─── Physician / MedicalBusiness (placed on every public page) ───────────────
// aggregateRating deliberately omitted — Google ignores self-reported ratings.
export const physicianLd = {
  "@context": "https://schema.org",
  "@type": ["Physician", "MedicalBusiness"],
  "@id": `${site.url}/#physician`,
  name: site.name,
  url: site.url,
  image: `${site.url}/assets/doctor.jpg`,
  telephone: site.phone,
  email: site.email,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  paymentAccepted: "Cash, Credit Card, Debit Card, Net Banking",
  medicalSpecialty: "PlasticSurgery",
  address: addr,
  geo: { "@type": "GeoCoordinates", latitude: "28.3929", longitude: "77.3085" },
  hasMap: site.hospital.maps,
  areaServed: [
    { "@type": "City", name: "Gurgaon" },
    { "@type": "Place", name: "Golf Course Road, Gurgaon" },
    { "@type": "Place", name: "South Delhi" },
    { "@type": "City", name: "New Delhi" },
    { "@type": "State", name: "Delhi NCR" },
    { "@type": "City", name: "Faridabad" },
    { "@type": "State", name: "Haryana" },
  ],
  sameAs: [
    site.instagram,
    "https://www.justdial.com",
    "https://www.practo.com",
  ],
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "00:00", closes: "00:00" },
  ],
  hospitalAffiliation: { "@type": "Hospital", name: site.hospital.name, address: addr },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "All India Institute of Medical Sciences (AIIMS), New Delhi" },
    { "@type": "CollegeOrUniversity", name: "VMMC and Safdarjung Hospital, New Delhi" },
    { "@type": "CollegeOrUniversity", name: "Kasturba Medical College, Manipal" },
  ],
  hasCredential: [
    { "@type": "EducationalOccupationalCredential", name: "MCh, Plastic and Reconstructive Surgery", credentialCategory: "degree", recognizedBy: { "@type": "Organization", name: "AIIMS New Delhi" } },
    { "@type": "EducationalOccupationalCredential", name: "ISAPS International Aesthetic Fellowship", credentialCategory: "fellowship" },
  ],
};

// ─── WebSite schema (search box, homepage) ───────────────────────────────────
export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.brand,
  url: site.url,
  description: "AIIMS-trained plastic and aesthetic surgeon serving patients across Delhi NCR — Gurgaon (Golf Course Road), South Delhi and Faridabad. Book private 1:1 online consultations.",
  inLanguage: "en-IN",
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${site.url}/services?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
  publisher: { "@id": `${site.url}/#physician` },
};

// ─── Local Business (adds map pin in SERPs) ───────────────────────────────────
export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#localbusiness`,
  name: site.brand,
  image: `${site.url}/assets/doctor.jpg`,
  telephone: site.phone,
  email: site.email,
  address: addr,
  url: site.url,
  priceRange: "₹₹",
  currenciesAccepted: "INR",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "10:00", closes: "19:00" },
  ],
  geo: { "@type": "GeoCoordinates", latitude: "28.3929", longitude: "77.3085" },
  hasMap: site.hospital.maps,
  areaServed: ["Gurgaon", "South Delhi", "Delhi NCR", "Faridabad"],
  sameAs: [site.instagram],
};

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────
export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: `${site.url}${it.path}`,
  })),
});

// ─── FAQ (AEO — answers in SERPs and AI overviews) ───────────────────────────
export const faqLd = (items: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.a },
  })),
});

// ─── HowTo (AEO — step-by-step in AI answers) ────────────────────────────────
export const howToLd = (name: string, description: string, steps: { name: string; text: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  name,
  description,
  step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.name, text: s.text })),
});

// ─── Medical Procedure page ───────────────────────────────────────────────────
export const procedureLd = (name: string, description: string, path: string, extra?: object) => ({
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name,
  description,
  url: `${site.url}${path}`,
  inLanguage: "en-IN",
  about: {
    "@type": "MedicalProcedure",
    name,
    procedureType: "https://schema.org/SurgicalProcedure",
    bodyLocation: "varies",
    preparation: "Pre-operative assessment required",
    followup: "Reviews at 1 week, 1 month, 3 months and 12 months",
    ...extra,
  },
  author: { "@id": `${site.url}/#physician` },
  reviewedBy: { "@id": `${site.url}/#physician` },
  dateModified: new Date().toISOString().split("T")[0],
  medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
  mainContentOfPage: { "@type": "WebPageElement", cssSelector: "main" },
});

// ─── Article / Blog ───────────────────────────────────────────────────────────
export const articleLd = (o: { title: string; description: string; slug: string; publishedTime?: string }) => ({
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  headline: o.title,
  description: o.description,
  url: `${site.url}/blog/${o.slug}`,
  inLanguage: "en-IN",
  author: { "@id": `${site.url}/#physician` },
  publisher: { "@id": `${site.url}/#physician` },
  datePublished: o.publishedTime ?? new Date().toISOString().split("T")[0],
  dateModified: new Date().toISOString().split("T")[0],
  image: `${site.url}/assets/og.jpg`,
  medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".speakable"],
  },
});

// ─── Event (for booked online consultations — schema for future) ──────────────
export const consultEventLd = (o: { patientName: string; date: string; meetLink: string }) => ({
  "@context": "https://schema.org",
  "@type": "MedicalAppointment",
  name: `Online Consultation with Dr. Sharmistha Bhattacharyya`,
  startDate: o.date,
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  location: { "@type": "VirtualLocation", url: o.meetLink },
  organizer: { "@id": `${site.url}/#physician` },
  about: { "@type": "MedicalProcedure", name: "Plastic Surgery Consultation" },
});

// ─── Service (for /services page, AEO) ───────────────────────────────────────
export const serviceLd = (name: string, description: string, path: string, price?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  url: `${site.url}${path}`,
  provider: { "@id": `${site.url}/#physician` },
  areaServed: ["Gurgaon", "South Delhi", "Delhi NCR", "Faridabad"],
  serviceType: "Medical Procedure",
  ...(price ? { offers: { "@type": "Offer", price, priceCurrency: "INR", availability: "https://schema.org/InStock" } } : {}),
});
