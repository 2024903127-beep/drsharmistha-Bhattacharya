import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSession, invalidateStaffCache } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { EmailService } from "@/lib/integrations/brevo";
import { audit } from "@/lib/audit";
import { site } from "@/lib/site";

const schema = z.object({
  active: z.boolean().optional(),
  role: z.enum(["admin", "doctor", "receptionist", "coordinator"]).optional(),
  password: z.string().min(6).optional(),
  notifyStaff: z.boolean().optional().default(true),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await apiSession("team");
  if (!s || s.role !== "admin") return NextResponse.json({ ok: false, error: "Only an admin can do this." }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Connect the database first." }, { status: 503 });

  const id = (await params).id;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ ok: false, error: "Invalid request: " + (p.error.issues[0]?.message ?? "") }, { status: 400 });

  // 1. Password reset request by Admin
  if (p.data.password) {
    const newPassword = p.data.password.trim();
    if (newPassword.length < 6) {
      return NextResponse.json({ ok: false, error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const { error: pwErr } = await db().auth.admin.updateUserById(id, { password: newPassword });
    if (pwErr) {
      return NextResponse.json({ ok: false, error: pwErr.message }, { status: 400 });
    }

    let emailed = false;
    if (p.data.notifyStaff) {
      const { data: member } = await db().from("staff").select("email,full_name").eq("id", id).maybeSingle();
      if (member?.email) {
        try {
          const mRes = await EmailService.sendStaffPasswordResetNotice({
            to: member.email,
            name: member.full_name,
            newPassword,
            loginUrl: `${site.url}/staff-login`,
          });
          emailed = Boolean(mRes.ok);
        } catch {
          // best-effort email
        }
      }
    }

    await audit(s, "reset_staff_password", "staff", id, { notified: emailed });

    // If only password was updated, return early
    if (p.data.active === undefined && p.data.role === undefined) {
      return NextResponse.json({ ok: true, passwordUpdated: true, emailed });
    }
  }

  // 2. Role or Active status change
  if (p.data.active !== undefined || p.data.role !== undefined) {
    if (id === s.uid && (p.data.active === false || (p.data.role && p.data.role !== "admin"))) {
      return NextResponse.json({ ok: false, error: "You cannot remove your own admin access." }, { status: 409 });
    }

    const { data: admins } = await db().from("staff").select("id").eq("role", "admin").eq("active", true);
    const losingAdmin = (admins ?? []).some((a) => a.id === id) && (p.data.active === false || (p.data.role && p.data.role !== "admin"));
    if (losingAdmin && (admins?.length ?? 0) <= 1) {
      return NextResponse.json({ ok: false, error: "At least one active admin is required." }, { status: 409 });
    }

    const updates: Record<string, unknown> = {};
    if (p.data.active !== undefined) updates.active = p.data.active;
    if (p.data.role !== undefined) updates.role = p.data.role;

    const { error } = await db().from("staff").update(updates).eq("id", id);
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Also sync app_metadata role if role changed
    if (p.data.role) {
      await db().auth.admin.updateUserById(id, { app_metadata: { role: p.data.role } });
    }

    await audit(s, "changed_staff", "staff", id, updates);
    invalidateStaffCache(id);
  }

  return NextResponse.json({ ok: true });
}
