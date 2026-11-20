import { NextResponse } from "next/server";
import { z } from "zod";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { EmailService } from "@/lib/integrations/brevo";
import { audit } from "@/lib/audit";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address").transform((v) => v.toLowerCase().trim()),
  role: z.enum(["admin", "doctor", "receptionist", "coordinator"]),
  phone: z.string().trim().optional().nullable(),
  password: z.string().min(6, "Password must be at least 6 characters").optional().nullable(),
  sendEmail: z.boolean().optional().default(true),
});

export async function POST(req: Request) {
  const s = await apiSession("team");
  if (!s || s.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Only an admin can add team members." }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const p = schema.safeParse(json);
  if (!p.success) {
    const issue = p.error.issues[0]?.message ?? "Please check the form inputs.";
    return NextResponse.json({ ok: false, error: issue }, { status: 400 });
  }

  if (!dbConfigured()) {
    return NextResponse.json({ ok: false, error: "Connect the database to add team members." }, { status: 503 });
  }

  const { name, email, role, phone, password, sendEmail: shouldSendEmail } = p.data;

  // Use provided password or generate a clean secure temporary one
  const passwordToUse = password && password.trim().length >= 6
    ? password.trim()
    : `Staff@${Math.floor(100000 + Math.random() * 900000)}`;

  // 1. Create user in Supabase Auth via Admin API
  const created = await db().auth.admin.createUser({
    email,
    email_confirm: true,
    password: passwordToUse,
    user_metadata: { full_name: name, phone: phone || "" },
    app_metadata: { role },
  });

  if (created.error || !created.data.user) {
    const msg = created.error?.message?.toLowerCase().includes("already")
      ? "A staff account with this email already exists."
      : created.error?.message ?? "Could not create user account.";
    return NextResponse.json({ ok: false, error: msg }, { status: 409 });
  }

  const userId = created.data.user.id;

  // 2. Insert into public.staff table
  const { error: staffErr } = await db().from("staff").insert({
    id: userId,
    full_name: name,
    email,
    role,
    phone: phone || null,
    active: true,
  });

  if (staffErr) {
    // Rollback orphaned auth user
    await db().auth.admin.deleteUser(userId);
    return NextResponse.json({ ok: false, error: `Could not save staff record: ${staffErr.message}` }, { status: 500 });
  }

  // 3. Send welcome email via Brevo with credentials
  let emailed = false;
  let emailError: string | undefined;

  if (shouldSendEmail) {
    try {
      const mailRes = await EmailService.sendStaffInvite({
        to: email,
        name,
        role,
        tempPassword: passwordToUse,
        loginUrl: `${site.url}/staff-login`,
      });
      emailed = Boolean(mailRes.ok);
      if (!mailRes.ok) emailError = mailRes.error;
    } catch (err) {
      emailError = (err as Error).message;
    }
  }

  // 4. Audit log
  await audit(s, "added_staff", "staff", userId, { role, email, phone });

  return NextResponse.json({
    ok: true,
    userId,
    passwordUsed: passwordToUse,
    emailed,
    emailError,
  });
}
