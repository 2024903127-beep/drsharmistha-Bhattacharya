export type MedicineTemplate = {
  id: string;
  name: string;
  category: string;
  dose: string;
  freq: string;
  days: string;
  timing?: string;
};

export type InvestigationGroup =
  | "PAC Investigation"
  | "Metabolic Workup"
  | "Hormonal Profile"
  | "Imaging & Scans";

export type InvestigationItem = {
  id: string;
  name: string;
  group: InvestigationGroup;
  needsBodyPart?: boolean;
};

export type InvestigationTemplate = {
  id: string;
  name: string;
  description?: string;
  items: { itemId: string; name: string; bodyPart?: string }[];
};

export type AdvicePhase = "before_surgery" | "day_of_surgery" | "after_discharge";

export type AdviceTemplate = {
  id: string;
  procedure: string;
  phase: AdvicePhase;
  title: string;
  content: string;
};

export type RxPreset = {
  id: string;
  name: string;
  category: string;
  medicines: {
    name: string;
    dose: string;
    freq: string;
    days: string;
    timing?: string;
  }[];
  investigationTemplateIds: string[];
  extraInvestigations?: { name: string; bodyPart?: string }[];
  beforeSurgery?: string;
  dayOfSurgery?: string;
  afterDischarge?: string;
  advice?: string;
  followUp?: string;
};

export type ClinicalCatalog = {
  version: number;
  medicines: MedicineTemplate[];
  investigations: InvestigationItem[];
  investigationTemplates: InvestigationTemplate[];
  adviceTemplates: AdviceTemplate[];
  rxPresets: RxPreset[];
};

export const ADVICE_PHASE_LABELS: Record<AdvicePhase, string> = {
  before_surgery: "Before surgery care",
  day_of_surgery: "On day of surgery prep orders",
  after_discharge: "After discharge care",
};

export const INVESTIGATION_GROUPS: InvestigationGroup[] = [
  "PAC Investigation",
  "Metabolic Workup",
  "Hormonal Profile",
  "Imaging & Scans",
];

export const DEFAULT_CATALOG: ClinicalCatalog = {
  version: 1,
  medicines: [
    // Oral Discharge Meds
    { id: "med-augmentin", name: "Tab Augmentin 625 mg", category: "Oral Medications", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
    { id: "med-vizylac", name: "Tab Vizylac", category: "Oral Medications", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
    { id: "med-zerodol-sp", name: "Tab Zerodol SP", category: "Oral Medications", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
    { id: "med-pantop-dsr", name: "Tab Pantop DSR", category: "Oral Medications", dose: "1 tab", freq: "OD", days: "1 week", timing: "Before breakfast" },

    // Nasal Sprays
    { id: "med-otrivin", name: "Otrivin Nasal Spray", category: "Nasal Care", dose: "2 puffs each nostril", freq: "Up to TDS", days: "15 days", timing: "Do not exceed 3 times/day" },
    { id: "med-azeflo", name: "Azelastine-Fluticasone Nasal Spray", category: "Nasal Care", dose: "2 puffs each nostril", freq: "BD", days: "1 month", timing: "Morning & night" },
    { id: "med-saline-nasal", name: "Saline Nasal Spray", category: "Nasal Care", dose: "1 puff each nostril", freq: "Every 1–2 hrs", days: "As needed", timing: "Keep nasal passages moist" },

    // Eye Drops & Ointment
    { id: "med-neosporin-eye", name: "Neosporin Eye Ointment", category: "Eye Care", dose: "Thin ribbon", freq: "HS (At night)", days: "1 week", timing: "Apply in affected eye" },
    { id: "med-ciplox-eye", name: "Ciplox Eye Drop", category: "Eye Care", dose: "2 drops", freq: "QID", days: "1 week", timing: "In affected eye" },
    { id: "med-tear-fresh", name: "Tear Fresh Eye Drop", category: "Eye Care", dose: "1–2 drops both eyes", freq: "Every 3–4 hrs", days: "2 weeks", timing: "Lubricating comfort drops" },

    // Scar, Wound & Dermatological Ointments
    { id: "med-contractubex", name: "Ointment Contractubex", category: "Scar & Wound Care", dose: "Thin layer", freq: "BD", days: "8 weeks", timing: "Gentle massage on healed scar" },
    { id: "med-regen-d60", name: "Ointment Regen-D 60", category: "Scar & Wound Care", dose: "Thin layer", freq: "BD", days: "2 weeks", timing: "Local application on wound" },
    { id: "med-regen-d150", name: "Ointment Regen-D 150", category: "Scar & Wound Care", dose: "Thin layer", freq: "BD", days: "2 weeks", timing: "Local application" },
    { id: "med-mupirocin", name: "Ointment Mupirocin", category: "Antibiotic Ointments", dose: "Thin layer", freq: "BD", days: "7–10 days", timing: "Local application on suture line" },
    { id: "med-fucibet", name: "Ointment Fucibet", category: "Antibiotic Ointments", dose: "Thin layer", freq: "BD", days: "7 days", timing: "Local application" },
    { id: "med-depiwhite", name: "Ointment Depiwhite", category: "Skin & Pigment Care", dose: "Thin layer", freq: "HS (At night)", days: "6 weeks", timing: "Local application + morning SPF" },
    { id: "med-demelan", name: "Ointment Demelan", category: "Skin & Pigment Care", dose: "Thin layer", freq: "HS (At night)", days: "6 weeks", timing: "Local application + morning SPF" },
    { id: "med-deriva-cms", name: "Ointment Deriva CMS", category: "Skin & Pigment Care", dose: "Pea-sized layer", freq: "HS (At night)", days: "4 weeks", timing: "Local application" },
    { id: "med-tretin", name: "Ointment Tretin 0.005%", category: "Skin & Pigment Care", dose: "Pea-sized layer", freq: "HS (At night)", days: "6 weeks", timing: "Local application + strict SPF" },
    { id: "med-triluma", name: "Triluma Ointment", category: "Skin & Pigment Care", dose: "Thin layer", freq: "HS (At night)", days: "4 weeks", timing: "Local application as advised" },

    // Pain Relief Patches
    { id: "med-diclofenac-patch", name: "Pain Patch (Diclofenac)", category: "Pain Relief", dose: "1 patch", freq: "OD (Every 24 hrs)", days: "5 days", timing: "Apply on dry intact skin" },
    { id: "med-ketorolac-patch", name: "Pain Patch (Ketorolac)", category: "Pain Relief", dose: "1 patch", freq: "OD (Every 24 hrs)", days: "5 days", timing: "Apply on dry intact skin" },
  ],

  investigations: [
    // PAC Investigation
    { id: "inv-cbc", name: "CBC (Complete Blood Count)", group: "PAC Investigation" },
    { id: "inv-ptinr", name: "PT / INR (Coagulation Profile)", group: "PAC Investigation" },
    { id: "inv-viral", name: "Viral Markers (HIV I & II, HBsAg, Anti-HCV)", group: "PAC Investigation" },
    { id: "inv-lft", name: "LFT (Liver Function Test)", group: "PAC Investigation" },
    { id: "inv-kft", name: "KFT (Kidney Function Test)", group: "PAC Investigation" },
    { id: "inv-ecg", name: "ECG (12-Lead)", group: "PAC Investigation" },
    { id: "inv-cxr", name: "CXR (Chest X-Ray PA View)", group: "PAC Investigation" },
    { id: "inv-hba1c", name: "HbA1c", group: "PAC Investigation" },

    // Metabolic Workup
    { id: "inv-fasting-insulin", name: "Fasting Insulin", group: "Metabolic Workup" },
    { id: "inv-hscrp", name: "hs-CRP", group: "Metabolic Workup" },
    { id: "inv-iron-ferritin", name: "Iron / Ferritin", group: "Metabolic Workup" },
    { id: "inv-vitd-b12", name: "Vitamin D / Vitamin B12", group: "Metabolic Workup" },
    { id: "inv-apob", name: "Apo-B", group: "Metabolic Workup" },
    { id: "inv-homocysteine", name: "Homocysteine", group: "Metabolic Workup" },

    // Hormonal Profile
    { id: "inv-thyroid", name: "TSH / T3 / T4 (Thyroid Profile)", group: "Hormonal Profile" },
    { id: "inv-lh", name: "LH (Luteinizing Hormone)", group: "Hormonal Profile" },
    { id: "inv-fsh", name: "FSH", group: "Hormonal Profile" },
    { id: "inv-estradiol", name: "Estrogen / Estradiol", group: "Hormonal Profile" },
    { id: "inv-dht", name: "DHT (Dihydrotestosterone)", group: "Hormonal Profile" },
    { id: "inv-prolactin", name: "Prolactin", group: "Hormonal Profile" },

    // Imaging & Scans
    { id: "inv-usg", name: "USG", group: "Imaging & Scans", needsBodyPart: true },
    { id: "inv-mri", name: "MRI", group: "Imaging & Scans", needsBodyPart: true },
    { id: "inv-cbct-pns", name: "CBCT PNS", group: "Imaging & Scans" },
    { id: "inv-ct-scan", name: "CT Scan", group: "Imaging & Scans", needsBodyPart: true },
  ],

  investigationTemplates: [
    {
      id: "invtpl-pac",
      name: "Complete PAC Workup",
      description: "Standard pre-anaesthesia surgical fitness clearance panel",
      items: [
        { itemId: "inv-cbc", name: "CBC (Complete Blood Count)" },
        { itemId: "inv-ptinr", name: "PT / INR (Coagulation Profile)" },
        { itemId: "inv-viral", name: "Viral Markers (HIV I & II, HBsAg, Anti-HCV)" },
        { itemId: "inv-lft", name: "LFT (Liver Function Test)" },
        { itemId: "inv-kft", name: "KFT (Kidney Function Test)" },
        { itemId: "inv-ecg", name: "ECG (12-Lead)" },
        { itemId: "inv-cxr", name: "CXR (Chest X-Ray PA View)" },
        { itemId: "inv-hba1c", name: "HbA1c" },
      ],
    },
    {
      id: "invtpl-metabolic",
      name: "Metabolic & Nutritional Workup",
      description: "Metabolic inflammation, micronutrient & healing optimization panel",
      items: [
        { itemId: "inv-fasting-insulin", name: "Fasting Insulin" },
        { itemId: "inv-hscrp", name: "hs-CRP" },
        { itemId: "inv-iron-ferritin", name: "Iron / Ferritin" },
        { itemId: "inv-vitd-b12", name: "Vitamin D / Vitamin B12" },
        { itemId: "inv-apob", name: "Apo-B" },
        { itemId: "inv-homocysteine", name: "Homocysteine" },
      ],
    },
    {
      id: "invtpl-hormonal",
      name: "Hormonal Profile",
      description: "Endocrine screening for hair restoration, PCOS, or gynecomastia",
      items: [
        { itemId: "inv-thyroid", name: "TSH / T3 / T4 (Thyroid Profile)" },
        { itemId: "inv-lh", name: "LH (Luteinizing Hormone)" },
        { itemId: "inv-fsh", name: "FSH" },
        { itemId: "inv-estradiol", name: "Estrogen / Estradiol" },
        { itemId: "inv-dht", name: "DHT (Dihydrotestosterone)" },
        { itemId: "inv-prolactin", name: "Prolactin" },
      ],
    },
    {
      id: "invtpl-rhinoplasty",
      name: "Pre-Rhinoplasty PAC + CBCT PNS",
      description: "Surgical clearance plus airway & sinus anatomical imaging",
      items: [
        { itemId: "inv-cbc", name: "CBC (Complete Blood Count)" },
        { itemId: "inv-ptinr", name: "PT / INR (Coagulation Profile)" },
        { itemId: "inv-viral", name: "Viral Markers (HIV I & II, HBsAg, Anti-HCV)" },
        { itemId: "inv-lft", name: "LFT (Liver Function Test)" },
        { itemId: "inv-kft", name: "KFT (Kidney Function Test)" },
        { itemId: "inv-ecg", name: "ECG (12-Lead)" },
        { itemId: "inv-cxr", name: "CXR (Chest X-Ray PA View)" },
        { itemId: "inv-hba1c", name: "HbA1c" },
        { itemId: "inv-cbct-pns", name: "CBCT PNS" },
      ],
    },
    {
      id: "invtpl-breast",
      name: "Pre-Breast Surgery PAC + USG",
      description: "Pre-op surgical clearance + bilateral breast ultrasound baseline",
      items: [
        { itemId: "inv-cbc", name: "CBC (Complete Blood Count)" },
        { itemId: "inv-ptinr", name: "PT / INR (Coagulation Profile)" },
        { itemId: "inv-viral", name: "Viral Markers (HIV I & II, HBsAg, Anti-HCV)" },
        { itemId: "inv-lft", name: "LFT (Liver Function Test)" },
        { itemId: "inv-kft", name: "KFT (Kidney Function Test)" },
        { itemId: "inv-ecg", name: "ECG (12-Lead)" },
        { itemId: "inv-cxr", name: "CXR (Chest X-Ray PA View)" },
        { itemId: "inv-hba1c", name: "HbA1c" },
        { itemId: "inv-usg", name: "USG", bodyPart: "Bilateral Breasts & Axilla" },
      ],
    },
  ],

  adviceTemplates: [
    // Generic Plastic Surgery Set (ready to edit when exact Google Drive sheets arrive)
    {
      id: "adv-gen-before",
      procedure: "General Plastic Surgery",
      phase: "before_surgery",
      title: "Standard Pre-Operative Preparation",
      content:
        "1. Complete all ordered blood, ECG, and imaging investigations at least 3–5 days before surgery.\n2. Stop all nicotine, smoking, and vaping strictly 2 weeks prior to surgery.\n3. Avoid aspirin, ibuprofen, Vitamin E, fish oil, and herbal supplements for 7–10 days unless cleared by your physician.\n4. Maintain high-protein balanced meals and adequate hydration in the week before surgery.\n5. Inform the clinic immediately of any fever, cold, cough, or active skin infection.",
    },
    {
      id: "adv-gen-day",
      procedure: "General Plastic Surgery",
      phase: "day_of_surgery",
      title: "On Day of Surgery Prep Orders",
      content:
        "1. Fasting (NPO): Do not eat solid food or milk/tea after midnight; clear water may be stopped 6 hours prior as advised by anaesthesia team.\n2. Take a full morning bath with chlorhexidine/antiseptic wash; do NOT apply body lotion, deodorant, perfume, makeup, or nail polish.\n3. Remove all jewellery, contact lenses, hairpins, and metallic accessories.\n4. Carry all original investigation reports, photo ID, comfortable front-opening cotton clothes, and prescribed compression garment.\n5. Report to Accord Super Speciality Hospital admission desk on time with a responsible adult attendant.",
    },
    {
      id: "adv-gen-after",
      procedure: "General Plastic Surgery",
      phase: "after_discharge",
      title: "Standard Post-Discharge Care",
      content:
        "1. Complete the prescribed antibiotic and supportive medicines strictly on schedule after meals.\n2. Keep surgical dressings dry and intact until your Day 7 clinic review unless instructed otherwise.\n3. Sleep slightly propped up (2 pillows) where advised; take short gentle indoor walks daily to promote circulation.\n4. Follow a clean protein-rich home diet (dal, paneer, eggs, fish, soft greens, plenty of water); strictly avoid alcohol and smoking during healing.\n5. Contact the clinic immediately if you notice high fever, rapidly increasing one-sided swelling, soaked fresh bleeding, or calf pain.",
    },
    // Rhinoplasty Specific
    {
      id: "adv-rhino-after",
      procedure: "Rhinoplasty",
      phase: "after_discharge",
      title: "Post-Rhinoplasty Care Instructions",
      content:
        "1. Keep external nasal splint dry until removal at Day 7–10.\n2. Use Saline Nasal Spray gently to keep nasal passages moist; do NOT blow your nose forcefully for 3 weeks — sneeze with mouth open.\n3. Sleep with head elevated on 2 pillows for the first 10–14 days.\n4. Avoid resting heavy spectacles/sunglasses on the nasal bridge for 6 weeks.\n5. Apply broad-spectrum SPF 50+ sunscreen outdoors after splint removal to protect healing columella tissues.",
    },
    // Body / Breast Surgery
    {
      id: "adv-body-after",
      procedure: "Breast & Body Contouring",
      phase: "after_discharge",
      title: "Post-Contouring & Compression Care",
      content:
        "1. Wear your fitted medical compression garment / front-opening support bra continuously for 4–6 weeks as advised.\n2. Avoid lifting heavy objects, children, or stretching arms overhead sharply during the first 2 weeks.\n3. Walk lightly around your home from Day 1; avoid strenuous gym workouts for 4–6 weeks.\n4. Keep suture lines clean and dry; apply prescribed Mupirocin or silicone scar gel only after doctor clearance.",
    },
    // Eyelid / Blepharoplasty
    {
      id: "adv-eye-after",
      procedure: "Blepharoplasty",
      phase: "after_discharge",
      title: "Post-Eyelid Care Instructions",
      content:
        "1. Apply clean chilled sterile compresses gently across eyelids for 10–15 minutes every 2–3 hours during the first 48 hours.\n2. Instill prescribed lubricating and antibiotic eye drops/night ointment cleanly without touching the bottle tip to your lashes.\n3. Rest eyes from prolonged screens for 48 hours; wear dark UV sunglasses outdoors.\n4. Avoid contact lenses and eye makeup until fine crease sutures are cleared at Day 7–10.",
    },
  ],

  rxPresets: [
    {
      id: "kit-general-discharge",
      name: "Standard Surgical Discharge Kit",
      category: "Discharge",
      medicines: [
        { name: "Tab Augmentin 625 mg", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
        { name: "Tab Vizylac", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
        { name: "Tab Zerodol SP", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
        { name: "Tab Pantop DSR", dose: "1 tab", freq: "OD", days: "1 week", timing: "Before breakfast" },
        { name: "Ointment Mupirocin", dose: "Thin layer", freq: "BD", days: "7–10 days", timing: "Local application on suture line" },
      ],
      investigationTemplateIds: [],
      afterDischarge:
        "1. Keep surgical dressings dry until review.\n2. Eat protein-rich balanced meals and stay well hydrated; avoid smoking and alcohol.\n3. Walk lightly indoors daily; avoid heavy lifting for 2–4 weeks.",
      followUp: "Review in clinic after 1 week for dressing & suture check",
    },
    {
      id: "kit-rhinoplasty-discharge",
      name: "Rhinoplasty Post-Op Discharge Kit",
      category: "Discharge",
      medicines: [
        { name: "Tab Augmentin 625 mg", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
        { name: "Tab Vizylac", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
        { name: "Tab Zerodol SP", dose: "1 tab", freq: "TDS", days: "1 week", timing: "After food" },
        { name: "Tab Pantop DSR", dose: "1 tab", freq: "OD", days: "1 week", timing: "Before breakfast" },
        { name: "Otrivin Nasal Spray", dose: "2 puffs each nostril", freq: "Up to TDS", days: "15 days", timing: "Do not exceed 3 times/day" },
        { name: "Saline Nasal Spray", dose: "1 puff each nostril", freq: "Every 1–2 hrs", days: "As needed", timing: "Keep passages moist" },
        { name: "Ointment Mupirocin", dose: "Thin layer", freq: "BD", days: "10 days", timing: "Inside nostrils & columella crease" },
      ],
      investigationTemplateIds: [],
      afterDischarge:
        "1. Keep external nasal splint dry until removal at Day 7–10.\n2. Sleep propped on 2 pillows; do NOT blow nose forcefully for 3 weeks.\n3. No heavy spectacles resting on nasal bridge for 6 weeks; daily SPF 50+ after splint removal.",
      followUp: "Review on Day 7 for splint & suture removal",
    },
    {
      id: "kit-blepharoplasty",
      name: "Blepharoplasty / Eye Discharge Kit",
      category: "Discharge",
      medicines: [
        { name: "Tab Augmentin 625 mg", dose: "1 tab", freq: "TDS", days: "5 days", timing: "After food" },
        { name: "Tab Zerodol SP", dose: "1 tab", freq: "BD–TDS", days: "5 days", timing: "After food" },
        { name: "Tab Pantop DSR", dose: "1 tab", freq: "OD", days: "5 days", timing: "Before breakfast" },
        { name: "Ciplox Eye Drop", dose: "2 drops", freq: "QID", days: "1 week", timing: "In affected eye" },
        { name: "Tear Fresh Eye Drop", dose: "1–2 drops both eyes", freq: "Every 3–4 hrs", days: "2 weeks", timing: "Lubricating comfort" },
        { name: "Neosporin Eye Ointment", dose: "Thin ribbon", freq: "HS (At night)", days: "1 week", timing: "Apply in affected eye" },
      ],
      investigationTemplateIds: [],
      afterDischarge:
        "1. Chilled compresses 10–15 min every 2–3 hrs for 48 hours.\n2. Sleep head elevated; wear dark UV sunglasses outdoors.\n3. Avoid contact lenses & eye makeup until review.",
      followUp: "Review after 5–7 days for fine crease suture removal",
    },
    {
      id: "kit-preop-prep",
      name: "Pre-Op Workup & Surgery Prep Kit",
      category: "Pre-Operative",
      medicines: [],
      investigationTemplateIds: ["invtpl-pac"],
      beforeSurgery:
        "1. Complete PAC investigation reports 3–5 days prior.\n2. Strict nicotine/smoking stop 2 weeks pre-op.\n3. Pause blood thinners/fish oil/Vitamin E 7–10 days before surgery if medically cleared.",
      dayOfSurgery:
        "1. Fast strictly after midnight.\n2. Morning antiseptic shower; no creams, deodorant, jewellery, or nail polish.\n3. Bring original reports & front-opening clothing.",
      followUp: "Share PAC reports on clinic WhatsApp 3 days prior to surgery",
    },
  ],
};
