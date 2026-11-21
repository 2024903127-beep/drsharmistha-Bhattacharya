"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ next, demo }: { next: string; demo: boolean }) {
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await fetch("/api/staff/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    }).then((x) => x.json()).catch(() => ({ ok: false, error: "Network error. Try again." }));

    if (r.ok) {
      const dest = next && next.startsWith("/staff") ? next : "/staff/dashboard";
      window.location.href = dest;
    } else {
      setErr(r.error || "Could not sign in.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="p-label" htmlFor="email">Email or staff ID</label>
        <input
          id="email"
          className="p-input"
          type="email"
          autoComplete="username"
          placeholder="dr.sharmistha.bhattacharyya@gmail.com"
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="p-label" htmlFor="pw">Password</label>
        <input
          id="pw"
          className="p-input"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
          required
        />
      </div>
      {err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}
      <button className="p-btn w-full" disabled={busy}>
        {busy ? "Signing in..." : "Sign in securely"}
      </button>
      <p className="text-center text-xs text-p-muted pt-2">
        Staff portal credentials are administered by Dr. Sharmistha. For account assistance or password resets, contact the clinic admin.
      </p>
      {demo && (
        <p className="rounded-xl bg-p-mint p-3 text-xs text-p-muted">
          Demo sign-in (development only). Owner: dr.sharmistha@demo.local. Others: doctor@, reception@, coordinator@demo.local. Password: Demo@12345
        </p>
      )}
    </form>
  );
}
