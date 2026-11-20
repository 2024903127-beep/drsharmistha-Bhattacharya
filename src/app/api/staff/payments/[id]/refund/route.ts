import { NextResponse } from "next/server";
import { apiSession } from "@/lib/session";
import { db, dbConfigured } from "@/lib/db";
import { refundPayment } from "@/lib/integrations/razorpay";
import { audit } from "@/lib/audit";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const s = await apiSession("billing");
  if (!s) return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 403 });
  if (!dbConfigured()) return NextResponse.json({ ok: false, error: "Connect the database first." }, { status: 503 });
  const id = (await params).id;
  const { data: pay } = await db().from("payments").select("id,status,rzp_payment_id").eq("id", id).maybeSingle();
  if (!pay || pay.status !== "captured" || !pay.rzp_payment_id) return NextResponse.json({ ok: false, error: "This payment cannot be refunded." }, { status: 409 });
  try {
    await refundPayment(pay.rzp_payment_id); // full refund
    await db().from("payments").update({ status: "refunded", refunded_at: new Date().toISOString() }).eq("id", id);
    await audit(s, "refunded_payment", "payment", id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 502 });
  }
}
