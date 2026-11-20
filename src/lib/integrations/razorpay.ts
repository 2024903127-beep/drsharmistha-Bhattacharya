import { createHmac, timingSafeEqual } from "node:crypto";

export const razorpayConfigured = () => Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
const basic = () => "Basic " + Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
const hmac = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("hex");
export const verifyPayment = (orderId: string, paymentId: string, sig: string) => safeEqual(hmac(process.env.RAZORPAY_KEY_SECRET ?? "", `${orderId}|${paymentId}`), sig);
export const verifyWebhook = (raw: string, sig: string) => Boolean(process.env.RAZORPAY_WEBHOOK_SECRET) && safeEqual(hmac(process.env.RAZORPAY_WEBHOOK_SECRET!, raw), sig);

export async function createOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const r = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: basic() },
    body: JSON.stringify({ amount: amountPaise, currency: "INR", receipt, notes }),
  });
  if (!r.ok) throw new Error(`Razorpay order failed (${r.status})`);
  return (await r.json()) as { id: string };
}

export async function refundPayment(paymentId: string, amountPaise?: number) {
  const r = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: basic() },
    body: JSON.stringify(amountPaise ? { amount: amountPaise } : {}),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error?.description ?? `Refund failed (${r.status})`);
  return j as { id: string };
}
