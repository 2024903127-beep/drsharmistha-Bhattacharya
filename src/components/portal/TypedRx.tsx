"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  Search,
  FlaskConical,
  Pill,
  ClipboardList,
  Sparkles,
  History,
  BookmarkPlus,
  Eye,
  X,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  ADVICE_PHASE_LABELS,
  INVESTIGATION_GROUPS,
  type AdvicePhase,
  type ClinicalCatalog,
  type InvestigationTemplate,
  type MedicineTemplate,
  type RxPreset,
} from "@/lib/clinical-templates";

export type RxMedicineRow = {
  drug: string;
  dose: string;
  freq: string;
  days: string;
  timing: string;
};

export type SelectedInvestigation = {
  key: string;
  name: string;
  bodyPart?: string;
};

export type SavedRxData = {
  notes?: string;
  medicines: { name: string; dose: string; freq: string; days: string; timing?: string }[];
  investigations: { name: string; bodyPart?: string }[];
  beforeSurgery?: string;
  dayOfSurgery?: string;
  afterDischarge?: string;
  advice?: string;
  followUp?: string;
  savedAt?: string;
};

type Props = {
  patient: string;
  patientId: string;
  appointmentId: string;
  service: string;
  doctor: string;
  initialCatalog: ClinicalCatalog;
  previousRx?: SavedRxData | null;
  onSave: (file: File, kind: string) => Promise<void>;
};

const QUICK_FREQS = ["OD", "BD", "TDS", "QID", "HS", "SOS"];
const QUICK_DAYS = ["5 days", "1 week", "10 days", "15 days", "1 month"];
const QUICK_FOLLOWUPS = [
  "Review after 5 days",
  "Review after 1 week for dressing / suture check",
  "Review after 2 weeks",
  "Review with investigation reports after 1 week",
  "Follow-up at 1 month",
];

const EMPTY_ROW: RxMedicineRow = { drug: "", dose: "", freq: "", days: "", timing: "" };

export function TypedRx({
  patient,
  patientId,
  appointmentId,
  service,
  doctor,
  initialCatalog,
  previousRx,
  onSave,
}: Props) {
  const [catalog, setCatalog] = useState<ClinicalCatalog>(initialCatalog);

  // Rx Form State
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState<RxMedicineRow[]>([{ ...EMPTY_ROW }]);
  const [investigations, setInvestigations] = useState<SelectedInvestigation[]>([]);
  const [beforeSurgery, setBeforeSurgery] = useState("");
  const [dayOfSurgery, setDayOfSurgery] = useState("");
  const [afterDischarge, setAfterDischarge] = useState("");
  const [advice, setAdvice] = useState("");
  const [followUp, setFollowUp] = useState("");

  // Interactive UI controls
  const [medSearch, setMedSearch] = useState("");
  const [showMedDropdown, setShowMedDropdown] = useState(false);
  const [activeRowIdx, setActiveRowIdx] = useState<number | null>(0);
  const [showAllTests, setShowAllTests] = useState(false);
  const [customTest, setCustomTest] = useState("");
  const [activeCarePhase, setActiveCarePhase] = useState<AdvicePhase>("after_discharge");

  // Save-as-template inline panel & Preview modal
  const [saveTplOpen, setSaveTplOpen] = useState(false);
  const [newKitName, setNewKitName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Filtered medicine autocomplete results
  const medResults = useMemo(() => {
    const q = medSearch.trim().toLowerCase();
    if (!q) return catalog.medicines.slice(0, 10);
    return catalog.medicines.filter((m) =>
      `${m.name} ${m.category} ${m.timing || ""}`.toLowerCase().includes(q)
    );
  }, [catalog.medicines, medSearch]);

  // Add medicine from catalog (fills an empty first row if present, else appends)
  function addCatalogMedicine(m: MedicineTemplate) {
    const entry: RxMedicineRow = {
      drug: m.name,
      dose: m.dose,
      freq: m.freq,
      days: m.days,
      timing: m.timing || "",
    };
    setRows((prev) => {
      if (prev.length === 1 && !prev[0].drug.trim()) return [entry];
      return [...prev, entry];
    });
    setMedSearch("");
    setShowMedDropdown(false);
  }

  function updateRow(idx: number, field: keyof RxMedicineRow, value: string) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  // Investigation toggle & bundle helpers
  function isInvSelected(key: string) {
    return investigations.some((x) => x.key === key);
  }

  function toggleSingleInvestigation(key: string, name: string) {
    setInvestigations((prev) =>
      prev.some((x) => x.key === key) ? prev.filter((x) => x.key !== key) : [...prev, { key, name }]
    );
  }

  function updateInvBodyPart(key: string, bodyPart: string) {
    setInvestigations((prev) => prev.map((x) => (x.key === key ? { ...x, bodyPart } : x)));
  }

  function applyInvestigationTemplate(tpl: InvestigationTemplate) {
    setInvestigations((prev) => {
      const next = [...prev];
      for (const item of tpl.items) {
        const key = item.itemId;
        const existingIdx = next.findIndex((x) => x.key === key);
        if (existingIdx < 0) {
          next.push({ key, name: item.name, bodyPart: item.bodyPart });
        } else if (item.bodyPart && !next[existingIdx].bodyPart) {
          next[existingIdx] = { ...next[existingIdx], bodyPart: item.bodyPart };
        }
      }
      return next;
    });
    setMsg(`Added bundle: ${tpl.name}`);
  }

  function addCustomInvestigation() {
    const t = customTest.trim();
    if (!t) return;
    const key = `custom-${t.toLowerCase().replace(/\s+/g, "-")}`;
    if (!investigations.some((x) => x.key === key)) {
      setInvestigations((prev) => [...prev, { key, name: t }]);
    }
    setCustomTest("");
  }

  // Apply 1-click Full Prescription Kit
  function applyRxKit(kit: RxPreset) {
    const hasContent = rows.some((r) => r.drug.trim()) || investigations.length > 0 || beforeSurgery || afterDischarge;
    if (hasContent && !confirm(`Apply "${kit.name}"? This replaces current medicines and appends investigations/care notes.`)) {
      return;
    }

    if (kit.medicines.length > 0) {
      setRows(
        kit.medicines.map((m) => ({
          drug: m.name,
          dose: m.dose,
          freq: m.freq,
          days: m.days,
          timing: m.timing || "",
        }))
      );
    }

    // Add linked investigation templates
    for (const tid of kit.investigationTemplateIds) {
      const tpl = catalog.investigationTemplates.find((t) => t.id === tid);
      if (tpl) applyInvestigationTemplate(tpl);
    }
    if (kit.extraInvestigations?.length) {
      setInvestigations((prev) => {
        const next = [...prev];
        for (const extra of kit.extraInvestigations!) {
          const k = extra.name.toLowerCase();
          if (!next.some((x) => x.name.toLowerCase() === k)) {
            next.push({ key: k, name: extra.name, bodyPart: extra.bodyPart });
          }
        }
        return next;
      });
    }

    if (kit.beforeSurgery) setBeforeSurgery(kit.beforeSurgery);
    if (kit.dayOfSurgery) setDayOfSurgery(kit.dayOfSurgery);
    if (kit.afterDischarge) setAfterDischarge(kit.afterDischarge);
    if (kit.advice) setAdvice(kit.advice);
    if (kit.followUp) setFollowUp(kit.followUp);
    setMsg(`Loaded template: ${kit.name}`);
  }

  // Load previous visit prescription
  function copyPreviousVisit() {
    if (!previousRx) return;
    if (previousRx.notes) setNotes(previousRx.notes);
    if (previousRx.medicines?.length) {
      setRows(
        previousRx.medicines.map((m) => ({
          drug: m.name,
          dose: m.dose,
          freq: m.freq,
          days: m.days,
          timing: m.timing || "",
        }))
      );
    }
    if (previousRx.investigations?.length) {
      setInvestigations(
        previousRx.investigations.map((i) => ({
          key: `prev-${i.name.toLowerCase()}`,
          name: i.name,
          bodyPart: i.bodyPart,
        }))
      );
    }
    setBeforeSurgery(previousRx.beforeSurgery || "");
    setDayOfSurgery(previousRx.dayOfSurgery || "");
    setAfterDischarge(previousRx.afterDischarge || "");
    setAdvice(previousRx.advice || "");
    setFollowUp(previousRx.followUp || "");
    setMsg("Loaded previous visit prescription.");
  }

  function insertCareSheet(phase: AdvicePhase, text: string) {
    const setter =
      phase === "before_surgery" ? setBeforeSurgery : phase === "day_of_surgery" ? setDayOfSurgery : setAfterDischarge;
    setter((prev) => (prev.trim() ? `${prev.trim()}\n${text}` : text));
  }

  // Save current prescription live as a reusable Prescription Kit
  async function saveCurrentAsKit(e: React.FormEvent) {
    e.preventDefault();
    if (!newKitName.trim()) return;
    const activeMeds = rows.filter((r) => r.drug.trim());
    const newKit: RxPreset = {
      id: `kit-${Date.now().toString(36)}`,
      name: newKitName.trim(),
      category: "Custom",
      medicines: activeMeds.map((m) => ({
        name: m.drug.trim(),
        dose: m.dose.trim(),
        freq: m.freq.trim(),
        days: m.days.trim(),
        ...(m.timing.trim() ? { timing: m.timing.trim() } : {}),
      })),
      investigationTemplateIds: [],
      extraInvestigations: investigations.map((i) => ({
        name: i.name,
        ...(i.bodyPart?.trim() ? { bodyPart: i.bodyPart.trim() } : {}),
      })),
      ...(beforeSurgery.trim() ? { beforeSurgery: beforeSurgery.trim() } : {}),
      ...(dayOfSurgery.trim() ? { dayOfSurgery: dayOfSurgery.trim() } : {}),
      ...(afterDischarge.trim() ? { afterDischarge: afterDischarge.trim() } : {}),
      ...(advice.trim() ? { advice: advice.trim() } : {}),
      ...(followUp.trim() ? { followUp: followUp.trim() } : {}),
    };

    const nextCatalog: ClinicalCatalog = {
      ...catalog,
      rxPresets: [newKit, ...catalog.rxPresets],
    };

    try {
      const res = await fetch("/api/staff/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextCatalog),
      }).then((r) => r.json());
      if (!res.ok) throw new Error(res.error || "Could not save kit.");
      setCatalog(nextCatalog);
      setNewKitName("");
      setSaveTplOpen(false);
      setMsg(`Saved "${newKit.name}" to your reusable Prescription Kits.`);
    } catch (err) {
      setMsg((err as Error).message);
    }
  }

  // Sanitize characters for jsPDF WinAnsi standard font so dashes/bullets never garble
  const pdfSafe = (text: string) =>
    text
      .replace(/[\u2013\u2014]/g, "-")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2022\u00B7]/g, "|")
      .replace(/[^\x20-\x7E\n\r]/g, " ");

  // Build clean multi-page A4 hospital PDF
  async function buildPdf() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const PAGE_W = 210;
    const MARGIN = 14;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    const MAX_Y = 274;
    let y = 16;

    const drawHeader = (cont = false) => {
      doc.setFillColor(23, 61, 50); // Forest green accent bar
      doc.rect(0, 0, PAGE_W, 4, "F");

      doc.setTextColor(23, 61, 50);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(pdfSafe(doctor), MARGIN, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(80, 90, 86);
      doc.text(
        "MBBS, MS (Surgery), MCh Plastic & Aesthetic Surgery (AIIMS New Delhi)  |  ISAPS | IAAPS | APSI",
        MARGIN,
        20
      );
      doc.text(
        "Accord Super Speciality Hospital, Sector 86, Faridabad, Delhi NCR  |  +91 96672 07009",
        MARGIN,
        24.5
      );

      // Gold accent line
      doc.setDrawColor(185, 154, 101);
      doc.setLineWidth(0.6);
      doc.line(MARGIN, 28, PAGE_W - MARGIN, 28);

      if (!cont) {
        // Patient banner box
        doc.setFillColor(246, 248, 246);
        doc.roundedRect(MARGIN, 31, CONTENT_W, 14, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(20, 30, 26);
        doc.text(pdfSafe(`Patient: ${patient}`), MARGIN + 3, 37);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(75, 85, 80);
        doc.text(pdfSafe(`Consultation: ${service}`), MARGIN + 3, 42);
        doc.text(
          `Date: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
          PAGE_W - MARGIN - 3,
          37,
          { align: "right" }
        );
        y = 52;
      } else {
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.text(pdfSafe(`Patient: ${patient} (Continued)`), MARGIN, 34);
        y = 40;
      }
    };

    const ensureSpace = (neededMm: number) => {
      if (y + neededMm > MAX_Y) {
        doc.addPage();
        drawHeader(true);
      }
    };

    const writeSectionTitle = (title: string) => {
      ensureSpace(12);
      doc.setFillColor(235, 243, 239);
      doc.rect(MARGIN, y - 4.2, CONTENT_W, 6.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(23, 61, 50);
      doc.text(pdfSafe(title.toUpperCase()), MARGIN + 2.5, y + 0.2);
      y += 6.5;
    };

    const writeParagraphBlock = (title: string, text: string) => {
      if (!text.trim()) return;
      writeSectionTitle(title);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(35, 42, 39);
      const lines = doc.splitTextToSize(pdfSafe(text.trim()), CONTENT_W - 4);
      for (const line of lines) {
        ensureSpace(5);
        doc.text(line, MARGIN + 2, y);
        y += 4.6;
      }
      y += 3;
    };

    drawHeader(false);

    if (notes.trim()) {
      writeParagraphBlock("Clinical Notes / Impression", notes);
    }

    // Medicines Rx Section
    const validMeds = rows.filter((r) => r.drug.trim());
    if (validMeds.length > 0) {
      writeSectionTitle("Rx - Prescribed Medications");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(95, 105, 100);
      doc.text("Medicine", MARGIN + 2, y);
      doc.text("Dose", MARGIN + 72, y);
      doc.text("Frequency", MARGIN + 100, y);
      doc.text("Duration", MARGIN + 132, y);
      doc.text("Notes", MARGIN + 156, y);
      y += 2;
      doc.setDrawColor(215, 222, 218);
      doc.setLineWidth(0.25);
      doc.line(MARGIN, y, PAGE_W - MARGIN, y);
      y += 4.5;

      validMeds.forEach((m, i) => {
        const nameLines = doc.splitTextToSize(pdfSafe(`${i + 1}. ${m.drug.trim()}`), 66);
        const timingLines = doc.splitTextToSize(pdfSafe(m.timing?.trim() || "-"), 28);
        const rowH = Math.max(nameLines.length, timingLines.length) * 4.2 + 2.5;
        ensureSpace(rowH);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(20, 28, 25);
        doc.text(nameLines, MARGIN + 2, y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.text(doc.splitTextToSize(pdfSafe(m.dose.trim() || "-"), 26), MARGIN + 72, y);
        doc.text(doc.splitTextToSize(pdfSafe(m.freq.trim() || "-"), 30), MARGIN + 100, y);
        doc.text(doc.splitTextToSize(pdfSafe(m.days.trim() || "-"), 22), MARGIN + 132, y);
        doc.text(timingLines, MARGIN + 156, y);

        y += rowH;
        doc.setDrawColor(238, 240, 239);
        doc.line(MARGIN, y - 1.5, PAGE_W - MARGIN, y - 1.5);
      });
      y += 4;
    }

    // Investigations Section
    if (investigations.length > 0) {
      writeSectionTitle("Advised Investigations");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(35, 42, 39);
      investigations.forEach((inv, idx) => {
        const label = pdfSafe(`${idx + 1}. ${inv.name}${inv.bodyPart?.trim() ? ` - ${inv.bodyPart.trim()}` : ""}`);
        const lines = doc.splitTextToSize(label, CONTENT_W - 6);
        ensureSpace(lines.length * 4.5 + 1);
        doc.text(lines, MARGIN + 2, y);
        y += lines.length * 4.5 + 1;
      });
      y += 3;
    }

    // Surgical / Procedure Orders & General Advice
    if (beforeSurgery.trim()) writeParagraphBlock("Before Surgery Care", beforeSurgery);
    if (dayOfSurgery.trim()) writeParagraphBlock("On Day of Surgery Prep Orders", dayOfSurgery);
    if (afterDischarge.trim()) writeParagraphBlock("After Discharge Care", afterDischarge);
    if (advice.trim()) writeParagraphBlock("Additional Advice", advice);

    if (followUp.trim()) {
      ensureSpace(14);
      doc.setFillColor(246, 248, 246);
      doc.roundedRect(MARGIN, y - 2, CONTENT_W, 10, 1.5, 1.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(23, 61, 50);
      doc.text(pdfSafe(`Follow-up: ${followUp.trim()}`), MARGIN + 3, y + 4.2);
      y += 14;
    }

    // Signature sign-off
    ensureSpace(22);
    y = Math.max(y + 4, 242);
    doc.setDrawColor(120, 125, 122);
    doc.line(PAGE_W - MARGIN - 62, y, PAGE_W - MARGIN, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(23, 61, 50);
    doc.text(pdfSafe(doctor), PAGE_W - MARGIN - 31, y + 4.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 108, 104);
    doc.text("MCh Plastic Surgery (AIIMS New Delhi)", PAGE_W - MARGIN - 31, y + 8.5, { align: "center" });

    // Page footers across all generated pages
    const pageCount = doc.getNumberOfPages();
    for (let p = 1; p <= pageCount; p++) {
      doc.setPage(p);
      doc.setDrawColor(220, 224, 222);
      doc.line(MARGIN, 284, PAGE_W - MARGIN, 284);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(120, 125, 122);
      doc.text("Dr. Sharmistha Bhattacharyya  |  Confidential Medical Prescription", MARGIN, 289);
      doc.text(`Page ${p} of ${pageCount}`, PAGE_W - MARGIN, 289, { align: "right" });
    }

    return doc;
  }

  const fileName = `prescription-typed-${patient.toLowerCase().replace(/\s+/g, "-")}.pdf`;

  async function saveToVisit() {
    setBusy(true);
    setMsg("");
    try {
      const pdfDoc = await buildPdf();
      const file = new File([pdfDoc.output("blob")], fileName, { type: "application/pdf" });
      await onSave(file, "Typed prescription");

      // Also persist structured Rx snapshot for future "Copy from Previous Visit" (non-blocking)
      const snapshot: SavedRxData = {
        notes: notes.trim() || undefined,
        medicines: rows
          .filter((r) => r.drug.trim())
          .map((r) => ({
            name: r.drug.trim(),
            dose: r.dose.trim(),
            freq: r.freq.trim(),
            days: r.days.trim(),
            ...(r.timing.trim() ? { timing: r.timing.trim() } : {}),
          })),
        investigations: investigations.map((i) => ({
          name: i.name,
          ...(i.bodyPart?.trim() ? { bodyPart: i.bodyPart.trim() } : {}),
        })),
        beforeSurgery: beforeSurgery.trim() || undefined,
        dayOfSurgery: dayOfSurgery.trim() || undefined,
        afterDischarge: afterDischarge.trim() || undefined,
        advice: advice.trim() || undefined,
        followUp: followUp.trim() || undefined,
      };
      fetch("/api/staff/consultations/rx-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, appointmentId, snapshot: { ...snapshot, service } }),
      }).catch(() => {});

      setMsg("Saved prescription PDF to this visit.");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* ── Top Quick Template Kits Strip ── */}
      <div className="solid p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-p-primary" />
            <h2 className="text-base font-semibold">1-Click Prescription Kits</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {previousRx && (
              <button type="button" onClick={copyPreviousVisit} className="p-btn p-btn-ghost !min-h-9 px-3 text-xs">
                <History size={13} /> Copy previous visit Rx
              </button>
            )}
            <button type="button" onClick={() => setSaveTplOpen((v) => !v)} className="p-btn p-btn-ghost !min-h-9 px-3 text-xs">
              <BookmarkPlus size={13} /> Save current as kit
            </button>
            <Link href="/staff/settings" className="text-xs font-semibold text-p-primary underline underline-offset-4 px-1">
              Manage templates →
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {catalog.rxPresets.map((kit) => (
            <button
              key={kit.id}
              type="button"
              onClick={() => applyRxKit(kit)}
              className="rounded-xl border border-p-border bg-p-mint/35 px-3 py-2 text-left text-xs font-medium text-p-primary hover:bg-p-primary hover:text-white transition-colors"
            >
              <span className="block font-semibold">{kit.name}</span>
              <span className="text-[10px] opacity-75">
                {kit.medicines.length} meds · {kit.investigationTemplateIds.length} panels
              </span>
            </button>
          ))}
        </div>

        {saveTplOpen && (
          <form onSubmit={saveCurrentAsKit} className="flex flex-wrap items-center gap-2 rounded-xl border border-p-primary/30 bg-p-mint/30 p-3">
            <input
              required
              className="p-input !min-h-9 flex-1 text-xs"
              placeholder="Name this new prescription kit (e.g. Gynecomastia Post-Op Pack)..."
              value={newKitName}
              onChange={(e) => setNewKitName(e.target.value)}
            />
            <button type="submit" className="p-btn !min-h-9 px-3 text-xs">Save Kit</button>
            <button type="button" onClick={() => setSaveTplOpen(false)} className="p-btn p-btn-ghost !min-h-9 px-3 text-xs">Cancel</button>
          </form>
        )}
      </div>

      {/* ── Main Builder Surface ── */}
      <div className="solid p-5 sm:p-6 space-y-6">
        {/* Clinical Impression / Short Note */}
        <div>
          <label className="p-label" htmlFor="rx-notes">Clinical Notes / Impression (optional)</label>
          <input
            id="rx-notes"
            className="p-input text-sm"
            placeholder="e.g. Post-operative Day 0 discharge orders — Rhinoplasty"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* ── Section A: Medicines with Search & Quick Pick ── */}
        <div className="space-y-3 border-t border-p-border pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-p-primary">
              <Pill size={16} /> Medicines (Rx)
            </h3>
            <span className="text-xs text-p-muted">Search catalog to auto-fill dose, frequency &amp; duration</span>
          </div>

          {/* Instant Search Dropdown */}
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-p-muted" />
            <input
              className="p-input !pl-10 text-sm"
              placeholder="Search medicine to add (e.g. Augmentin, Zerodol, Otrivin, Mupirocin, Contractubex, Patch)..."
              value={medSearch}
              onFocus={() => setShowMedDropdown(true)}
              onChange={(e) => {
                setMedSearch(e.target.value);
                setShowMedDropdown(true);
              }}
            />
            {showMedDropdown && (
              <div className="mt-1 max-h-60 overflow-y-auto rounded-xl border border-p-border bg-white shadow-lg divide-y divide-p-border/50 z-20 relative">
                <div className="flex items-center justify-between bg-p-mint/30 px-3 py-1.5 text-[11px] font-semibold text-p-muted">
                  <span>{medResults.length} matching item(s)</span>
                  <button type="button" onClick={() => setShowMedDropdown(false)} className="text-p-primary underline">Close</button>
                </div>
                {medResults.length === 0 ? (
                  <p className="p-3 text-xs text-p-muted">No match in library — type freely in the rows below.</p>
                ) : (
                  medResults.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => addCatalogMedicine(m)}
                      className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left hover:bg-p-mint/25 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-p-primary">{m.name}</p>
                        <p className="text-xs text-p-muted">
                          {m.dose} · {m.freq} · {m.days} {m.timing ? `· ${m.timing}` : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-p-mint px-2.5 py-0.5 text-[10px] font-semibold text-p-primary shrink-0">
                        + Add
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Medicine Rows */}
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={i} className="rounded-xl border border-p-border/90 bg-gray-50/60 p-3 space-y-2">
                <div className="grid gap-2 sm:grid-cols-[2fr_1fr_1fr_1fr_auto]">
                  <div>
                    <label className="p-label" htmlFor={`drug-${i}`}>Medicine #{i + 1}</label>
                    <input
                      id={`drug-${i}`}
                      className="p-input !min-h-10 text-sm bg-white"
                      placeholder="Type or search medicine..."
                      value={r.drug}
                      onFocus={() => setActiveRowIdx(i)}
                      onChange={(e) => updateRow(i, "drug", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="p-label" htmlFor={`dose-${i}`}>Dose</label>
                    <input
                      id={`dose-${i}`}
                      className="p-input !min-h-10 text-sm bg-white"
                      placeholder="1 tab"
                      value={r.dose}
                      onFocus={() => setActiveRowIdx(i)}
                      onChange={(e) => updateRow(i, "dose", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="p-label" htmlFor={`freq-${i}`}>How often</label>
                    <input
                      id={`freq-${i}`}
                      className="p-input !min-h-10 text-sm bg-white"
                      placeholder="TDS"
                      value={r.freq}
                      onFocus={() => setActiveRowIdx(i)}
                      onChange={(e) => updateRow(i, "freq", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="p-label" htmlFor={`days-${i}`}>Duration</label>
                    <input
                      id={`days-${i}`}
                      className="p-input !min-h-10 text-sm bg-white"
                      placeholder="1 week"
                      value={r.days}
                      onFocus={() => setActiveRowIdx(i)}
                      onChange={(e) => updateRow(i, "days", e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="p-btn p-btn-ghost self-end !min-h-10 px-2.5 text-rose-700"
                    aria-label="Remove medicine"
                    onClick={() => setRows((prev) => (prev.length === 1 ? [{ ...EMPTY_ROW }] : prev.filter((_, j) => j !== i)))}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Timing instruction & quick tap pills */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    className="p-input !min-h-8 !py-1 text-xs flex-1 min-w-[12rem] bg-white"
                    placeholder="Instructions (e.g. After food / Apply locally at night)"
                    value={r.timing}
                    onFocus={() => setActiveRowIdx(i)}
                    onChange={(e) => updateRow(i, "timing", e.target.value)}
                  />
                  {activeRowIdx === i && (
                    <div className="flex flex-wrap items-center gap-1">
                      {QUICK_FREQS.map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => updateRow(i, "freq", f)}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${r.freq === f ? "bg-p-primary text-white border-p-primary" : "bg-white border-p-border text-p-text"}`}
                        >
                          {f}
                        </button>
                      ))}
                      <span className="text-p-border px-0.5">|</span>
                      {QUICK_DAYS.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => updateRow(i, "days", d)}
                          className={`rounded-md px-2 py-0.5 text-[11px] font-semibold border ${r.days === d ? "bg-p-primary text-white border-p-primary" : "bg-white border-p-border text-p-text"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="p-btn p-btn-ghost !min-h-9 text-xs"
            onClick={() => {
              setRows((prev) => [...prev, { ...EMPTY_ROW }]);
              setActiveRowIdx(rows.length);
            }}
          >
            <Plus size={14} /> Add blank medicine row
          </button>
        </div>

        {/* ── Section B: Advised Investigations (Templates + Individual + Body Part) ── */}
        <div className="space-y-3 border-t border-p-border pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-p-primary">
              <FlaskConical size={16} /> Advised Investigations ({investigations.length} selected)
            </h3>
            <button
              type="button"
              onClick={() => setShowAllTests((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-p-primary underline"
            >
              {showAllTests ? (
                <>Hide full checklist <ChevronUp size={13} /></>
              ) : (
                <>Pick individual tests &amp; scans <ChevronDown size={13} /></>
              )}
            </button>
          </div>

          {/* 1-Click Investigation Bundle Chips */}
          <div>
            <p className="text-xs text-p-muted mb-2">Quick-apply saved investigation panels:</p>
            <div className="flex flex-wrap gap-2">
              {catalog.investigationTemplates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => applyInvestigationTemplate(tpl)}
                  className="rounded-full border border-p-border bg-white px-3 py-1.5 text-xs font-semibold text-p-primary hover:bg-p-mint/50 transition-colors"
                >
                  + {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Currently Selected Investigations */}
          {investigations.length > 0 && (
            <div className="rounded-xl border border-p-primary/25 bg-p-mint/25 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-p-primary">Selected on this prescription:</span>
                <button type="button" onClick={() => setInvestigations([])} className="text-[11px] text-rose-700 underline">
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {investigations.map((inv) => (
                  <span key={inv.key} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium border border-p-border">
                    <span>
                      {inv.name}
                      {inv.bodyPart ? ` (${inv.bodyPart})` : ""}
                    </span>
                    <button type="button" onClick={() => setInvestigations((p) => p.filter((x) => x.key !== inv.key))} aria-label={`Remove ${inv.name}`}>
                      <X size={12} className="text-p-muted hover:text-rose-700" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Grouped Full Checklist */}
          {showAllTests && (
            <div className="grid gap-3 md:grid-cols-2 rounded-xl border border-p-border p-4 bg-gray-50/50">
              {INVESTIGATION_GROUPS.map((grp) => {
                const items = catalog.investigations.filter((x) => x.group === grp);
                return (
                  <div key={grp} className="rounded-xl bg-white border border-p-border/70 p-3 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-p-primary">{grp}</p>
                    <div className="space-y-1.5">
                      {items.map((item) => {
                        const sel = investigations.find((x) => x.key === item.id);
                        return (
                          <div key={item.id} className="space-y-1">
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(sel)}
                                onChange={() => toggleSingleInvestigation(item.id, item.name)}
                                className="h-4 w-4 rounded"
                              />
                              <span className={sel ? "font-semibold text-p-primary" : "text-p-text"}>{item.name}</span>
                            </label>
                            {sel && item.needsBodyPart && (
                              <input
                                className="p-input !min-h-8 !py-1 text-xs"
                                placeholder={`Specify body part for ${item.name} (e.g. Neck / Abdomen)...`}
                                value={sel.bodyPart || ""}
                                onChange={(e) => updateInvBodyPart(item.id, e.target.value)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Custom investigation line */}
              <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
                <input
                  className="p-input !min-h-9 flex-1 text-xs bg-white"
                  placeholder="Add custom investigation test (e.g. Serum ANA, Doppler Lower Limb)..."
                  value={customTest}
                  onChange={(e) => setCustomTest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomInvestigation();
                    }
                  }}
                />
                <button type="button" onClick={addCustomInvestigation} className="p-btn p-btn-ghost !min-h-9 px-3 text-xs">
                  + Add custom test
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Section C: Procedure Care & Prep Orders (Before / Day-Of / After) ── */}
        <div className="space-y-3 border-t border-p-border pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 text-base font-semibold text-p-primary">
              <ClipboardList size={16} /> Procedure Care &amp; Prep Orders
            </h3>
            <span className="text-xs text-p-muted">1-click insert Before Surgery, Day-Of Prep, or After Discharge guidance</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["before_surgery", "day_of_surgery", "after_discharge"] as AdvicePhase[]).map((ph) => {
              const hasText =
                (ph === "before_surgery" && beforeSurgery.trim()) ||
                (ph === "day_of_surgery" && dayOfSurgery.trim()) ||
                (ph === "after_discharge" && afterDischarge.trim());
              return (
                <button
                  key={ph}
                  type="button"
                  onClick={() => setActiveCarePhase(ph)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                    activeCarePhase === ph
                      ? "bg-p-primary text-white border-p-primary"
                      : "bg-white border-p-border text-p-text hover:bg-p-mint/30"
                  }`}
                >
                  {ADVICE_PHASE_LABELS[ph]} {hasText ? "●" : ""}
                </button>
              );
            })}
          </div>

          {/* Saved presets for active phase */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-p-muted">Insert template:</span>
            {catalog.adviceTemplates
              .filter((a) => a.phase === activeCarePhase)
              .map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => insertCareSheet(activeCarePhase, a.content)}
                  className="rounded-lg border border-p-border bg-p-mint/30 px-2.5 py-1 text-xs font-medium text-p-primary hover:bg-p-mint/60"
                >
                  + {a.procedure}: {a.title}
                </button>
              ))}
          </div>

          {activeCarePhase === "before_surgery" && (
            <textarea
              rows={4}
              className="p-input text-xs leading-relaxed"
              placeholder="Before surgery care (or click a template chip above)..."
              value={beforeSurgery}
              onChange={(e) => setBeforeSurgery(e.target.value)}
            />
          )}
          {activeCarePhase === "day_of_surgery" && (
            <textarea
              rows={4}
              className="p-input text-xs leading-relaxed"
              placeholder="On day of surgery prep orders (NPO, antiseptic shower, jewellery removal)..."
              value={dayOfSurgery}
              onChange={(e) => setDayOfSurgery(e.target.value)}
            />
          )}
          {activeCarePhase === "after_discharge" && (
            <textarea
              rows={4}
              className="p-input text-xs leading-relaxed"
              placeholder="After discharge care instructions (wound care, garments, diet, warning signs)..."
              value={afterDischarge}
              onChange={(e) => setAfterDischarge(e.target.value)}
            />
          )}
        </div>

        {/* ── Section D: General Advice & Follow-Up ── */}
        <div className="grid gap-4 sm:grid-cols-2 border-t border-p-border pt-5">
          <div>
            <label className="p-label" htmlFor="rx-advice">Additional Notes / Diet Advice</label>
            <textarea
              id="rx-advice"
              rows={2}
              className="p-input text-xs"
              placeholder="Any extra patient-specific note..."
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="p-label" htmlFor="rx-fu">Follow-up</label>
            <input
              id="rx-fu"
              className="p-input text-sm"
              placeholder="e.g. Review after 1 week"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
            />
            <div className="flex flex-wrap gap-1">
              {QUICK_FOLLOWUPS.slice(0, 3).map((fu) => (
                <button
                  key={fu}
                  type="button"
                  onClick={() => setFollowUp(fu)}
                  className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-p-text hover:bg-p-mint"
                >
                  {fu}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-wrap items-center gap-3 border-t border-p-border pt-4">
          <button type="button" onClick={() => setPreviewOpen(true)} className="p-btn p-btn-ghost">
            <Eye size={15} /> Preview Rx
          </button>
          <button
            type="button"
            onClick={async () => (await buildPdf()).save(fileName)}
            className="p-btn p-btn-ghost"
          >
            <Download size={15} /> Download PDF
          </button>
          <button type="button" disabled={busy} onClick={saveToVisit} className="p-btn">
            <Check size={16} /> {busy ? "Saving PDF..." : "Save to this visit"}
          </button>
        </div>

        {msg && (
          <p role="status" className="text-sm font-medium text-emerald-700">
            {msg}
          </p>
        )}
      </div>

      {/* ── Live Print Preview Modal ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-[#173d32]">{doctor}</h3>
                <p className="text-xs text-gray-500">Accord Super Speciality Hospital, Sector 86, Faridabad · +91 96672 07009</p>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="p-1 text-gray-500 hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-xs flex flex-wrap justify-between gap-2">
              <span><strong>Patient:</strong> {patient}</span>
              <span><strong>Date:</strong> {new Date().toLocaleDateString("en-IN")}</span>
            </div>
            {notes.trim() && (
              <div className="text-xs"><strong className="text-[#173d32]">Clinical Notes:</strong> {notes}</div>
            )}
            {rows.some((r) => r.drug.trim()) && (
              <div>
                <p className="text-xs font-bold uppercase text-[#173d32] mb-1.5">Rx Medications</p>
                <ul className="space-y-1 text-xs">
                  {rows.filter((r) => r.drug.trim()).map((r, i) => (
                    <li key={i} className="border-b border-gray-100 py-1">
                      <strong>{i + 1}. {r.drug}</strong> — {r.dose} · {r.freq} · {r.days} {r.timing ? `(${r.timing})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {investigations.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase text-[#173d32] mb-1.5">Advised Investigations</p>
                <p className="text-xs text-gray-700">
                  {investigations.map((inv) => `${inv.name}${inv.bodyPart ? ` (${inv.bodyPart})` : ""}`).join(" · ")}
                </p>
              </div>
            )}
            {beforeSurgery.trim() && (
              <div>
                <p className="text-xs font-bold uppercase text-[#173d32] mb-1">Before Surgery Care</p>
                <pre className="whitespace-pre-wrap font-sans text-xs text-gray-700">{beforeSurgery}</pre>
              </div>
            )}
            {dayOfSurgery.trim() && (
              <div>
                <p className="text-xs font-bold uppercase text-[#173d32] mb-1">On Day of Surgery Prep Orders</p>
                <pre className="whitespace-pre-wrap font-sans text-xs text-gray-700">{dayOfSurgery}</pre>
              </div>
            )}
            {afterDischarge.trim() && (
              <div>
                <p className="text-xs font-bold uppercase text-[#173d32] mb-1">After Discharge Care</p>
                <pre className="whitespace-pre-wrap font-sans text-xs text-gray-700">{afterDischarge}</pre>
              </div>
            )}
            {advice.trim() && (
              <div>
                <p className="text-xs font-bold uppercase text-[#173d32] mb-1">Additional Advice</p>
                <p className="text-xs text-gray-700">{advice}</p>
              </div>
            )}
            {followUp.trim() && (
              <div className="rounded-lg bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-900">
                Follow-up: {followUp}
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button type="button" onClick={() => setPreviewOpen(false)} className="p-btn p-btn-ghost !min-h-9 text-xs">Close</button>
              <button type="button" disabled={busy} onClick={() => { setPreviewOpen(false); saveToVisit(); }} className="p-btn !min-h-9 text-xs">Save to visit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
