"use client";
import { useState } from "react";

const field = "mt-1.5 min-h-12 w-full rounded-xl border border-forest/25 bg-white px-4 text-base";

export function LeadForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", message: "", website_hp: "" });
  const [state, setState] = useState<"idle" | "busy" | "ok" | string>("idle");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setState("busy");
    const r = await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, attribution: { landing_page: location.href, referrer: document.referrer } }) }).then((x) => x.json()).catch(() => ({ ok: false }));
    setState(r.ok ? "ok" : r.error || "Something went wrong. Please call us instead.");
  }
  if (state === "ok") return <p role="status" className="border border-forest/20 bg-white p-6 text-forest">Thank you. Our coordinator will contact you on WhatsApp or phone, Monday to Saturday.</p>;
  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <label className="block text-sm font-medium">Name<input className={field} value={f.name} onChange={set("name")} autoComplete="name" required /></label>
      <label className="block text-sm font-medium">Mobile number<input className={field} value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" required /></label>
      <label className="block text-sm font-medium">Email (optional)<input className={field} type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
      <label className="block text-sm font-medium">How can we help?<textarea className={`${field} py-3`} rows={4} value={f.message} onChange={set("message")} maxLength={1000} /></label>
      <input type="text" value={f.website_hp} onChange={set("website_hp")} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {state !== "idle" && state !== "busy" && <p role="alert" className="text-sm font-medium text-red-700">{state}</p>}
      <button className="btn btn-forest" disabled={state === "busy"}>{state === "busy" ? "Sending..." : "Send enquiry"}</button>
    </form>
  );
}
