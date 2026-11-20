import { NextResponse } from "next/server";
import { confirmPayment } from "@/lib/booking";
import { dbConfigured } from "@/lib/db";
import { razorpayConfigured, verifyPayment } from "@/lib/integrations/razorpay";

// Browser callback after Razorpay Checkout. The webhook (/api/webhooks/razorpay) does the same job, so a closed tab never loses a booking.
export const maxDuration = 60;

export async function POST(req: Request) {
  const b = (await req.json().catch(() => ({}))) as Record<string, string | boolean>;
  if (!dbConfigured() || !razorpayConfigured()) {
    return process.env.NODE_ENV !== "production" && b.demo ? NextResponse.json({ ok: true, demo: true }) : NextResponse.json({ ok: false }, { status: 503 });
  }
  const { razorpay_order_id: o, razorpay_payment_id: p, razorpay_signature: s } = b as Record<string, string>;
  if (!o || !p || !s || !verifyPayment(o, p, s)) return NextResponse.json({ ok: false, error: "Payment could not be verified." }, { status: 400 });
  const r = await confirmPayment({ orderId: o, paymentId: p });
  return r.ok ? NextResponse.json({ ok: true, conflict: "conflict" in r }) : NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
}
