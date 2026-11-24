const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
const resolvedSiteUrl =
  envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")
    ? envUrl.replace(/\/+$/, "")
    : "https://www.drsharmisthabhattacharyya.com";

export const site = {
  name: "Dr. Sharmistha Bhattacharyya",
  brand: "Dr Sharmistha Bhattacharyya | Plastic and Aesthetic Surgery",
  tagline: "Precision surgery, crafted with restraint.",
  url: resolvedSiteUrl,
  phone: "+91 96672 07009",
  phoneHref: "tel:+919667207009",
  whatsapp:
    "https://wa.me/919667207009?text=Hello%20Dr.%20Sharmistha%20Bhattacharyya%20Clinic%2C%20I%20would%20like%20to%20inquire%20about%20a%20consultation",
  email: "consultations@drsharmisthabhattacharyya.com",
  instagram: "https://www.instagram.com/drsharmisthabhattacharyya/",
  hospital: {
    name: "Accord Super Speciality Hospital",
    dept: "Department of Plastic, Aesthetic and Reconstructive Surgery",
    street: "Sector 86",
    city: "Faridabad",
    region: "Haryana",
    postal: "121002",
    maps: "https://www.google.com/maps/search/?api=1&query=Accord+Super+Speciality+Hospital+Sector+86+Faridabad",
  },
  hours: [
    { days: "Monday to Saturday", time: "10:00 AM to 7:00 PM, by prior appointment" },
    { days: "Sunday", time: "Closed (emergency and inpatient on-call only)" },
  ],
  // Online consultation fee in INR. Set CONSULTATION_FEE_INR in .env (placeholder default).
  consultFeeInr: Number(process.env.CONSULTATION_FEE_INR ?? 1500),
  claims: { rating: "5.0", reviews: "120+", years: "10+" },
  disclaimer:
    "Information on this website is for education only and is not medical advice. Outcomes of surgery vary between individuals and no result can be guaranteed.",
};

export const reels = [
  { t: "Rhinoplasty profile dynamics", d: "Tip support, dorsal hump balance and breathing preservation.", u: "https://www.instagram.com/p/Dcja08uzgq_/" },
  { t: "Ethnic and cosmetic rhinoplasty", d: "Cartilage grafting precision for natural South Asian nasal aesthetics.", u: "https://www.instagram.com/p/DcYx928hNMD/" },
  { t: "Assessing rhinoplasty candidacy", d: "Structural indicators, skin thickness and realistic expectations.", u: "https://www.instagram.com/p/DcG2SIMOcDB/" },
  { t: "Rhinoplasty and airway function", d: "Septoplasty, internal nasal valve support and airway patency.", u: "https://www.instagram.com/p/DcMGRxSp0Bk/" },
  { t: "Gynecomastia glandular excision", d: "True glandular tissue versus pseudo-gynecomastia fat.", u: "https://www.instagram.com/p/DcT7yvmP1MV/" },
  { t: "Gynecomastia post-op contouring", d: "Pectoral definition and scar concealment with periareolar incisions.", u: "https://www.instagram.com/p/DbyULUeRszt/" },
  { t: "Gynecomastia compression protocol", d: "Why compression vests help prevent seromas and skin folds.", u: "https://www.instagram.com/p/DbvAX0xhLS9/" },
  { t: "Gynecomastia in the operating theatre", d: "Gland resection with simultaneous VASER fat suctioning.", u: "https://www.instagram.com/p/Dcc-K1PD0ns/" },
  { t: "Liposuction myths versus reality", d: "Why liposuction is body sculpting, not weight loss.", u: "https://www.instagram.com/p/DcbQ5oooV55/" },
];

export const pillars = [
  { t: "One surgeon, start to finish", d: "Dr. Sharmistha conducts every consultation, performs every operation personally and sees you at every follow-up — handholding by her and her team throughout. You are never handed to a trainee or a sales desk." },
  { t: "Tailored for your anatomy & ethnicity", d: "With an artistic approach, Dr. Sharmistha predicts how your anatomy will evolve — so results are not just based on today, but years to come. Each plan is a bespoke, tailor-made solution targeting natural results while preserving your ethnicity and individuality." },
  { t: "Plain answers, transparent pricing", d: "There are no sales targets. Pricing is discussed individually based on your personal assessment — no hidden fees, no same-day pressure. If surgery is not the right path for you, that is said plainly." },
  { t: "Hospital-grade safety", d: "Every operation takes place in an accredited multi-speciality hospital with emergency, ICU and anaesthesia cover on site." },
  { t: "Structured aftercare, every step", d: "Detailed home-care instructions covering your diet habits, lifestyle choices and any predictable needs during or after surgery — well thought through and communicated clearly, so your recovery is never a guessing game." },
  { t: "A safe space for open conversation", d: "Dr. Sharmistha provides a safe, non-judgmental space for open discussion about your desires and preferences. She empowers her clients with body positivity and to take ownership of their body and life." },
];

export const journey = [
  ["Enquiry and pre-screening", "You reach the coordination desk by phone or WhatsApp. A short screening checks whether you need a surgical evaluation or a non-invasive treatment."],
  ["Comprehensive consultation", "A private consultation of up to 60 minutes with Dr. Sharmistha: a detailed 1:1 examination, tissue assessment and standardised photographs. Your ethnicity, anatomy and aesthetic goals shape a fully customised plan — not a template."],
  ["Written clinical plan", "You receive the recommended technique, alternatives considered, downtime, risks and a transparent, itemised cost breakdown discussed individually based on your assessment. There is no same-day pressure to commit."],
  ["Pre-operative assessment", "Blood tests, ECG, chest X-ray and a pre-anaesthetic check-up, with clear instructions on nicotine, blood thinners and compression garments."],
  ["Day of surgery", "Pre-operative markings by Dr. Sharmistha, a surgical safety checklist and a personal recovery review before discharge."],
  ["Early recovery and reviews", "Written medication schedules, emergency contacts, and checks at day 7, day 30 and month 3. Detailed home-care instructions are provided covering diet, activity and any predictable needs during your recovery."],
  ["Twelve-month review", "A full photographic reassessment under matched lighting to review scars, symmetry and long-term settling."],
];

export const testimonials = [
  { n: "Akash Yadav", p: "Rhinoplasty", l: "New Delhi", q: "At first, I was quite anxious about altering my facial proportions. But when I met Dr. Sharmistha, she clearly explained my nasal anatomy and what would look harmonious. The result is completely natural. Nobody can tell I had surgery, only that I look refreshed." },
  { n: "Sonia Kapoor", p: "Breast reduction", l: "Gurgaon", q: "After years of chronic back pain, I finally consulted Dr. Sharmistha. She treated me with respect, dignity and clinical clarity. The relief was immediate after surgery, and the shape is wonderful." },
  { n: "Rohit Mathur", p: "Abdominal liposuction", l: "Faridabad", q: "What impressed me most was her refusal to sell me unnecessary add-on treatments. She explained what liposuction could do for my abdomen and what depended on diet. Three months out, the contour is natural." },
];
