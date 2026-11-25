import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSession } from "@/lib/session";
import { audit } from "@/lib/audit";
import { getTemplatesCatalog, saveTemplatesCatalog } from "@/lib/templates-repo";
import type { ClinicalCatalog } from "@/lib/clinical-templates";

const MedSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  dose: z.string().trim().max(80),
  freq: z.string().trim().max(80),
  days: z.string().trim().max(80),
  timing: z.string().trim().max(120).optional(),
});

const InvItemSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().trim().min(1).max(160),
  group: z.enum(["PAC Investigation", "Metabolic Workup", "Hormonal Profile", "Imaging & Scans"]),
  needsBodyPart: z.boolean().optional(),
});

const InvTplSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().trim().min(1).max(140),
  description: z.string().trim().max(240).optional(),
  items: z.array(
    z.object({
      itemId: z.string().min(1).max(80),
      name: z.string().trim().min(1).max(160),
      bodyPart: z.string().trim().max(120).optional(),
    })
  ),
});

const AdviceSchema = z.object({
  id: z.string().min(1).max(80),
  procedure: z.string().trim().min(1).max(100),
  phase: z.enum(["before_surgery", "day_of_surgery", "after_discharge"]),
  title: z.string().trim().min(1).max(160),
  content: z.string().trim().min(1).max(4000),
});

const RxPresetSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().trim().min(1).max(140),
  category: z.string().trim().min(1).max(80),
  medicines: z.array(
    z.object({
      name: z.string().trim().min(1).max(160),
      dose: z.string().trim().max(80),
      freq: z.string().trim().max(80),
      days: z.string().trim().max(80),
      timing: z.string().trim().max(120).optional(),
    })
  ),
  investigationTemplateIds: z.array(z.string().max(80)),
  extraInvestigations: z
    .array(z.object({ name: z.string().trim().min(1).max(160), bodyPart: z.string().trim().max(120).optional() }))
    .optional(),
  beforeSurgery: z.string().max(4000).optional(),
  dayOfSurgery: z.string().max(4000).optional(),
  afterDischarge: z.string().max(4000).optional(),
  advice: z.string().max(4000).optional(),
  followUp: z.string().max(240).optional(),
});

const CatalogSchema = z.object({
  version: z.number().int().min(1).default(1),
  medicines: z.array(MedSchema),
  investigations: z.array(InvItemSchema),
  investigationTemplates: z.array(InvTplSchema),
  adviceTemplates: z.array(AdviceSchema),
  rxPresets: z.array(RxPresetSchema),
});

export async function GET() {
  const s = await apiSession("settings", "consultation");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  const catalog = await getTemplatesCatalog();
  return NextResponse.json({ ok: true, catalog });
}

export async function PUT(req: Request) {
  const s = await apiSession("settings", "consultation");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = CatalogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid template payload." }, { status: 400 });
  }

  const backend = await saveTemplatesCatalog(parsed.data as ClinicalCatalog, s.uid);
  await audit(s, "updated_clinical_templates", "clinical_templates", "catalog", { backend });
  return NextResponse.json({ ok: true, backend });
}
