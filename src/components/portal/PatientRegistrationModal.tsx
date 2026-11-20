"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Stethoscope, X, Loader2 } from "lucide-react";
import { services } from "@/lib/content";

interface PatientRegistrationModalProps {
  buttonLabel?: string;
  buttonClass?: string;
  defaultStartConsultation?: boolean;
  onSuccess?: () => void;
}

export function PatientRegistrationModal({
  buttonLabel = "+ Register new patient",
  buttonClass = "p-btn",
  defaultStartConsultation = false,
  onSuccess,
}: PatientRegistrationModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("Rhinoplasty");
  const [customService, setCustomService] = useState("");
  const [mode, setMode] = useState<"in_person" | "online">("in_person");
  const [notes, setNotes] = useState("");

  const procedureOptions = services.map((s) => s.name);

  async function submit(startConsultation: boolean) {
    setError("");
    if (!name.trim()) {
      setError("Please enter the patient's full name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter the patient's phone number.");
      return;
    }

    setBusy(true);
    try {
      const selectedProcedure = service === "Other" ? (customService.trim() || "General Consultation") : service;

      const res = await fetch("/api/staff/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          service: selectedProcedure,
          mode,
          notes: notes.trim() || undefined,
          startConsultation,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        throw new Error(data.error || "Failed to register patient.");
      }

      setOpen(false);
      resetForm();

      if (startConsultation && data.appointmentId) {
        router.push(`/staff/consultation/${data.appointmentId}`);
      } else {
        router.refresh();
        if (onSuccess) onSuccess();
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setService("Rhinoplasty");
    setCustomService("");
    setMode("in_person");
    setNotes("");
    setError("");
  }

  return (
    <>
      <button
        type="button"
        className={buttonClass}
        onClick={() => {
          resetForm();
          setOpen(true);
        }}
      >
        <UserPlus size={16} aria-hidden />
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-p-text/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="solid w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-p-border">
              <div>
                <h2 className="font-portal text-2xl font-semibold text-p-primary">Register Patient</h2>
                <p className="mt-1 text-xs text-p-muted">
                  Assigns a permanent Unique Patient ID (UHID) to keep all records, consultations, and prescriptions unified.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-xl text-p-muted hover:bg-p-mint transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {error}
              </div>
            )}

            {/* Form */}
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="p-label" htmlFor="reg-name">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-name"
                    className="p-input"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="p-label" htmlFor="reg-phone">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    className="p-input font-mono"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="p-label" htmlFor="reg-email">
                  Email Address (Optional)
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="p-input"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="p-label" htmlFor="reg-service">
                    Procedure / Interest
                  </label>
                  <select
                    id="reg-service"
                    className="p-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    {procedureOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                    <option value="Other">Other / General Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="p-label" htmlFor="reg-mode">
                    Visit Mode
                  </label>
                  <select
                    id="reg-mode"
                    className="p-input"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as "in_person" | "online")}
                  >
                    <option value="in_person">In-Person (Hospital Visit)</option>
                    <option value="online">Online Video Consultation</option>
                  </select>
                </div>
              </div>

              {service === "Other" && (
                <div>
                  <label className="p-label" htmlFor="reg-custom-service">
                    Specify Procedure
                  </label>
                  <input
                    id="reg-custom-service"
                    className="p-input"
                    placeholder="e.g. Scar Revision, Lipoma Excision"
                    value={customService}
                    onChange={(e) => setCustomService(e.target.value)}
                  />
                </div>
              )}

              <div>
                <label className="p-label" htmlFor="reg-notes">
                  Chief Concern / Initial Notes (Optional)
                </label>
                <textarea
                  id="reg-notes"
                  rows={2}
                  className="p-input"
                  placeholder="Patient's primary concern or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 pt-4 border-t border-p-border flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                className="p-btn p-btn-ghost w-full sm:w-auto"
                disabled={busy}
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="p-btn p-btn-ghost w-full sm:w-auto"
                disabled={busy}
                onClick={() => submit(false)}
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Register Only
              </button>
              <button
                type="button"
                className="p-btn w-full sm:w-auto"
                disabled={busy}
                onClick={() => submit(true)}
              >
                {busy ? <Loader2 size={16} className="animate-spin" /> : <Stethoscope size={16} />}
                Register &amp; Start Consultation →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
