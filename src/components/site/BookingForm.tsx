"use client";
import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Video } from "lucide-react";

type Opt = { group: string; items: string[] };
declare global { interface Window { Razorpay?: new (o: Record<string, unknown>) => { open(): void } } }

const field = "mt-1.5 min-h-12 w-full rounded-xl border border-forest/25 bg-white px-4 text-base text-ink focus:border-forest";

function loadRazorpay() {
  return new Promise<boolean>((res) => {
    if (window.Razorpay) return res(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => res(true); s.onerror = () => res(false);
    document.body.appendChild(s);
  });
}

export function BookingForm({ options, feeInr, defaultService = "" }: { options: Opt[]; feeInr: number; defaultService?: string }) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [f, setF] = useState({ name: "", phone: "", email: "", service: defaultService, date: "", time: "", message: "", website_hp: "" });
  const [slots, setSlots] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<null | { ref: string }>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (!f.date) return;
    setSlots(null); setF((p) => ({ ...p, time: "" }));
    fetch(`/api/slots?date=${f.date}`).then((r) => r.json()).then((d) => setSlots(d.slots ?? [])).catch(() => setSlots([]));
  }, [f.date]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setBusy(true);
    try {
      const q = new URLSearchParams(location.search);
      const attribution: Record<string, string> = { landing_page: location.href, referrer: document.referrer, captured_at: new Date().toISOString() };
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((k) => q.get(k) && (attribution[k] = q.get(k)!));
      const r = await fetch("/api/booking/create-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, attribution }) });
      const o = await r.json();
      if (!o.ok) throw new Error(o.error || "Could not start booking.");
      const verify = async (extra: object) => {
        const v = await (await fetch("/api/booking/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingRef: o.bookingRef, ...extra }) })).json();
        if (!v.ok) throw new Error(v.error || "Payment could not be verified. If money was deducted, call us.");
        setDone({ ref: o.bookingRef });
      };
      if (o.demo) return await verify({ demo: true });
      if (!(await loadRazorpay())) throw new Error("Could not load the payment window. Check your connection.");
      new window.Razorpay!({
        key: o.keyId, amount: o.amount, currency: o.currency, order_id: o.orderId, name: "Dr. Sharmistha Bhattacharyya",
        description: "Online consultation fee", prefill: { name: f.name, email: f.email, contact: f.phone }, theme: { color: "#173D32" },
        handler: (resp: Record<string, string>) => verify(resp).catch((x) => setErr(x.message)).finally(() => setBusy(false)),
        modal: { ondismiss: () => setBusy(false) },
      }).open();
      return;
    } catch (x) { setErr((x as Error).message); }
    setBusy(false);
  }

  if (done) return (
    <div role="status" className="border border-forest/20 bg-white p-8">
      <CalendarCheck className="text-gold-deep" aria-hidden />
      <h2 className="mt-4 font-display text-3xl text-forest">Your consultation is booked</h2>
      <p className="mt-3 text-stone">Reference <strong className="text-ink">{done.ref}</strong>. We will send the confirmation and Google Meet link on WhatsApp and email shortly. For changes, call or message us on WhatsApp.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-6 border border-forest/15 bg-white p-6 md:p-8" noValidate>
      <div className="flex items-start gap-3 bg-sage p-4 text-sm text-forest"><Video size={20} className="mt-0.5 shrink-0" aria-hidden /><p>Online video consultation with Dr. Sharmistha on Google Meet. Consultation fee <strong>Rs. {feeInr.toLocaleString("en-IN")}</strong>, paid securely online to confirm your slot.</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-medium">Full name<input className={field} value={f.name} onChange={set("name")} autoComplete="name" required /></label>
        <label className="block text-sm font-medium">Mobile number<input className={field} value={f.phone} onChange={set("phone")} inputMode="tel" autoComplete="tel" required /></label>
        <label className="block text-sm font-medium">Email (for your receipt)<input className={field} type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
        <label className="block text-sm font-medium">Procedure of interest
          <select className={field} value={f.service} onChange={set("service")} required>
            <option value="">Choose</option><option>General consultation</option>
            {options.map((g) => <optgroup key={g.group} label={g.group}>{g.items.map((i) => <option key={i}>{i}</option>)}</optgroup>)}
          </select>
        </label>
        <label className="block text-sm font-medium">Preferred date<input className={field} type="date" min={today} value={f.date} onChange={set("date")} required /></label>
      </div>
      {f.date && (
        <fieldset>
          <legend className="text-sm font-medium">Available times (IST)</legend>
          {slots === null ? <p className="mt-2 text-sm text-stone">Checking availability...</p> : slots.length === 0 ? <p className="mt-2 text-sm text-stone">No slots on this day. The clinic is closed on Sundays. Pick another date.</p> : (
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((t) => (
                <button type="button" key={t} aria-pressed={f.time === t} onClick={() => setF((p) => ({ ...p, time: t }))}
                  className={`min-h-12 min-w-24 rounded-xl border px-4 text-sm font-medium ${f.time === t ? "border-forest bg-forest text-ivory" : "border-forest/25 bg-white text-forest hover:border-forest"}`}>
                  {new Date(`2000-01-01T${t}`).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })}
                </button>
              ))}
            </div>
          )}
        </fieldset>
      )}
      <label className="block text-sm font-medium">Your goals or questions (optional)<textarea className={`${field} py-3`} rows={4} value={f.message} onChange={set("message")} maxLength={1000} /></label>
      <input type="text" name="website_hp" value={f.website_hp} onChange={set("website_hp")} tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      {err && <p role="alert" className="text-sm font-medium text-red-700">{err}</p>}
      <button className="btn btn-forest w-full disabled:opacity-60 md:w-auto" disabled={busy || !f.time}>{busy ? "Please wait..." : `Pay Rs. ${feeInr.toLocaleString("en-IN")} and confirm`}</button>
      <p className="text-xs text-stone">This fee is for the online consultation only. Surgery fees are never collected online; they are quoted in writing after examination.</p>
    </form>
  );
}
