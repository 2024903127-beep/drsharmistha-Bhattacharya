import "server-only";
import { db, dbConfigured } from "./db";

type Actor = { uid?: string; name: string } | null;
// Never throws: a logging failure must not break the action being logged.
export async function audit(actor: Actor, action: string, entity: string, entityId?: string, meta?: object) {
  if (!dbConfigured()) return;
  try {
    await db().from("audit_log").insert({ staff_id: actor?.uid ?? null, staff_name: actor?.name ?? "System", action, entity, entity_id: entityId ?? null, meta: meta ?? null });
  } catch (e) { console.error("audit failed", e); }
}
