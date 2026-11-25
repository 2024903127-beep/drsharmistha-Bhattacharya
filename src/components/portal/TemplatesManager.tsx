"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, Check, Edit3, FlaskConical, Pill, ClipboardList, PackageCheck, Search, RotateCcw } from "lucide-react";
import {
  ADVICE_PHASE_LABELS,
  DEFAULT_CATALOG,
  INVESTIGATION_GROUPS,
  type AdvicePhase,
  type AdviceTemplate,
  type ClinicalCatalog,
  type InvestigationGroup,
  type InvestigationTemplate,
  type MedicineTemplate,
  type RxPreset,
} from "@/lib/clinical-templates";

type Tab = "inv" | "meds" | "advice" | "kits";

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export function TemplatesManager({ initialCatalog }: { initialCatalog: ClinicalCatalog }) {
  const [catalog, setCatalog] = useState<ClinicalCatalog>(initialCatalog);
  const [tab, setTab] = useState<Tab>("inv");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ text: string; err?: boolean } | null>(null);

  async function persist(next: ClinicalCatalog, msg = "Saved changes.") {
    setCatalog(next);
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch("/api/staff/templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      }).then((r) => r.json());
      if (!res.ok) throw new Error(res.error || "Failed to save templates.");
      setToast({ text: msg });
    } catch (e) {
      setToast({ text: (e as Error).message, err: true });
    } finally {
      setSaving(false);
    }
  }

  async function resetDefaults() {
    if (!confirm("Restore the default clinical catalog (keeps structure clean and resets built-in presets)?")) return;
    await persist(DEFAULT_CATALOG, "Restored clinical catalog defaults.");
  }

  const tabs: { id: Tab; label: string; count: number; Icon: typeof FlaskConical }[] = [
    { id: "inv", label: "Investigation Templates", count: catalog.investigationTemplates.length, Icon: FlaskConical },
    { id: "kits", label: "Prescription Kits", count: catalog.rxPresets.length, Icon: PackageCheck },
    { id: "meds", label: "Medicines Library", count: catalog.medicines.length, Icon: Pill },
    { id: "advice", label: "Before / Day-Of / After Advice", count: catalog.adviceTemplates.length, Icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      {/* Status & Controls Bar */}
      <div className="glass flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ id, label, count, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`p-btn text-xs sm:text-sm ${tab === id ? "" : "p-btn-ghost"}`}
            >
              <Icon size={15} aria-hidden />
              <span>{label}</span>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${tab === id ? "bg-white/20 text-white" : "bg-p-mint text-p-primary"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {saving && <span className="text-xs font-medium text-p-muted">Saving...</span>}
          {toast && (
            <span role="status" className={`text-xs font-semibold ${toast.err ? "text-rose-700" : "text-emerald-700"}`}>
              {toast.text}
            </span>
          )}
          <button type="button" onClick={resetDefaults} className="p-btn p-btn-ghost !min-h-9 px-3 text-xs">
            <RotateCcw size={13} aria-hidden />
            Reset defaults
          </button>
        </div>
      </div>

      {tab === "inv" && <InvestigationsTab catalog={catalog} onSave={persist} />}
      {tab === "meds" && <MedicinesTab catalog={catalog} onSave={persist} />}
      {tab === "advice" && <AdviceTab catalog={catalog} onSave={persist} />}
      {tab === "kits" && <RxKitsTab catalog={catalog} onSave={persist} />}
    </div>
  );
}

/* ============================================================================
 * TAB 1: Investigation Templates + Master Tests Catalog
 * ============================================================================ */
function InvestigationsTab({ catalog, onSave }: { catalog: ClinicalCatalog; onSave: (c: ClinicalCatalog, msg?: string) => Promise<void> }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tplName, setTplName] = useState("");
  const [tplDesc, setTplDesc] = useState("");
  const [selected, setSelected] = useState<Record<string, { selected: boolean; bodyPart: string }>>({});

  // Custom new lab item
  const [newTestName, setNewTestName] = useState("");
  const [newTestGroup, setNewTestGroup] = useState<InvestigationGroup>("PAC Investigation");
  const [newTestNeedsPart, setNewTestNeedsPart] = useState(false);

  function loadForEdit(t: InvestigationTemplate) {
    setEditingId(t.id);
    setTplName(t.name);
    setTplDesc(t.description || "");
    const map: Record<string, { selected: boolean; bodyPart: string }> = {};
    for (const item of t.items) {
      map[item.itemId] = { selected: true, bodyPart: item.bodyPart || "" };
    }
    setSelected(map);
  }

  function clearForm() {
    setEditingId(null);
    setTplName("");
    setTplDesc("");
    setSelected({});
  }

  function toggleItem(itemId: string) {
    setSelected((prev) => ({
      ...prev,
      [itemId]: { selected: !prev[itemId]?.selected, bodyPart: prev[itemId]?.bodyPart || "" },
    }));
  }

  function setBodyPart(itemId: string, bodyPart: string) {
    setSelected((prev) => ({
      ...prev,
      [itemId]: { selected: true, bodyPart },
    }));
  }

  async function saveTemplate(e: React.FormEvent) {
    e.preventDefault();
    if (!tplName.trim()) return;
    const items = catalog.investigations
      .filter((inv) => selected[inv.id]?.selected)
      .map((inv) => ({
        itemId: inv.id,
        name: inv.name,
        ...(inv.needsBodyPart && selected[inv.id]?.bodyPart?.trim() ? { bodyPart: selected[inv.id].bodyPart.trim() } : {}),
      }));
    if (!items.length) return;

    const tpl: InvestigationTemplate = {
      id: editingId ?? uid("invtpl"),
      name: tplName.trim(),
      ...(tplDesc.trim() ? { description: tplDesc.trim() } : {}),
      items,
    };

    const nextList = editingId
      ? catalog.investigationTemplates.map((x) => (x.id === editingId ? tpl : x))
      : [...catalog.investigationTemplates, tpl];

    await onSave({ ...catalog, investigationTemplates: nextList }, editingId ? "Investigation template updated." : "Investigation template created.");
    clearForm();
  }

  async function deleteTemplate(id: string) {
    if (!confirm("Delete this investigation template?")) return;
    await onSave(
      { ...catalog, investigationTemplates: catalog.investigationTemplates.filter((x) => x.id !== id) },
      "Investigation template removed."
    );
    if (editingId === id) clearForm();
  }

  async function addInvestigationItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newTestName.trim()) return;
    const item = {
      id: uid("inv"),
      name: newTestName.trim(),
      group: newTestGroup,
      needsBodyPart: newTestNeedsPart || undefined,
    };
    await onSave({ ...catalog, investigations: [...catalog.investigations, item] }, `Added ${item.name} to master investigations list.`);
    setNewTestName("");
    setNewTestNeedsPart(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      {/* Saved Investigation Bundles */}
      <div className="space-y-4">
        <div className="solid p-5">
          <h2 className="text-lg">Saved Investigation Bundles</h2>
          <p className="mt-1 text-xs text-p-muted">
            Select any bundle inside a prescription to add all included tests in 1 click.
          </p>
          <div className="mt-4 space-y-3">
            {catalog.investigationTemplates.map((t) => (
              <div key={t.id} className="rounded-xl border border-p-border bg-p-mint/25 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-p-primary">{t.name}</h3>
                    {t.description && <p className="text-xs text-p-muted">{t.description}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button type="button" onClick={() => loadForEdit(t)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs" title="Edit bundle">
                      <Edit3 size={13} /> Edit
                    </button>
                    <button type="button" onClick={() => deleteTemplate(t.id)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs text-rose-700" title="Delete bundle">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {t.items.map((it) => (
                    <span key={it.itemId + (it.bodyPart || "")} className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium border border-p-border">
                      {it.name}
                      {it.bodyPart ? ` (${it.bodyPart})` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Test to Master Investigations List */}
        <form onSubmit={addInvestigationItem} className="solid p-5 space-y-3">
          <h3 className="text-base font-semibold">Add custom lab test or scan to catalog</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <label className="p-label" htmlFor="new-test-name">Test / Scan name</label>
              <input id="new-test-name" className="p-input" placeholder="e.g. Serum Testosterone" value={newTestName} onChange={(e) => setNewTestName(e.target.value)} />
            </div>
            <div>
              <label className="p-label" htmlFor="new-test-group">Category group</label>
              <select id="new-test-group" className="p-input" value={newTestGroup} onChange={(e) => setNewTestGroup(e.target.value as InvestigationGroup)}>
                {INVESTIGATION_GROUPS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-p-text cursor-pointer">
            <input type="checkbox" checked={newTestNeedsPart} onChange={(e) => setNewTestNeedsPart(e.target.checked)} className="h-4 w-4 rounded" />
            Prompt for body part when selecting (e.g. USG / MRI / CT)
          </label>
          <button type="submit" className="p-btn p-btn-ghost text-xs">
            <Plus size={14} /> Add investigation to master list
          </button>
        </form>
      </div>

      {/* Create / Edit Investigation Bundle */}
      <form onSubmit={saveTemplate} className="solid p-5 space-y-4 h-fit">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg">{editingId ? "Edit Investigation Template" : "Create New Investigation Template"}</h2>
          {editingId && (
            <button type="button" onClick={clearForm} className="text-xs underline text-p-muted">Cancel edit</button>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="p-label" htmlFor="tpl-name">Template Name *</label>
            <input id="tpl-name" required className="p-input" placeholder="e.g. Pre-Tummy Tuck Workup" value={tplName} onChange={(e) => setTplName(e.target.value)} />
          </div>
          <div>
            <label className="p-label" htmlFor="tpl-desc">Short note (optional)</label>
            <input id="tpl-desc" className="p-input" placeholder="e.g. PAC + Thyroid + USG abdomen" value={tplDesc} onChange={(e) => setTplDesc(e.target.value)} />
          </div>
        </div>

        <div className="space-y-4 max-h-[34rem] overflow-y-auto pr-1">
          {INVESTIGATION_GROUPS.map((group) => {
            const list = catalog.investigations.filter((x) => x.group === group);
            return (
              <div key={group} className="rounded-xl border border-p-border/80 p-3.5">
                <p className="text-xs font-bold uppercase tracking-wider text-p-primary mb-2.5">{group}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {list.map((inv) => {
                    const checked = Boolean(selected[inv.id]?.selected);
                    return (
                      <div key={inv.id} className="space-y-1">
                        <label className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer border transition-colors ${checked ? "border-p-primary bg-p-mint/40 font-semibold text-p-primary" : "border-transparent hover:bg-gray-50"}`}>
                          <input type="checkbox" checked={checked} onChange={() => toggleItem(inv.id)} className="h-4 w-4 rounded" />
                          <span>{inv.name}</span>
                        </label>
                        {checked && inv.needsBodyPart && (
                          <input
                            className="p-input !min-h-8 !py-1 text-xs"
                            placeholder={`Specify body part for ${inv.name}...`}
                            value={selected[inv.id]?.bodyPart || ""}
                            onChange={(e) => setBodyPart(inv.id, e.target.value)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <button type="submit" className="p-btn w-full">
          <Check size={16} /> {editingId ? "Update Investigation Template" : "Save Investigation Template"}
        </button>
      </form>
    </div>
  );
}

/* ============================================================================
 * TAB 2: Medicines Library
 * ============================================================================ */
function MedicinesTab({ catalog, onSave }: { catalog: ClinicalCatalog; onSave: (c: ClinicalCatalog, msg?: string) => Promise<void> }) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [editing, setEditing] = useState<MedicineTemplate | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Oral Medications");
  const [dose, setDose] = useState("");
  const [freq, setFreq] = useState("BD");
  const [days, setDays] = useState("1 week");
  const [timing, setTiming] = useState("");

  const cats = useMemo(() => ["All", ...Array.from(new Set(catalog.medicines.map((m) => m.category)))], [catalog.medicines]);
  const filtered = useMemo(
    () =>
      catalog.medicines.filter((m) => {
        if (catFilter !== "All" && m.category !== catFilter) return false;
        if (query.trim() && !`${m.name} ${m.category} ${m.timing || ""}`.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      }),
    [catalog.medicines, catFilter, query]
  );

  function startEdit(m: MedicineTemplate) {
    setEditing(m);
    setName(m.name);
    setCategory(m.category);
    setDose(m.dose);
    setFreq(m.freq);
    setDays(m.days);
    setTiming(m.timing || "");
  }

  function clearForm() {
    setEditing(null);
    setName("");
    setCategory("Oral Medications");
    setDose("");
    setFreq("BD");
    setDays("1 week");
    setTiming("");
  }

  async function saveMed(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const item: MedicineTemplate = {
      id: editing ? editing.id : uid("med"),
      name: name.trim(),
      category: category.trim() || "Other",
      dose: dose.trim(),
      freq: freq.trim(),
      days: days.trim(),
      ...(timing.trim() ? { timing: timing.trim() } : {}),
    };
    const nextList = editing ? catalog.medicines.map((x) => (x.id === editing.id ? item : x)) : [item, ...catalog.medicines];
    await onSave({ ...catalog, medicines: nextList }, editing ? `Updated ${item.name}.` : `Added ${item.name} to catalog.`);
    clearForm();
  }

  async function deleteMed(id: string) {
    if (!confirm("Remove this medicine from the master library?")) return;
    await onSave({ ...catalog, medicines: catalog.medicines.filter((x) => x.id !== id) }, "Removed medicine from library.");
    if (editing?.id === id) clearForm();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.9fr]">
      <div className="solid p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg">Medicines Library ({filtered.length})</h2>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-p-muted" />
            <input className="p-input !min-h-9 !pl-9 text-xs" placeholder="Search medicine or group..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCatFilter(c)} className={`rounded-full px-3 py-1 text-xs font-medium border ${catFilter === c ? "bg-p-primary text-white border-p-primary" : "bg-white border-p-border text-p-text"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="space-y-2 max-h-[38rem] overflow-y-auto pr-1">
          {filtered.map((m) => (
            <div key={m.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-p-border p-3">
              <div>
                <p className="font-semibold text-sm text-p-primary">{m.name}</p>
                <p className="text-xs text-p-muted">
                  {[m.dose, m.freq, m.days].filter(Boolean).join(" · ")} {m.timing ? `(${m.timing})` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-p-mint px-2.5 py-0.5 text-[10px] font-semibold text-p-primary">{m.category}</span>
                <button type="button" onClick={() => startEdit(m)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs"><Edit3 size={12} /></button>
                <button type="button" onClick={() => deleteMed(m.id)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs text-rose-700"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={saveMed} className="solid p-5 space-y-3 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">{editing ? "Edit Medicine Defaults" : "Add Medicine to Catalog"}</h2>
          {editing && <button type="button" onClick={clearForm} className="text-xs underline text-p-muted">Cancel</button>}
        </div>
        <div>
          <label className="p-label" htmlFor="med-name">Medicine Name *</label>
          <input id="med-name" required className="p-input" placeholder="e.g. Tab Augmentin 625 mg" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="p-label" htmlFor="med-cat">Category</label>
          <input id="med-cat" className="p-input" placeholder="Oral Medications / Nasal Care / Eye Care..." value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="p-label" htmlFor="med-dose">Default Dose</label>
            <input id="med-dose" className="p-input" placeholder="1 tab" value={dose} onChange={(e) => setDose(e.target.value)} />
          </div>
          <div>
            <label className="p-label" htmlFor="med-freq">Frequency</label>
            <input id="med-freq" className="p-input" placeholder="TDS" value={freq} onChange={(e) => setFreq(e.target.value)} />
          </div>
          <div>
            <label className="p-label" htmlFor="med-days">Duration</label>
            <input id="med-days" className="p-input" placeholder="1 week" value={days} onChange={(e) => setDays(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="p-label" htmlFor="med-timing">Special Instructions / Route</label>
          <input id="med-timing" className="p-input" placeholder="e.g. After food / Local application" value={timing} onChange={(e) => setTiming(e.target.value)} />
        </div>
        <button type="submit" className="p-btn w-full">
          <Check size={16} /> {editing ? "Update Medicine" : "Add to Medicines Library"}
        </button>
      </form>
    </div>
  );
}

/* ============================================================================
 * TAB 3: Procedure-Specific Advice (Before Surgery, Day-Of Prep, After Discharge)
 * ============================================================================ */
function AdviceTab({ catalog, onSave }: { catalog: ClinicalCatalog; onSave: (c: ClinicalCatalog, msg?: string) => Promise<void> }) {
  const [phaseFilter, setPhaseFilter] = useState<AdvicePhase | "all">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [procedure, setProcedure] = useState("");
  const [phase, setPhase] = useState<AdvicePhase>("after_discharge");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const filtered = catalog.adviceTemplates.filter((a) => phaseFilter === "all" || a.phase === phaseFilter);

  function loadEdit(a: AdviceTemplate) {
    setEditingId(a.id);
    setProcedure(a.procedure);
    setPhase(a.phase);
    setTitle(a.title);
    setContent(a.content);
  }

  function clearForm() {
    setEditingId(null);
    setProcedure("");
    setPhase("after_discharge");
    setTitle("");
    setContent("");
  }

  async function saveAdvice(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const item: AdviceTemplate = {
      id: editingId ?? uid("adv"),
      procedure: procedure.trim() || "General Plastic Surgery",
      phase,
      title: title.trim(),
      content: content.trim(),
    };
    const nextList = editingId ? catalog.adviceTemplates.map((x) => (x.id === editingId ? item : x)) : [...catalog.adviceTemplates, item];
    await onSave({ ...catalog, adviceTemplates: nextList }, editingId ? "Care instruction updated." : "Care instruction added.");
    clearForm();
  }

  async function removeAdvice(id: string) {
    if (!confirm("Delete this procedure advice template?")) return;
    await onSave({ ...catalog, adviceTemplates: catalog.adviceTemplates.filter((x) => x.id !== id) }, "Care instruction removed.");
    if (editingId === id) clearForm();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_.95fr]">
      <div className="solid p-5 space-y-4">
        <div>
          <h2 className="text-lg">Procedure-Specific Advice &amp; Surgical Orders</h2>
          <p className="mt-1 text-xs text-p-muted">
            Create or edit procedure-specific care checklists here anytime — Before Surgery, On Day of Surgery, or After Discharge.
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "before_surgery", "day_of_surgery", "after_discharge"] as const).map((ph) => (
            <button key={ph} type="button" onClick={() => setPhaseFilter(ph)} className={`rounded-full px-3 py-1 text-xs font-medium border ${phaseFilter === ph ? "bg-p-primary text-white border-p-primary" : "bg-white border-p-border text-p-text"}`}>
              {ph === "all" ? "All Phases" : ADVICE_PHASE_LABELS[ph]}
            </button>
          ))}
        </div>
        <div className="space-y-3 max-h-[38rem] overflow-y-auto pr-1">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-xl border border-p-border p-4 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-full bg-p-mint px-2.5 py-0.5 text-[10px] font-bold uppercase text-p-primary">
                    {ADVICE_PHASE_LABELS[a.phase]} · {a.procedure}
                  </span>
                  <h3 className="mt-1.5 font-semibold text-sm text-p-primary">{a.title}</h3>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button type="button" onClick={() => loadEdit(a)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs"><Edit3 size={12} /> Edit</button>
                  <button type="button" onClick={() => removeAdvice(a.id)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs text-rose-700"><Trash2 size={12} /></button>
                </div>
              </div>
              <pre className="mt-2 whitespace-pre-wrap font-sans text-xs text-p-muted leading-relaxed">{a.content}</pre>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={saveAdvice} className="solid p-5 space-y-3 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">{editingId ? "Edit Advice Sheet" : "Add Procedure Advice Sheet"}</h2>
          {editingId && <button type="button" onClick={clearForm} className="text-xs underline text-p-muted">Cancel</button>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="p-label" htmlFor="adv-phase">Care Phase *</label>
            <select id="adv-phase" className="p-input" value={phase} onChange={(e) => setPhase(e.target.value as AdvicePhase)}>
              <option value="before_surgery">Before surgery care</option>
              <option value="day_of_surgery">On day of surgery prep orders</option>
              <option value="after_discharge">After discharge care</option>
            </select>
          </div>
          <div>
            <label className="p-label" htmlFor="adv-proc">Procedure Name *</label>
            <input id="adv-proc" required className="p-input" placeholder="e.g. Rhinoplasty, Tummy Tuck..." value={procedure} onChange={(e) => setProcedure(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="p-label" htmlFor="adv-title">Sheet Title *</label>
          <input id="adv-title" required className="p-input" placeholder="e.g. Post-Rhinoplasty Care Instructions" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="p-label" htmlFor="adv-body">Instructions *</label>
          <textarea id="adv-body" required rows={10} className="p-input leading-relaxed text-xs" placeholder="Enter numbered care instructions (1., 2., 3. ...)" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button type="submit" className="p-btn w-full">
          <Check size={16} /> {editingId ? "Update Advice Sheet" : "Save Advice Sheet"}
        </button>
      </form>
    </div>
  );
}

/* ============================================================================
 * TAB 4: Full 1-Click Prescription Kits (Meds + Investigations + Care + Follow-up)
 * ============================================================================ */
function RxKitsTab({ catalog, onSave }: { catalog: ClinicalCatalog; onSave: (c: ClinicalCatalog, msg?: string) => Promise<void> }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Discharge");
  const [meds, setMeds] = useState<RxPreset["medicines"]>([]);
  const [invTplIds, setInvTplIds] = useState<string[]>([]);
  const [beforeSurgery, setBeforeSurgery] = useState("");
  const [dayOfSurgery, setDayOfSurgery] = useState("");
  const [afterDischarge, setAfterDischarge] = useState("");
  const [followUp, setFollowUp] = useState("");

  function loadEdit(k: RxPreset) {
    setEditingId(k.id);
    setName(k.name);
    setCategory(k.category);
    setMeds(k.medicines);
    setInvTplIds(k.investigationTemplateIds);
    setBeforeSurgery(k.beforeSurgery || "");
    setDayOfSurgery(k.dayOfSurgery || "");
    setAfterDischarge(k.afterDischarge || "");
    setFollowUp(k.followUp || "");
  }

  function clearForm() {
    setEditingId(null);
    setName("");
    setCategory("Discharge");
    setMeds([]);
    setInvTplIds([]);
    setBeforeSurgery("");
    setDayOfSurgery("");
    setAfterDischarge("");
    setFollowUp("");
  }

  function addMedFromCatalog(medId: string) {
    const m = catalog.medicines.find((x) => x.id === medId);
    if (!m) return;
    setMeds((prev) => [...prev, { name: m.name, dose: m.dose, freq: m.freq, days: m.days, timing: m.timing }]);
  }

  function pullAdvice(id: string) {
    const a = catalog.adviceTemplates.find((x) => x.id === id);
    if (!a) return;
    if (a.phase === "before_surgery") setBeforeSurgery((prev) => (prev ? `${prev}\n${a.content}` : a.content));
    if (a.phase === "day_of_surgery") setDayOfSurgery((prev) => (prev ? `${prev}\n${a.content}` : a.content));
    if (a.phase === "after_discharge") setAfterDischarge((prev) => (prev ? `${prev}\n${a.content}` : a.content));
  }

  async function saveKit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const item: RxPreset = {
      id: editingId ?? uid("kit"),
      name: name.trim(),
      category: category.trim() || "Discharge",
      medicines: meds,
      investigationTemplateIds: invTplIds,
      ...(beforeSurgery.trim() ? { beforeSurgery: beforeSurgery.trim() } : {}),
      ...(dayOfSurgery.trim() ? { dayOfSurgery: dayOfSurgery.trim() } : {}),
      ...(afterDischarge.trim() ? { afterDischarge: afterDischarge.trim() } : {}),
      ...(followUp.trim() ? { followUp: followUp.trim() } : {}),
    };
    const nextList = editingId ? catalog.rxPresets.map((x) => (x.id === editingId ? item : x)) : [...catalog.rxPresets, item];
    await onSave({ ...catalog, rxPresets: nextList }, editingId ? "Prescription kit updated." : "Prescription kit created.");
    clearForm();
  }

  async function deleteKit(id: string) {
    if (!confirm("Delete this prescription kit?")) return;
    await onSave({ ...catalog, rxPresets: catalog.rxPresets.filter((x) => x.id !== id) }, "Prescription kit deleted.");
    if (editingId === id) clearForm();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <div className="solid p-5 space-y-4">
        <h2 className="text-lg">1-Click Prescription Kits</h2>
        <p className="text-xs text-p-muted">
          Combine discharge medicines, lab bundles, and care orders into one kit inside Consultation Room.
        </p>
        <div className="space-y-3">
          {catalog.rxPresets.map((k) => (
            <div key={k.id} className="rounded-xl border border-p-border p-4 bg-p-mint/20">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase text-p-primary border border-p-border">
                    {k.category}
                  </span>
                  <h3 className="mt-1.5 font-semibold text-p-primary">{k.name}</h3>
                  <p className="text-xs text-p-muted mt-1">
                    {k.medicines.length} medicines · {k.investigationTemplateIds.length} investigation bundle(s)
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button type="button" onClick={() => loadEdit(k)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs"><Edit3 size={12} /> Edit</button>
                  <button type="button" onClick={() => deleteKit(k.id)} className="p-btn p-btn-ghost !min-h-8 px-2.5 text-xs text-rose-700"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={saveKit} className="solid p-5 space-y-4 h-fit">
        <div className="flex items-center justify-between">
          <h2 className="text-lg">{editingId ? "Edit Prescription Kit" : "Create Prescription Kit"}</h2>
          {editingId && <button type="button" onClick={clearForm} className="text-xs underline text-p-muted">Cancel</button>}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="p-label" htmlFor="kit-name">Kit Name *</label>
            <input id="kit-name" required className="p-input" placeholder="e.g. Breast Surgery Discharge Kit" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="p-label" htmlFor="kit-cat">Type</label>
            <input id="kit-cat" className="p-input" placeholder="Discharge / Pre-Operative / OPD" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
        </div>

        {/* Medicines inside kit */}
        <div className="rounded-xl border border-p-border p-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase text-p-primary">Included Medicines ({meds.length})</span>
            <select className="p-input !min-h-9 !w-auto text-xs" value="" onChange={(e) => { addMedFromCatalog(e.target.value); }}>
              <option value="">+ Add medicine from library</option>
              {catalog.medicines.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.freq})</option>
              ))}
            </select>
          </div>
          {meds.map((m, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-xs">
              <span><strong>{m.name}</strong> — {m.dose} · {m.freq} · {m.days}</span>
              <button type="button" onClick={() => setMeds((x) => x.filter((_, j) => j !== idx))} className="text-rose-700"><Trash2 size={13} /></button>
            </div>
          ))}
        </div>

        {/* Investigation templates inside kit */}
        <div className="rounded-xl border border-p-border p-3 space-y-2">
          <span className="text-xs font-bold uppercase text-p-primary">Attach Investigation Templates</span>
          <div className="flex flex-wrap gap-2">
            {catalog.investigationTemplates.map((t) => {
              const active = invTplIds.includes(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setInvTplIds((prev) => (active ? prev.filter((x) => x !== t.id) : [...prev, t.id]))}
                  className={`rounded-full px-3 py-1 text-xs border font-medium ${active ? "bg-p-primary text-white border-p-primary" : "bg-white border-p-border text-p-text"}`}
                >
                  {active ? "✓ " : "+ "} {t.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Advice snippets */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase text-p-primary">Care Instructions (optional)</span>
            <select className="p-input !min-h-8 !w-auto text-xs" value="" onChange={(e) => pullAdvice(e.target.value)}>
              <option value="">+ Insert saved care sheet...</option>
              {catalog.adviceTemplates.map((a) => (
                <option key={a.id} value={a.id}>[{ADVICE_PHASE_LABELS[a.phase]}] {a.title}</option>
              ))}
            </select>
          </div>
          <textarea rows={2} className="p-input text-xs" placeholder="Before surgery care..." value={beforeSurgery} onChange={(e) => setBeforeSurgery(e.target.value)} />
          <textarea rows={2} className="p-input text-xs" placeholder="On day of surgery prep orders..." value={dayOfSurgery} onChange={(e) => setDayOfSurgery(e.target.value)} />
          <textarea rows={3} className="p-input text-xs" placeholder="After discharge care..." value={afterDischarge} onChange={(e) => setAfterDischarge(e.target.value)} />
          <input className="p-input text-xs" placeholder="Default follow-up (e.g. Review after 1 week)" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
        </div>

        <button type="submit" className="p-btn w-full">
          <Check size={16} /> {editingId ? "Update Prescription Kit" : "Save Prescription Kit"}
        </button>
      </form>
    </div>
  );
}
