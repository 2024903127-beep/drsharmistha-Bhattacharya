import { apiSession } from "@/lib/session";
import { dbConfigured } from "@/lib/db";
import { getDocument, streamDocument } from "@/lib/documents";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await apiSession("consultation", "patients", "billing");
  if (!s || !dbConfigured()) return new Response("Not allowed", { status: 403 });
  const id = (await params).id, doc = await getDocument(id);
  if (!doc) return new Response("Not found", { status: 404 });
  await audit(s, "viewed_document", "document", id, { kind: doc.kind });
  return streamDocument(doc);
}
