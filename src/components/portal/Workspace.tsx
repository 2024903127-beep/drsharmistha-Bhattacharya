"use client";
import { useState } from "react";
import { Camera, PenLine, FileText } from "lucide-react";
import { A4Pad } from "./A4Pad";
import { TypedRx, type SavedRxData } from "./TypedRx";
import { call, compressImage, DocActions } from "./Actions";
import { useRouter } from "next/navigation";
import type { ClinicalCatalog } from "@/lib/clinical-templates";

type Appt = { id: string; patient: string; patientId: string; service: string; mode: string; when: string; status: string; meetLink: string | null };
type Doc = { id: string; name: string; kind: string; at: string; local?: boolean };
const KIND: Record<string, string> = { "A4 pad PDF": "prescription_pad", "Photo of handwritten prescription": "prescription_photo", "Typed prescription": "prescription_typed" };
const tabs = [["pad", "A4 writing pad", PenLine], ["photo", "Upload photo", Camera], ["typed", "Type prescription", FileText]] as const;

export function Workspace({
  appt,
  doctor,
  catalog,
  previousRx,
}: {
  appt: Appt;
  doctor: string;
  catalog: ClinicalCatalog;
  previousRx?: SavedRxData | null;
}) {
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("pad");
  const [docs, setDocs] = useState<Doc[]>([]), [done, setDone] = useState(""), router = useRouter();

  async function save(file: File, kind: string) {
    const fd = new FormData(); fd.append("file", file); fd.append("appointment", appt.id); fd.append("kind", KIND[kind] ?? "report");
    const r = await fetch("/api/staff/documents", { method: "POST", body: fd }).then((x) => x.json()).catch(() => ({ ok: false }));
    if (!r.ok) throw new Error(r.error || "Could not save. Try again.");
    setDocs((d) => [{ id: r.id, local: r.local, name: file.name, kind, at: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) }, ...d]);
  }

  return (
    <>
      <div className="glass mb-5 flex flex-wrap items-center justify-between gap-3 p-5">
        <div><h1 className="text-2xl">{appt.patient}</h1><p className="text-sm text-p-muted">{appt.service}, {appt.mode}, {appt.when} with {doctor}</p></div>
        <div className="flex flex-wrap items-center gap-2">
          {appt.meetLink ? <a className="p-btn" href={appt.meetLink} target="_blank" rel="noopener noreferrer">Join Google Meet</a> : <span className="rounded-xl bg-p-mint px-3 py-2 text-xs text-p-muted">{appt.mode === "Online" ? "No Meet link yet." : "In-person visit."}</span>}
          {appt.status === "Confirmed" && <button className="p-btn p-btn-ghost" onClick={async () => { if (!confirm("Mark this consultation as completed? A follow-up message is sent to the patient later.")) return; const r = await call(`/api/staff/appointments/${appt.id}`, "PATCH", { action: "complete" }); setDone(r.ok ? "Completed." : r.error ?? "Could not complete."); if (r.ok) router.refresh(); }}>Complete consultation</button>}
          {done && <span role="status" className="text-xs text-p-muted">{done}</span>}
        </div>
      </div>
      <div role="tablist" aria-label="Consultation tools" className="mb-5 flex flex-wrap gap-2">
        {tabs.map(([k, label, I]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`p-btn ${tab === k ? "" : "p-btn-ghost"}`}><I size={16} aria-hidden />{label}</button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_16rem]">
        <div role="tabpanel">
          {tab === "pad" && <A4Pad id={appt.id} patient={appt.patient} onSave={save} />}
          {tab === "photo" && <PhotoUpload onSave={save} />}
          {tab === "typed" && (
            <TypedRx
              patient={appt.patient}
              patientId={appt.patientId}
              appointmentId={appt.id}
              service={appt.service}
              doctor={doctor}
              initialCatalog={catalog}
              previousRx={previousRx}
              onSave={save}
            />
          )}
        </div>
        <aside className="glass h-fit p-5">
          <h2 className="text-lg">Saved for this visit</h2>
          {docs.length === 0 ? <p className="mt-2 text-sm text-p-muted">Nothing saved yet. Documents you save here are attached to {appt.patient}.</p> : (
            <ul className="mt-3 space-y-4 text-sm">{docs.map((d) => <li key={d.id}><p className="break-all font-semibold">{d.name}</p><p className="mb-2 text-xs text-p-muted">{d.kind}, {d.at}</p>{d.local ? <p className="text-xs text-p-muted">Saved locally (no database).</p> : <DocActions id={d.id} kind="prescription" />}</li>)}</ul>
          )}
          <p className="mt-4 text-xs text-p-muted">Send gives the patient a secure link on WhatsApp and email. It expires after 30 days.</p>
        </aside>
      </div>
    </>
  );
}

function PhotoUpload({ onSave }: { onSave: (f: File, k: string) => Promise<void> }) {
  const [file, setFile] = useState<File | null>(null), [url, setUrl] = useState(""), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  const pick = (f?: File) => { if (url) URL.revokeObjectURL(url); setMsg(""); setFile(f ?? null); setUrl(f ? URL.createObjectURL(f) : ""); };
  async function go() { if (!file) return; setBusy(true); try { await onSave(await compressImage(file), "Photo of handwritten prescription"); setMsg("Saved to this visit."); pick(undefined); } catch (e) { setMsg((e as Error).message); } setBusy(false); }
  return (
    <div className="solid p-6">
      <h2 className="text-xl">Photo of a handwritten prescription</h2>
      <p className="mt-1 text-sm text-p-muted">Write on paper, take a clear photo with good light, and upload. On a phone or iPad this opens the camera.</p>
      <label className="p-btn mt-5 cursor-pointer"><Camera size={16} aria-hidden />Take or choose photo<input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} /></label>
      {url && (<><img src={url} alt="Preview of the prescription photo" className="mt-5 max-h-[32rem] rounded-xl border border-p-border" /><button className="p-btn mt-4" onClick={go} disabled={busy}>{busy ? "Saving..." : "Save to this visit"}</button></>)}
      {msg && <p role="status" className="mt-3 text-sm text-p-muted">{msg}</p>}
    </div>
  );
}
