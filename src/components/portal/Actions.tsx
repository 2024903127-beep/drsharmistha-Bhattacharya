"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LEAD_STATUSES } from "@/lib/constants";

type R = { ok: boolean; error?: string; summary?: string; link?: string; emailed?: boolean };
export async function call(url: string, method: string, body?: unknown): Promise<R> {
  return fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined })
    .then((x) => x.json()).catch(() => ({ ok: false, error: "Network error. Try again." }));
}
function useRun() {
  const router = useRouter(), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<R>, okMsg = "Done.") => {
    setBusy(true); setMsg(""); const r = await fn(); setBusy(false);
    setMsg(r.ok ? r.summary ?? okMsg : r.error ?? "Something went wrong."); if (r.ok) router.refresh(); return r;
  };
  return { msg, busy, run };
}
// Shrinks phone photos (often 5 to 10 MB) to a few hundred KB before upload. PDFs and small images pass through.
export async function compressImage(f: File, max = 2000): Promise<File> {
  if (!f.type.startsWith("image/")) return f;
  try {
    const bmp = await createImageBitmap(f), s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.85));
    return blob && blob.size < f.size ? new File([blob], f.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : f;
  } catch { return f; }
}
const Msg = ({ m }: { m: string }) => (m ? <p role="status" className="mt-1 text-xs text-p-muted">{m}</p> : null);

export function ApptActions({ id, status }: { id: string; status: string }) {
  const { msg, busy, run } = useRun();
  const [open, setOpen] = useState(false), [date, setDate] = useState(""), [slots, setSlots] = useState<string[]>([]), [time, setTime] = useState("");
  if (!/Confirmed|Pending payment/.test(status)) return null;
  const pick = async (d: string) => { setDate(d); setTime(""); setSlots(d ? (await fetch(`/api/slots?date=${d}`).then((r) => r.json())).slots ?? [] : []); };
  return (
    <div className="min-w-44">
      <div className="flex gap-2">
        <button className="p-btn p-btn-ghost" onClick={() => setOpen(!open)} aria-expanded={open}>Reschedule</button>
        <button className="p-btn p-btn-ghost" disabled={busy} onClick={() => confirm("Cancel this appointment? The patient is notified.") && run(() => call(`/api/staff/appointments/${id}`, "PATCH", { action: "cancel" }), "Cancelled.")}>Cancel</button>
      </div>
      {open && (
        <div className="mt-2 space-y-2">
          <input type="date" className="p-input" aria-label="New date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => pick(e.target.value)} />
          {date && <select className="p-input" aria-label="New time" value={time} onChange={(e) => setTime(e.target.value)}><option value="">{slots.length ? "Choose time" : "No slots"}</option>{slots.map((s) => <option key={s}>{s}</option>)}</select>}
          <button className="p-btn w-full" disabled={!time || busy} onClick={() => run(() => call(`/api/staff/appointments/${id}`, "PATCH", { action: "reschedule", date, time }), "Rescheduled. Patient notified.")}>Confirm new time</button>
        </div>
      )}
      <Msg m={msg} />
    </div>
  );
}

export function LeadStatus({ id, status }: { id: string; status: string }) {
  const { msg, run } = useRun();
  return (
    <div><select className="p-input !min-h-11 !py-1" aria-label="Lead status" defaultValue={status} onChange={(e) => run(() => call(`/api/staff/leads/${id}`, "PATCH", { status: e.target.value }), "Saved.")}>
      {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}</select><Msg m={msg} /></div>
  );
}

export function RefundButton({ id }: { id: string }) {
  const { msg, busy, run } = useRun();
  return <div><button className="p-btn p-btn-ghost" disabled={busy} onClick={() => confirm("Refund the full amount to the patient?") && run(() => call(`/api/staff/payments/${id}/refund`, "POST"), "Refund started.")}>Refund</button><Msg m={msg} /></div>;
}

export function StaffActions({
  id,
  name,
  email,
  active,
  role,
  self,
}: {
  id: string;
  name?: string;
  email?: string;
  active: boolean;
  role: string;
  self: boolean;
}) {
  const { msg, busy, run } = useRun();
  const [resetOpen, setResetOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [notify, setNotify] = useState(true);
  const [resetSuccess, setResetSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  function generatePw() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    let random = "";
    for (let i = 0; i < 6; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPw(`Staff@${random}!`);
    setShowPw(true);
  }

  async function handleResetPassword() {
    if (!newPw || newPw.length < 6) return alert("Password must be at least 6 characters.");
    const res = await run(() =>
      call(`/api/staff/team/${id}`, "PATCH", {
        password: newPw,
        notifyStaff: notify,
      }),
      "Password updated."
    );
    if (res.ok) {
      setResetSuccess(newPw);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {self ? (
          <span className="text-xs text-p-muted font-medium">You (Logged in)</span>
        ) : (
          <>
            <select
              className="p-input !min-h-11 !w-auto !py-1 text-xs"
              aria-label="Role"
              defaultValue={role}
              onChange={(e) =>
                run(() => call(`/api/staff/team/${id}`, "PATCH", { role: e.target.value }), "Role updated.")
              }
            >
              {["admin", "doctor", "receptionist", "coordinator"].map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
            <button
              className="p-btn p-btn-ghost text-xs !py-1"
              disabled={busy}
              onClick={() =>
                run(
                  () => call(`/api/staff/team/${id}`, "PATCH", { active: !active }),
                  active ? "Deactivated." : "Activated."
                )
              }
            >
              {active ? "Deactivate" : "Activate"}
            </button>
          </>
        )}
        <button
          className="p-btn p-btn-ghost text-xs !py-1"
          onClick={() => {
            setResetOpen(!resetOpen);
            setResetSuccess("");
            setNewPw("");
          }}
        >
          {resetOpen ? "Close Reset" : "Reset Password"}
        </button>
      </div>

      {resetOpen && (
        <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/80 p-3.5 text-xs text-emerald-950 space-y-2.5 max-w-sm">
          <div className="font-semibold text-emerald-900 flex items-center justify-between">
            <span>Reset password for {name || email || "staff"}</span>
            <button
              type="button"
              onClick={generatePw}
              className="text-[11px] underline text-p-primary font-normal"
            >
              Generate
            </button>
          </div>

          {resetSuccess ? (
            <div className="space-y-2">
              <div className="bg-white p-2.5 rounded border border-emerald-200">
                <span className="text-gray-500 block text-[11px]">New password set:</span>
                <div className="flex items-center justify-between mt-1">
                  <code className="font-mono font-bold text-sm text-emerald-800">{resetSuccess}</code>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(resetSuccess);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-2 py-0.5 rounded bg-p-primary text-white text-[11px]"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-emerald-800">
                {notify
                  ? "✓ Notice email with the new password sent via Brevo."
                  : "✓ Password updated. Please share this new password with the staff member."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setResetOpen(false);
                  setResetSuccess("");
                }}
                className="text-p-primary underline text-[11px]"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="p-input !min-h-9 !py-1 text-xs pr-12 bg-white"
                  placeholder="Enter new password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-semibold"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>

              {email && (
                <label className="flex items-center gap-1.5 text-[11px] text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notify}
                    onChange={(e) => setNotify(e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-p-primary border-gray-300"
                  />
                  <span>Send email notification to {email}</span>
                </label>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  className="p-btn !py-1 text-xs"
                  disabled={busy || !newPw}
                  onClick={handleResetPassword}
                >
                  {busy ? "Updating..." : "Save new password"}
                </button>
                <button
                  className="p-btn p-btn-ghost !py-1 text-xs"
                  onClick={() => setResetOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <Msg m={msg} />
    </div>
  );
}

export function SeoEditor({ slug, title, description }: { slug: string; title: string; description: string }) {
  const { msg, busy, run } = useRun();
  const [t, setT] = useState(title), [d, setD] = useState(description);
  return (
    <details><summary className="cursor-pointer text-p-primary underline">Edit</summary>
      <div className="mt-2 w-80 max-w-[70vw] space-y-2">
        <div><label className="p-label" htmlFor={`t-${slug}`}>Title ({t.length}/60)</label><input id={`t-${slug}`} className="p-input" value={t} maxLength={70} onChange={(e) => setT(e.target.value)} /></div>
        <div><label className="p-label" htmlFor={`d-${slug}`}>Description ({d.length}/160)</label><textarea id={`d-${slug}`} rows={3} className="p-input" value={d} maxLength={200} onChange={(e) => setD(e.target.value)} /></div>
        <button className="p-btn" disabled={busy} onClick={() => run(() => call("/api/staff/seo", "PUT", { slug, title: t, description: d }), "Saved. Live shortly.")}>Save</button><Msg m={msg} />
      </div>
    </details>
  );
}

export function DocActions({ id, kind }: { id: string; kind: string }) {
  const { msg, busy, run } = useRun();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a className="p-btn p-btn-ghost" href={`/api/staff/documents/${id}`} target="_blank" rel="noopener noreferrer">View</a>
      {kind !== "invoice" && <button className="p-btn" disabled={busy} onClick={() => run(() => call(`/api/staff/documents/${id}/send`, "POST"))}>Send to patient</button>}
      <Msg m={msg} />
    </div>
  );
}

export function ReportUpload({ patientId }: { patientId: string }) {
  const router = useRouter(), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false), [kind, setKind] = useState("report");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg("");
    const fd = new FormData(e.currentTarget); fd.set("patient", patientId); fd.set("kind", kind);
    const picked = fd.get("file"); if (picked instanceof File) fd.set("file", await compressImage(picked));
    const r = await fetch("/api/staff/documents", { method: "POST", body: fd }).then((x) => x.json()).catch(() => ({ ok: false, error: "Network error." }));
    setBusy(false); setMsg(r.ok ? "Uploaded." : r.error); if (r.ok) { (e.target as HTMLFormElement).reset(); router.refresh(); }
  }
  return (
    <form onSubmit={go} className="glass space-y-3 p-5">
      <h2 className="text-lg">Upload a document</h2>
      <select className="p-input" aria-label="Document type" value={kind} onChange={(e) => setKind(e.target.value)}><option value="report">Report</option><option value="prescription_photo">Prescription (photo or scan)</option></select>
      <input name="file" type="file" required accept="application/pdf,image/*" className="p-input" />
      <p className="text-xs text-p-muted">PDF up to 4 MB. Photos are shrunk automatically.</p>
      <button className="p-btn w-full" disabled={busy}>{busy ? "Uploading..." : "Upload"}</button><Msg m={msg} />
    </form>
  );
}

export function StartPatientConsultationButton({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function start() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/staff/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, service: "General Plastic Surgery Consultation", mode: "in_person" }),
      });
      const data = await res.json();
      if (!data.ok || !data.appointmentId) throw new Error(data.error || "Could not start consultation.");
      router.push(`/staff/consultation/${data.appointmentId}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }

  return (
    <div>
      <button className="p-btn" disabled={busy} onClick={start}>
        {busy ? "Starting consultation..." : "+ Start new consultation"}
      </button>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
