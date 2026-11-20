import { NextResponse } from "next/server";
import { verifyWebhook } from "@/lib/integrations/razorpay";
import { confirmPayment } from "@/lib/booking";
import { db } from "@/lib/db";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

// Razorpay dashboard > Webhooks: URL https://yourdomain/api/webhooks/razorpay, events: payment.captured, order.paid, payment.failed, refund.processed.
export const maxDuration = 60;

export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhook(raw, req.headers.get("x-razorpay-signature") ?? "")) return NextResponse.json({ ok: false }, { status: 400 });
  try {
    const ev = JSON.parse(raw), pay = ev.payload?.payment?.entity;
    if (!pay) return NextResponse.json({ ok: true });
    if (ev.event === "payment.captured" || ev.event === "order.paid") await confirmPayment({ orderId: pay.order_id, paymentId: pay.id, method: pay.method, raw: pay });
    else if (ev.event === "payment.failed") await db().from("payments").update({ status: "failed" }).eq("rzp_order_id", pay.order_id).eq("status", "created");
    else if (ev.event === "refund.processed") {
      await db().from("payments").update({ status: "refunded", refunded_at: new Date().toISOString() }).eq("rzp_payment_id", pay.id);
      await audit(null, "refund_processed", "payment", pay.id);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("razorpay webhook", e);
    return NextResponse.json({ ok: false }, { status: 500 }); // non-200 makes Razorpay retry
  }
}
