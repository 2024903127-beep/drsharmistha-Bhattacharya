"use client";

import { useState } from "react";
import { CheckCircle2, RefreshCw, Send, AlertTriangle, Info, KeyRound } from "lucide-react";
import type { MetaTemplateItem, WaTemplateSlot } from "@/lib/integrations/whatsapp";

type ConfigSummary = {
  configured: boolean;
  lang: string;
  fallbackEnabled: boolean;
  wabaConfigured: boolean;
  cronConfigured: boolean;
  slots: Array<WaTemplateSlot & { activeName: string; overridden: boolean }>;
};

type MetaSummary = {
  wabaConfigured: boolean;
  templates: MetaTemplateItem[];
  error?: string;
};

type TestResponse = {
  ok: boolean;
  skipped?: boolean;
  id?: string;
  error?: string;
  templateUsed?: string;
  languageUsed?: string;
};

const SAMPLE_PRESETS: Record<string, { params: string[]; buttonToken?: string; langHint?: string }> = {
  hello_world: { params: [], langHint: "en_US" },
  booking_confirmation: {
    params: ["Test Patient", "Rhinoplasty", "28 November 2026", "11:00 AM", "https://meet.google.com/test-demo"],
  },
  payment_receipt: {
    params: ["Test Patient", "1500", "INV-2026-0001"],
    buttonToken: "sample-token",
  },
  appointment_reminder: {
    params: ["Test Patient", "28 November 2026", "11:00 AM", "https://meet.google.com/test-demo"],
  },
  appointment_rescheduled: {
    params: ["Test Patient", "29 November 2026", "04:00 PM", "https://meet.google.com/test-demo"],
  },
  appointment_cancelled: {
    params: ["Test Patient", "28 November 2026"],
  },
  prescription_ready: {
    params: ["Test Patient"],
    buttonToken: "sample-token",
  },
  report_ready: {
    params: ["Test Patient"],
    buttonToken: "sample-token",
  },
  followup_checkin: {
    params: ["Test Patient"],
  },
};

export function WhatsAppDiagnostics({
  initialConfig,
  initialMeta,
}: {
  initialConfig: ConfigSummary;
  initialMeta: MetaSummary;
}) {
  const [config, setConfig] = useState<ConfigSummary>(initialConfig);
  const [meta, setMeta] = useState<MetaSummary>(initialMeta);
  const [refreshing, setRefreshing] = useState(false);

  const [preset, setPreset] = useState<string>("hello_world");
  const [customName, setCustomName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [language, setLanguage] = useState<string>("en_US");
  const [paramsText, setParamsText] = useState<string>("");
  const [buttonToken, setButtonToken] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<TestResponse | null>(null);

  function selectPreset(next: string) {
    setPreset(next);
    setResult(null);
    if (next === "__custom__") {
      setLanguage(config.lang);
      setParamsText("");
      setButtonToken("");
      return;
    }
    const sample = SAMPLE_PRESETS[next];
    if (sample) {
      setParamsText(sample.params.join("\n"));
      setButtonToken(sample.buttonToken ?? "");
      setLanguage(sample.langHint ?? config.lang);
    }
  }

  async function refreshMeta() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/staff/whatsapp/test", { cache: "no-store" });
      const data = await res.json();
      if (data.ok) {
        setConfig(data.config);
        setMeta(data.meta);
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function sendTest(e: React.FormEvent) {
    e.preventDefault();
    const targetName = preset === "__custom__" ? customName.trim() : preset;
    if (!targetName || !phone.trim()) return;
    setSending(true);
    setResult(null);
    try {
      const params = paramsText
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean);
      const res = await fetch("/api/staff/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: phone.trim(),
          templateName: targetName,
          language: language.trim() || undefined,
          params,
          buttonToken: buttonToken.trim() || undefined,
        }),
      });
      const data = (await res.json()) as TestResponse;
      setResult(data);
    } catch {
      setResult({ ok: false, error: "Network error calling test endpoint." });
    } finally {
      setSending(false);
    }
  }

  function findMetaStatus(templateName: string): MetaTemplateItem | undefined {
    return meta.templates.find((t) => t.name === templateName && t.language === config.lang)
      ?? meta.templates.find((t) => t.name === templateName);
  }

  return (
    <div className="space-y-6">
      {/* Architecture & Env Diagnostic Banner */}
      <div className="solid p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg">WhatsApp Cloud API &amp; Vercel Triggers</h2>
            <p className="mt-1 text-xs text-p-muted">
              No external Railway or Render server is required for patient notifications. Instant alerts trigger from Vercel API routes; scheduled reminders use <code>/api/cron/reminders</code>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`badge ${config.configured ? "b-green" : "b-red"}`}>
              {config.configured ? "WhatsApp API Connected" : "WhatsApp Not Configured"}
            </span>
            <span className="badge b-blue">Lang: {config.lang}</span>
            <span className={`badge ${config.cronConfigured ? "b-green" : "b-amber"}`}>
              {config.cronConfigured ? "Cron Secret Set" : "CRON_SECRET Not Set"}
            </span>
            <span className={`badge ${config.wabaConfigured ? "b-green" : "b-grey"}`}>
              {config.wabaConfigured ? "WABA ID Set" : "WABA ID Optional"}
            </span>
          </div>
        </div>

        <div className="grid gap-3 rounded-xl border border-p-border bg-white p-4 text-xs text-p-muted md:grid-cols-2">
          <div className="flex gap-2.5">
            <Info size={16} className="mt-0.5 shrink-0 text-p-primary" />
            <div className="space-y-1">
              <p className="font-semibold text-p-primary">Why messages only arrived after sending &ldquo;Hi&rdquo;</p>
              <p>
                Meta WhatsApp Cloud API blocks free-form text outside a 24-hour patient reply window. Outside 24 hours, Meta only delivers{" "}
                <strong>Approved Templates</strong> matching exact <strong>Template Name + Language Code</strong> (e.g. <code>en</code> vs <code>en_US</code>). When a template fails, this portal now logs the exact Meta error instead of hiding behind 24h fallback text.
              </p>
            </div>
          </div>
          <div className="flex gap-2.5">
            <KeyRound size={16} className="mt-0.5 shrink-0 text-p-primary" />
            <div className="space-y-1">
              <p className="font-semibold text-p-primary">Vercel Environment Variables Supported</p>
              <p>
                Set <code>WHATSAPP_TEMPLATE_*</code> in Vercel if your Meta Business Manager uses custom template names, verify <code>WHATSAPP_LANG</code> (<code>en</code> or <code>en_US</code>), and optionally set <code>WHATSAPP_WABA_ID</code> to inspect live Meta approvals below. For 24h/1h reminders on Vercel Free, ping <code>/api/cron/reminders</code> via cron-job.org with <code>Authorization: Bearer CRON_SECRET</code>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Template Mapping Table + Live Tester Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_.9fr]">
        <div className="solid p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg">Template Mapping &amp; Vercel Overrides</h2>
              <p className="text-xs text-p-muted">
                Every clinic trigger uses the default name unless overridden by its Vercel env variable.
              </p>
            </div>
            <button type="button" onClick={refreshMeta} disabled={refreshing} className="p-btn p-btn-ghost !min-h-8 px-3 text-xs">
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} /> Refresh Meta Status
            </button>
          </div>

          {meta.error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              Meta WABA lookup failed: {meta.error}
            </div>
          )}

          <div className="overflow-x-auto pad-scroll">
            <table className="w-full text-left text-xs" style={{ minWidth: "36rem" }}>
              <thead>
                <tr className="border-b border-p-border text-p-muted">
                  <th className="py-2 pr-3 font-semibold">Active Name</th>
                  <th className="py-2 pr-3 font-semibold">Sent When</th>
                  <th className="py-2 pr-3 font-semibold">Vercel Override Var</th>
                  <th className="py-2 font-semibold">Meta Status</th>
                </tr>
              </thead>
              <tbody>
                {config.slots.map((slot) => {
                  const found = findMetaStatus(slot.activeName);
                  return (
                    <tr key={slot.key} className="border-b border-p-border/70 last:border-0">
                      <td className="py-2.5 pr-3 align-top">
                        <code className="font-semibold text-p-primary">{slot.activeName}</code>
                        <div className="mt-0.5 text-[11px] text-p-muted">
                          {slot.paramLabels.length} var{slot.paramLabels.length === 1 ? "" : "s"}
                          {slot.hasUrlButton ? " + URL btn" : ""}
                          {slot.overridden && <span className="ml-1.5 rounded bg-p-mint px-1.5 py-0.5 text-[10px] font-semibold text-p-primary">Env override</span>}
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 align-top text-p-text">{slot.trigger}</td>
                      <td className="py-2.5 pr-3 align-top">
                        <code className="rounded bg-white px-1.5 py-0.5 text-[11px] border border-p-border">{slot.envVar}</code>
                      </td>
                      <td className="py-2.5 align-top">
                        {meta.wabaConfigured ? (
                          found ? (
                            <div>
                              <span className={`badge ${found.status === "APPROVED" ? "b-green" : found.status === "PENDING" ? "b-amber" : "b-red"}`}>
                                {found.status}
                              </span>
                              <div className="mt-0.5 text-[10px] text-p-muted">{found.language}</div>
                            </div>
                          ) : (
                            <span className="badge b-red">Not found in WABA</span>
                          )
                        ) : (
                          <span className="text-[11px] text-p-muted">Test on right or set WABA ID</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Strict Template Test Panel */}
        <form onSubmit={sendTest} className="solid p-5 space-y-3 h-fit">
          <div>
            <h2 className="text-lg">Live Template Test (Strict)</h2>
            <p className="mt-0.5 text-xs text-p-muted">
              Sends <code>type: &quot;template&quot;</code> directly to Meta without 24h plain-text fallback so you see if outside-24h delivery works.
            </p>
          </div>

          <div>
            <label className="p-label" htmlFor="wa-preset">Template to Test</label>
            <select id="wa-preset" className="p-input" value={preset} onChange={(e) => selectPreset(e.target.value)}>
              <option value="hello_world">hello_world (Meta built-in starter — 0 vars)</option>
              {config.slots.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.activeName} ({s.paramLabels.length} vars{s.hasUrlButton ? " + URL" : ""})
                </option>
              ))}
              <option value="__custom__">Custom Meta template name...</option>
            </select>
          </div>

          {preset === "__custom__" && (
            <div>
              <label className="p-label" htmlFor="wa-custom-name">Meta Template Name *</label>
              <input
                id="wa-custom-name"
                required
                className="p-input"
                placeholder="Exact template name from Meta WhatsApp Manager"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="p-label" htmlFor="wa-phone">Recipient Phone *</label>
              <input
                id="wa-phone"
                required
                className="p-input"
                placeholder="+91 98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="p-label" htmlFor="wa-lang">Language Code</label>
              <input
                id="wa-lang"
                className="p-input"
                placeholder="en or en_US"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="p-label" htmlFor="wa-params">Body Variables (one per line)</label>
            <textarea
              id="wa-params"
              rows={3}
              className="p-input text-xs leading-relaxed"
              placeholder="Leave blank for hello_world or no-variable templates"
              value={paramsText}
              onChange={(e) => setParamsText(e.target.value)}
            />
          </div>

          {((preset !== "__custom__" && SAMPLE_PRESETS[preset]?.buttonToken !== undefined) || buttonToken) && (
            <div>
              <label className="p-label" htmlFor="wa-btn-token">URL Button Suffix ({"{{1}}"})</label>
              <input
                id="wa-btn-token"
                className="p-input text-xs"
                placeholder="e.g. sample-token"
                value={buttonToken}
                onChange={(e) => setButtonToken(e.target.value)}
              />
            </div>
          )}

          <button type="submit" disabled={sending || !config.configured} className="p-btn w-full">
            <Send size={15} /> {sending ? "Sending to Meta..." : "Send Test Template"}
          </button>

          {result && (
            <div className={`rounded-xl border p-3 text-xs ${result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-rose-200 bg-rose-50 text-rose-900"}`}>
              <div className="flex items-start gap-2">
                {result.ok ? <CheckCircle2 size={15} className="mt-0.5 shrink-0" /> : <AlertTriangle size={15} className="mt-0.5 shrink-0" />}
                <div className="space-y-1 break-all">
                  <p className="font-semibold">
                    {result.ok ? "Template accepted by Meta!" : "Meta rejected template"}
                  </p>
                  {result.templateUsed && (
                    <p>Template: <code>{result.templateUsed}</code> ({result.languageUsed})</p>
                  )}
                  {result.id && <p>Message ID: <code>{result.id}</code></p>}
                  {result.error && <p>{result.error}</p>}
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
