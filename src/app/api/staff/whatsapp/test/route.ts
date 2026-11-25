import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSession } from "@/lib/session";
import { dbConfigured } from "@/lib/db";
import { audit } from "@/lib/audit";
import { listMetaTemplates, sendTemplate, whatsappConfigSummary } from "@/lib/integrations/whatsapp";

const testBody = z.object({
  to: z.string().trim().min(8).max(24),
  templateName: z.string().trim().min(1).max(128),
  language: z.string().trim().max(20).optional(),
  params: z.array(z.string().max(400)).max(10).optional().default([]),
  buttonToken: z.string().trim().max(200).optional(),
});

export async function GET() {
  const s = await apiSession("messages");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  const [config, meta] = [whatsappConfigSummary(), await listMetaTemplates()];
  return NextResponse.json({ ok: true, config, meta });
}

export async function POST(req: Request) {
  const s = await apiSession("messages");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });

  const parsed = testBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a valid phone number and template name." }, { status: 400 });
  }

  const d = parsed.data;
  const result = await sendTemplate({
    to: d.to,
    name: d.templateName,
    language: d.language || undefined,
    params: d.params,
    buttonToken: d.buttonToken || undefined,
    allowFallback: false,
  });

  if (dbConfigured()) {
    await audit(s, "tested_whatsapp_template", "whatsapp", result.templateUsed ?? d.templateName, {
      ok: result.ok,
      language: result.languageUsed,
      error: result.error,
    }).catch(() => {});
  }

  return NextResponse.json(result, { status: result.ok ? 200 : result.skipped ? 503 : 422 });
}
