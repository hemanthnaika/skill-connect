import { db } from "@/db/drizzle";
import { registrations } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: Request) {
  try {
    const { userId, workshopId, price, slug } = await req.json();

    if (!userId || !workshopId || !price || !slug) {
      return NextResponse.json(
        { error: "Missing required parameters." },
        { status: 400 }
      );
    }

    // 1️⃣ Check if user already registered
    const existing = await db
      .select()
      .from(registrations)
      .where(
        and(
          eq(registrations.userId, userId),
          eq(registrations.workshopId, workshopId)
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "You have already registered for this course." },
        { status: 400 }
      );
    }

    // 2️⃣  Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: slug },
            unit_amount: Math.floor(Number(price) * 100), // convert to paisa
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        workshopId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/workshops/${slug}?payment=success&user=${userId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/workshops/${slug}?payment=cancel`,
    });
    revalidateTag("admin-dashboard", {});
    return NextResponse.json({ url: session.url });
  } catch (err) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
