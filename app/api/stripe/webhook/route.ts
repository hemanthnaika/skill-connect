import { db } from "@/db/drizzle";
import { registrations } from "@/db/schema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  const body = await req.text();

  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // ✅ Handle payment success
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const workshopId = session.metadata?.workshopId;

    if (!userId || !workshopId) {
      return NextResponse.json({ error: "Missing metadata" });
    }

    // Prevent duplicate registration
    await db.insert(registrations).values({
      userId,
      workshopId,
      paymentStatus: "paid",
      amountPaid: (session.amount_total ?? 0) / 100,
    });
  }

  return NextResponse.json({ received: true });
}
