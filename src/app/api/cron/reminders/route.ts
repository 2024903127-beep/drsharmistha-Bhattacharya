import { NextResponse } from "next/server";
import { runReminders } from "@/lib/booking";
import { dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

// Call every 15 minutes with header "Authorization: Bearer $CRON_SECRET" (Vercel Cron sends this automatically).
async function handle(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ ok: false }, { status: 401 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  return NextResponse.json({ ok: true, sent: await runReminders() });
}
export { handle as GET, handle as POST };
