import "server-only";
import { db, dbConfigured } from "./db";
import { getFile, putFile, r2Configured } from "./integrations/r2";
import { DEFAULT_CATALOG, type ClinicalCatalog } from "./clinical-templates";

const R2_CATALOG_KEY = "clinic-config/clinical-templates.json";
const CATALOG_ROW_KEY = "catalog";

let cachedCatalog: { data: ClinicalCatalog; exp: number } | null = null;

export type RxMedicineEntry = {
  name: string;
  dose: string;
  freq: string;
  days: string;
  timing?: string;
};

export type RxInvestigationEntry = {
  name: string;
  bodyPart?: string;
};

export type RxSnapshot = {
  notes?: string;
  medicines: RxMedicineEntry[];
  investigations: RxInvestigationEntry[];
  beforeSurgery?: string;
  dayOfSurgery?: string;
  afterDischarge?: string;
  advice?: string;
  followUp?: string;
  savedAt?: string;
  service?: string;
};

async function readStreamJson<T>(stream: ReadableStream): Promise<T | null> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(text) as T;
}

function normalizeCatalog(raw?: Partial<ClinicalCatalog> | null): ClinicalCatalog {
  if (!raw) return DEFAULT_CATALOG;
  return {
    version: raw.version ?? 1,
    medicines: Array.isArray(raw.medicines) ? raw.medicines : DEFAULT_CATALOG.medicines,
    investigations: Array.isArray(raw.investigations) ? raw.investigations : DEFAULT_CATALOG.investigations,
    investigationTemplates: Array.isArray(raw.investigationTemplates)
      ? raw.investigationTemplates
      : DEFAULT_CATALOG.investigationTemplates,
    adviceTemplates: Array.isArray(raw.adviceTemplates)
      ? raw.adviceTemplates
      : DEFAULT_CATALOG.adviceTemplates,
    rxPresets: Array.isArray(raw.rxPresets) ? raw.rxPresets : DEFAULT_CATALOG.rxPresets,
  };
}

export async function getTemplatesCatalog(): Promise<ClinicalCatalog> {
  const now = Date.now();
  if (cachedCatalog && now < cachedCatalog.exp) return cachedCatalog.data;

  // 1. Try Supabase clinical_templates table if configured
  if (dbConfigured()) {
    try {
      const { data, error } = await db()
        .from("clinical_templates")
        .select("payload")
        .eq("key", CATALOG_ROW_KEY)
        .maybeSingle();
      if (!error && data?.payload) {
        const normalized = normalizeCatalog(data.payload as Partial<ClinicalCatalog>);
        cachedCatalog = { data: normalized, exp: now + 60_000 };
        return normalized;
      }
    } catch {
      // Fallback below if migration 0002 has not been applied yet
    }
  }

  // 2. Fallback to Cloudflare R2 JSON (or local .data in dev)
  if (r2Configured() || process.env.NODE_ENV !== "production") {
    try {
      const stream = await getFile(R2_CATALOG_KEY);
      const parsed = await readStreamJson<Partial<ClinicalCatalog>>(stream);
      const normalized = normalizeCatalog(parsed);
      cachedCatalog = { data: normalized, exp: now + 60_000 };
      return normalized;
    } catch {
      // File not yet stored; use built-in clinical catalog defaults
    }
  }

  cachedCatalog = { data: DEFAULT_CATALOG, exp: now + 60_000 };
  return DEFAULT_CATALOG;
}

export async function saveTemplatesCatalog(
  catalog: ClinicalCatalog,
  staffId?: string
): Promise<"supabase" | "r2" | "local"> {
  const clean = normalizeCatalog(catalog);
  cachedCatalog = { data: clean, exp: Date.now() + 60_000 };

  if (dbConfigured()) {
    try {
      const { error } = await db().from("clinical_templates").upsert({
        key: CATALOG_ROW_KEY,
        payload: clean,
        updated_by: staffId ?? null,
        updated_at: new Date().toISOString(),
      });
      if (!error) return "supabase";
    } catch {
      // Continue to R2 fallback when 0002 migration has not been run yet
    }
  }

  const buf = Buffer.from(JSON.stringify(clean, null, 2), "utf8");
  await putFile(R2_CATALOG_KEY, buf, "application/json");
  return r2Configured() ? "r2" : "local";
}

export async function getLastRxSnapshot(patientId: string): Promise<RxSnapshot | null> {
  if (!patientId) return null;

  if (dbConfigured()) {
    try {
      const { data, error } = await db()
        .from("patient_rx_snapshots")
        .select("payload")
        .eq("patient_id", patientId)
        .maybeSingle();
      if (!error && data?.payload) return data.payload as RxSnapshot;
    } catch {
      // Fallback cleanly to R2
    }
  }

  if (r2Configured() || process.env.NODE_ENV !== "production") {
    try {
      const stream = await getFile(`patients/${patientId}/last-rx.json`);
      return await readStreamJson<RxSnapshot>(stream);
    } catch {
      return null;
    }
  }
  return null;
}

export async function saveLastRxSnapshot(
  patientId: string,
  appointmentId: string | null,
  snapshot: RxSnapshot,
  staffId?: string
): Promise<void> {
  if (!patientId) return;
  const enriched: RxSnapshot = { ...snapshot, savedAt: new Date().toISOString() };

  if (dbConfigured()) {
    try {
      const { error } = await db().from("patient_rx_snapshots").upsert({
        patient_id: patientId,
        appointment_id: appointmentId,
        payload: enriched,
        updated_by: staffId ?? null,
        updated_at: new Date().toISOString(),
      });
      if (!error) return;
    } catch {
      // Fallback cleanly to R2
    }
  }

  if (r2Configured() || process.env.NODE_ENV !== "production") {
    const buf = Buffer.from(JSON.stringify(enriched), "utf8");
    await putFile(`patients/${patientId}/last-rx.json`, buf, "application/json");
  }
}
