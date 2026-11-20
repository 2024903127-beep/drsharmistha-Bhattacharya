"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Stethoscope, User, Calendar, Loader2, X } from "lucide-react";
import { PatientRegistrationModal } from "./PatientRegistrationModal";
import { services } from "@/lib/content";

type PatientResult = {
  id: string;
  patientNo: string;
  name: string;
  phone: string;
  email: string;
  lastVisit: string;
  proc: string;
};

export function ConsultationSearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PatientResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Selected patient for consultation confirmation modal
  const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null);
  const [service, setService] = useState("Rhinoplasty");
  const [mode, setMode] = useState<"in_person" | "online">("in_person");
  const [notes, setNotes] = useState("");
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");

  const searchBoxRef = useRef<HTMLDivElement>(null);
  const procedureOptions = services.map((s) => s.name);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpenDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/patients?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.ok) {
          setResults(data.patients ?? []);
          setOpenDropdown(true);
        }
      } catch (e) {
        console.error("Patient search error:", e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function startConsultationForPatient() {
    if (!selectedPatient) return;
    setStarting(true);
    setStartError("");

    try {
      const res = await fetch("/api/staff/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient.id,
          service,
          mode,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.ok || !data.appointmentId) {
        throw new Error(data.error || "Could not start consultation.");
      }

      router.push(`/staff/consultation/${data.appointmentId}`);
    } catch (e) {
      setStartError((e as Error).message);
      setStarting(false);
    }
  }

  return (
    <div className="mb-8">
      <div className="glass p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search box */}
          <div ref={searchBoxRef} className="relative flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-p-muted" aria-hidden />
              <input
                type="text"
                className="p-input !pl-10 !pr-10 font-medium"
                placeholder="Search patient by Name, Phone, or Patient ID (e.g. PT-1001)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (results.length > 0) setOpenDropdown(true);
                }}
              />
              {loading ? (
                <Loader2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-p-muted animate-spin" />
              ) : query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                    setOpenDropdown(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-p-muted hover:text-p-text"
                >
                  <X size={16} />
                </button>
              ) : null}
            </div>

            {/* Dropdown search results */}
            {openDropdown && (
              <div className="solid absolute left-0 right-0 top-full mt-2 z-30 max-h-80 overflow-y-auto p-2 shadow-2xl animate-in fade-in duration-150">
                {results.length === 0 ? (
                  <div className="p-4 text-center text-sm text-p-muted">
                    No patients found matching &quot;{query}&quot;. Register them below.
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {results.map((p) => (
                      <li
                        key={p.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-xl hover:bg-p-mint/60 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-p-text">{p.name}</span>
                            <span className="badge b-green text-xs font-mono">{p.patientNo}</span>
                          </div>
                          <p className="mt-0.5 text-xs text-p-muted">
                            {p.phone} · Last visit: {p.lastVisit}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPatient(p);
                            setService(p.proc !== "General" ? p.proc : "Rhinoplasty");
                            setOpenDropdown(false);
                          }}
                          className="p-btn text-xs !min-h-9 whitespace-nowrap self-end sm:self-auto"
                        >
                          <Stethoscope size={14} />
                          Start consultation
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Quick Register Patient button */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <PatientRegistrationModal
              buttonLabel="+ Register New Patient"
              buttonClass="p-btn"
            />
          </div>
        </div>
      </div>

      {/* Start Consultation Modal for Existing Patient */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-p-text/40 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="solid w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-4 border-b border-p-border">
              <div>
                <h3 className="font-portal text-xl font-semibold text-p-primary">
                  Start Consultation
                </h3>
                <p className="mt-1 text-xs text-p-muted">
                  Creating a new visit session for this patient.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="grid size-8 place-items-center rounded-xl text-p-muted hover:bg-p-mint"
              >
                <X size={18} />
              </button>
            </div>

            {startError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {startError}
              </div>
            )}

            <div className="mt-4 p-3.5 rounded-xl bg-p-mint/40 border border-p-border flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-full bg-p-primary text-white font-semibold">
                {selectedPatient.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{selectedPatient.name}</span>
                  <span className="badge b-green text-xs font-mono">{selectedPatient.patientNo}</span>
                </div>
                <div className="text-xs text-p-muted mt-0.5">{selectedPatient.phone}</div>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="p-label" htmlFor="consult-service">
                  Procedure / Treatment
                </label>
                <select
                  id="consult-service"
                  className="p-input"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                >
                  {procedureOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value="General Plastic Surgery Consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label className="p-label" htmlFor="consult-mode">
                  Visit Mode
                </label>
                <select
                  id="consult-mode"
                  className="p-input"
                  value={mode}
                  onChange={(e) => setMode(e.target.value as "in_person" | "online")}
                >
                  <option value="in_person">In-Person (Hospital Visit)</option>
                  <option value="online">Online Video Call</option>
                </select>
              </div>

              <div>
                <label className="p-label" htmlFor="consult-notes">
                  Visit Notes (Optional)
                </label>
                <textarea
                  id="consult-notes"
                  rows={2}
                  className="p-input"
                  placeholder="Reason for visit, follow-up notes, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-p-border flex items-center justify-end gap-3">
              <button
                type="button"
                className="p-btn p-btn-ghost"
                disabled={starting}
                onClick={() => setSelectedPatient(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="p-btn"
                disabled={starting}
                onClick={startConsultationForPatient}
              >
                {starting ? <Loader2 size={16} className="animate-spin" /> : <Stethoscope size={16} />}
                Enter Consultation Room →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
