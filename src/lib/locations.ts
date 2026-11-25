export type Location = {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  region: string;
  portfolioTag: string;
  areas: string[];
  intro: string;
  portfolioNote: string;
  travel: string;
  consult: string;
};

export const locations: Location[] = [
  {
    slug: "gurgaon-golf-course-road",
    name: "Gurgaon (Golf Course Road)",
    shortName: "Gurgaon",
    headline: "Plastic & Aesthetic Surgeon for Gurgaon (Golf Course Road)",
    region: "Delhi NCR · Haryana",
    portfolioTag: "Corporate, Expat & Family Aesthetics",
    areas: [
      "Golf Course Road",
      "DLF Phases 1 to 5",
      "Cyber City",
      "Golf Course Extension Road",
      "Sushant Lok",
      "Sohna Road",
    ],
    intro:
      "Patients from Golf Course Road, DLF Phases 1–5 and Cyber City frequently seek natural, understated enhancements that fit seamlessly into demanding work and social calendars—without looking 'overdone'. Dr. Sharmistha offers detailed 1:1 private consultations online first, before any in-person hospital visit is scheduled.",
    portfolioNote:
      "Across Gurgaon, common requests include preservation rhinoplasty, blepharoplasty, deep-plane facial rejuvenation, breast contouring, mommy makeovers and discreet intimate or non-surgical aesthetic maintenance with structured downtime planning.",
    travel:
      "Start from home or your Cyber City / Golf Course Road office with a private 1:1 video consultation. In-person anatomical examination, pre-operative clearance and Class-100 HEPA surgical care take place at Accord Super Speciality Hospital, with coordinated minimal-visit scheduling for smooth post-op recovery.",
    consult:
      "Book a private video consultation first to review goals and timeline, or schedule an in-person clinical assessment and standardised photography when ready.",
  },
  {
    slug: "south-delhi",
    name: "South Delhi",
    shortName: "South Delhi",
    headline: "Plastic & Aesthetic Surgeon for South Delhi",
    region: "New Delhi · Delhi NCR",
    portfolioTag: "Precision Facial, Breast & Body Craft",
    areas: [
      "Greater Kailash (GK I & II)",
      "Defence Colony",
      "Vasant Vihar",
      "Panchsheel Park",
      "Saket",
      "Hauz Khas",
      "Jor Bagh",
      "Central Delhi",
    ],
    intro:
      "Trained at AIIMS New Delhi and Safdarjung Hospital, Dr. Sharmistha works closely with patients across Greater Kailash, Defence Colony, Vasant Vihar and Saket who value hospital-grade safety, strict privacy and ethnicity-preserving results designed to age gracefully over the decades ahead.",
    portfolioNote:
      "In South Delhi, patients commonly consult for ethnic preservation rhinoplasty, high-definition liposuction, tummy tuck after pregnancy, breast reduction or lift, and scar-conscious facial procedures tailored to South Asian skin biology.",
    travel:
      "Initial evaluation and 1:1 expectation mapping can begin via confidential Google Meet consultation. Accord Super Speciality Hospital is directly connected from South Delhi via the Mathura Road / Delhi–Mumbai Expressway corridor for your in-person assessment, NABH-accredited surgery and follow-ups.",
    consult:
      "Begin with a confidential video consultation of up to 45 minutes. If surgery is appropriate, you receive a written, tailor-made clinical blueprint and itemised quotation with zero pressure.",
  },
  {
    slug: "faridabad",
    name: "Faridabad",
    shortName: "Faridabad",
    headline: "Plastic & Aesthetic Surgeon in Faridabad",
    region: "Delhi NCR · Haryana",
    portfolioTag: "Home Hospital Campus & Direct Care",
    areas: [
      "Sector 14",
      "Sector 15",
      "Sector 16",
      "Sector 17",
      "Sector 86",
      "Greater Faridabad (Neharpar)",
      "Surajkund",
    ],
    intro:
      "Dr. Sharmistha's primary surgical suites are anchored at Accord Super Speciality Hospital, Sector 86 — giving residents of Sectors 14–17, Surajkund and Greater Faridabad direct access to AIIMS-trained reconstructive and aesthetic surgery close to home.",
    portfolioNote:
      "From gynecomastia correction, rhinoplasty and hair restoration to complex trauma/reconstructive care, liposuction and tummy tuck, every consultation, operation and scheduled review happens personally with Dr. Sharmistha under one accredited hospital roof.",
    travel:
      "Patients across Sector 14–17, Greater Faridabad and Surajkund can attend in-person outpatient consultations, pre-operative diagnostics, hospital surgery and milestone follow-up visits within minutes of home.",
    consult:
      "Schedule an in-person consultation Monday to Saturday by prior appointment, or begin with a 1:1 online video consultation whenever more convenient.",
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
