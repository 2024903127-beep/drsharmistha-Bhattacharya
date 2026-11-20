import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { bookingSchema } from "@/lib/validation";
import { availableSlots, createHold, releaseHold, slotStart } from "@/lib/booking";
import { db, dbConfigured } from "@/lib/db";
import { allow, clientIp } from "@/lib/ratelimit";
import { createOrder, razorpayConfigured } from "@/lib/integrations/razorpay";
import { site } from "@/lib/site";

const fail = (error: string, status: number) => NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const parsed = bookingSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Check your details", 400);
  const b = parsed.data;
  if (b.website_hp) return NextResponse.json({ ok: true, demo: true, bookingRef: "BK-OK" }); // honeypot: bots see success
  if (!(await allow(`book:${clientIp(req)}`, 8, 600))) return fail("Too many attempts. Please wait a few minutes or call us.", 429);
  if (slotStart(b.date, b.time).getTime() < Date.now()) return fail("Choose a time in the future.", 400);
  if (!(await availableSlots(b.date)).includes(b.time)) return fail("That time is not available. Choose another slot.", 409);

  const amount = site.consultFeeInr * 100; // the price is decided here, never by the browser
  if (!dbConfigured() || !razorpayConfigured()) {
    // Local demo only: lets you click through the flow without any accounts.
    if (process.env.NODE_ENV === "production") return fail("Online booking is not available right now. Please call us.", 503);
    return NextResponse.json({ ok: true, demo: true, bookingRef: `BK-${randomUUID().slice(0, 8).toUpperCase()}`, amount, currency: "INR" });
  }

  const hold = await createHold(b, amount);
  if (!("appt" in hold)) return hold.taken ? fail("That time was just taken. Choose another slot.", 409) : fail("Could not reserve the slot. Please try again.", 500);
  try {
    const order = await createOrder(amount, hold.appt.ref, { bookingRef: hold.appt.ref, service: b.service });
    await db().from("payments").insert({ appointment_id: hold.appt.id, rzp_order_id: order.id, amount_paise: amount });
    return NextResponse.json({ ok: true, demo: false, bookingRef: hold.appt.ref, orderId: order.id, amount, currency: "INR", keyId: process.env.RAZORPAY_KEY_ID });
  } catch {
    await releaseHold(hold.appt.id);
    return fail("Could not start payment. Please try again.", 502);
  }
}
