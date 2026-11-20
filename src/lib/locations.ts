export type Location = {
  slug: string; name: string; region: string; areas: string[]; intro: string; travel: string; consult: string;
};

export const locations: Location[] = [
  {
    slug: "faridabad", name: "Faridabad", region: "Haryana",
    areas: ["Sector 14", "Sector 15", "Sector 16", "Sector 17", "Sector 86", "Greater Faridabad (Neharpar)", "Surajkund"],
    intro: "Faridabad is home base. Dr. Sharmistha consults and operates at Accord Super Speciality Hospital in Sector 86, so your consultation, surgery and every follow-up happen in one place with one surgeon.",
    travel: "Patients from Sector 14 to 17, Greater Faridabad and Surajkund can reach the hospital in Sector 86 for consultations and reviews without leaving the city.",
    consult: "Book an in-person consultation by prior appointment, Monday to Saturday, or start with an online consultation if you prefer to talk first.",
  },
  {
    slug: "gurgaon", name: "Gurgaon", region: "Haryana",
    areas: ["Golf Course Road", "DLF Phases 1 to 5", "Cyber City", "Sohna Road"],
    intro: "Many patients from Gurgaon choose Dr. Sharmistha for her single-surgeon approach. Surgery is performed at Accord Super Speciality Hospital in Sector 86, Faridabad, which is why we plan your visits carefully so you travel only when it is needed.",
    travel: "A video consultation can cover your first assessment and questions from home or office. In-person examination, pre-operative tests, surgery and reviews take place in Faridabad.",
    consult: "Start with an online consultation, or choose an in-person visit when you are ready for a physical examination and photographs.",
  },
  {
    slug: "delhi", name: "Delhi", region: "Delhi NCR",
    areas: ["Greater Kailash", "Defence Colony", "Saket", "Vasant Vihar", "Panchsheel Park", "Central Delhi"],
    intro: "Patients from South and Central Delhi consult Dr. Sharmistha for facial, breast and body surgery. She trained at AIIMS New Delhi and VMMC and Safdarjung Hospital, and operates at Accord Super Speciality Hospital in Faridabad.",
    travel: "Early planning is done by video. You then travel to Sector 86, Faridabad, for the physical examination, tests, surgery and scheduled reviews.",
    consult: "Book an online consultation first. If surgery is advised, you receive a written plan with itemised costs and no pressure to decide on the day.",
  },
];

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
