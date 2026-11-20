"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { call } from "./Actions";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let random = "";
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `Staff@${random}!`;
}

export function TeamForm() {
  const router = useRouter();
  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    role: "receptionist",
    password: "",
    sendEmail: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{
    name: string;
    email: string;
    role: string;
    phone?: string;
    password: string;
    emailed: boolean;
    emailError?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const r = await call("/api/staff/team", "POST", f);
    setBusy(false);

    if (!r.ok) {
      setError(r.error ?? "Could not add team member.");
      return;
    }

    setSuccess({
      name: f.name,
      email: f.email,
      role: f.role,
      phone: f.phone,
      password: (r as any).passwordUsed || f.password,
      emailed: Boolean((r as any).emailed),
      emailError: (r as any).emailError,
    });

    setF({
      name: "",
      email: "",
      phone: "",
      role: "receptionist",
      password: "",
      sendEmail: true,
    });
    router.refresh();
  }

  function handleGenerate() {
    setF((prev) => ({ ...prev, password: generatePassword() }));
    setShowPassword(true);
  }

  function copyCredentials() {
    if (!success) return;
    const text = `Dr. Sharmistha Bhattacharyya Clinic Portal Login\nURL: https://drsharmisthabhattacharyya.com/staff-login\nRole: ${success.role}\nEmail: ${success.email}\nPassword: ${success.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  return (
    <div className="glass h-fit p-6 space-y-4">
      <div className="border-b border-p-border pb-3">
        <h2 className="text-xl font-serif text-p-primary">Add a team member</h2>
        <p className="text-xs text-p-muted mt-0.5">
          Create login access for doctors, receptionists, coordinators or admins.
        </p>
      </div>

      {success ? (
        <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-emerald-950">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">✓</span>
            <span className="font-semibold text-sm">Account created successfully</span>
          </div>

          <div className="rounded-lg bg-white p-3 text-xs space-y-1.5 border border-emerald-100 shadow-sm">
            <div><span className="text-gray-500">Name:</span> <strong className="text-gray-900">{success.name}</strong></div>
            <div><span className="text-gray-500">Role:</span> <strong className="capitalize text-gray-900">{success.role}</strong></div>
            <div><span className="text-gray-500">Login ID / Email:</span> <span className="font-mono text-emerald-800">{success.email}</span></div>
            {success.phone && <div><span className="text-gray-500">Phone:</span> <span className="text-gray-900">{success.phone}</span></div>}
            <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-gray-500 block">Password:</span>
                <code className="font-mono font-bold text-emerald-900 text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {success.password}
                </code>
              </div>
              <button
                type="button"
                onClick={copyCredentials}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-p-primary text-white hover:opacity-90"
              >
                {copied ? "Copied ✓" : "Copy details"}
              </button>
            </div>
          </div>

          {success.emailed ? (
            <p className="text-xs text-emerald-800 flex items-center gap-1.5">
              <span>✉️</span> Welcome email with login instructions sent via Brevo.
            </p>
          ) : (
            <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded border border-amber-200">
              ⚠️ Email notice: {success.emailError || "Email not delivered. Please share the login details above directly with the staff member."}
            </p>
          )}

          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="p-btn p-btn-ghost w-full text-xs"
          >
            + Add another team member
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3.5">
          <div>
            <label className="p-label" htmlFor="tn">Full name *</label>
            <input
              id="tn"
              className="p-input"
              placeholder="e.g. Dr. Priya Singh"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="p-label" htmlFor="te">Email address (Gmail / login ID) *</label>
            <input
              id="te"
              type="email"
              className="p-input"
              placeholder="priya.singh@gmail.com"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="p-label" htmlFor="tp">Phone number (optional)</label>
            <input
              id="tp"
              type="tel"
              className="p-input"
              placeholder="+91 98765 43210"
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="p-label" htmlFor="tr">Role *</label>
            <select
              id="tr"
              className="p-input"
              value={f.role}
              onChange={(e) => setF({ ...f, role: e.target.value })}
            >
              <option value="receptionist">Receptionist (Appointments, Enquiries &amp; Patients)</option>
              <option value="doctor">Doctor (Consultation Room, Medical Records &amp; Patients)</option>
              <option value="coordinator">Coordinator (Patients, Leads, Bookings &amp; Messages)</option>
              <option value="admin">Admin (Full administrative &amp; billing access)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="p-label" htmlFor="tpw">Login Password</label>
              <button
                type="button"
                onClick={handleGenerate}
                className="text-xs text-p-primary underline hover:opacity-80"
              >
                Generate strong password
              </button>
            </div>
            <div className="relative">
              <input
                id="tpw"
                type={showPassword ? "text" : "password"}
                className="p-input pr-16"
                placeholder="Set password (or generate)"
                value={f.password}
                onChange={(e) => setF({ ...f, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-p-muted hover:text-p-primary font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-p-muted">
              Leave blank to automatically generate a secure password.
            </p>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="sendEmail"
              checked={f.sendEmail}
              onChange={(e) => setF({ ...f, sendEmail: e.target.checked })}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-p-primary focus:ring-p-primary"
            />
            <label htmlFor="sendEmail" className="text-xs text-p-muted leading-tight">
              Send welcome email with login ID, password, and portal link via Brevo
            </label>
          </div>

          {error && <p role="alert" className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded border border-rose-200">{error}</p>}

          <button className="p-btn w-full mt-2" disabled={busy}>
            {busy ? "Creating account & sending email..." : "Add team member"}
          </button>
        </form>
      )}
    </div>
  );
}
