import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { audit } from "@/lib/audit";

const schema = z.object({ slug: z.string().regex(/^services\/[a-z0-9-]+$/), title: z.string().trim().max(70).optional(), description: z.string().trim().max(200).optional() });

export async function PUT(req: Request) {
  const s = await apiSession("content");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Connect the database to edit SEO fields." }, { status: 503 });
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: "Title up to 70 and description up to 200 characters." }, { status: 400 });
  const { slug, title, description } = p.data;
  const { error } = await db().from("page_overrides").upsert({ slug, title: title || null, description: description || null, updated_by: s.uid, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ ok: false, error: "Could not save." }, { status: 500 });
  revalidatePath(`/${slug}`);
  await audit(s, "edited_seo", "page", slug);
  return NextResponse.json({ ok: true });
}
