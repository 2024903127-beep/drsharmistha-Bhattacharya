import { readDocToken, getDocument, streamDocument } from "@/lib/documents";
import { dbConfigured } from "@/lib/db";
import { allow, clientIp } from "@/lib/ratelimit";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";
const no = (s: number, m: string) => new Response(m, { status: s, headers: { "X-Robots-Tag": "noindex" } });

// Patients open documents (receipt, prescription, report) through this signed, expiring link. No patient login.
export async function GET(req: Request, { params }: { params: Promise<{ token: string }> }) {
  if (!dbConfigured()) return no(503, "Not available");
  if (!(await allow(`doc:${clientIp(req)}`, 30, 600))) return no(429, "Too many requests");
  const id = await readDocToken((await params).token);
  if (!id) return no(404, "This link has expired or is not valid. Please contact the clinic for a new link.");
  const doc = await getDocument(id);
  if (!doc) return no(404, "Document not found.");
  await audit({ name: "Patient (secure link)" }, "opened_document", "document", id, { kind: doc.kind });
  return streamDocument(doc);
}
