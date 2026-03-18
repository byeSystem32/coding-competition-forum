import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";
import { Participant } from "@/lib/models/Participant";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const sessionId = req.cookies.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const organizer = await Organizer.findById(sessionId);
    if (!organizer || !organizer.verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participants = await Participant.find({ organizerId: organizer._id });

    if (participants.length === 0) {
      return NextResponse.json({ error: "No participants registered" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "CSN 2026 Coding Challenge Registration",
              description: `${participants.length} participant${participants.length > 1 ? "s" : ""} from ${organizer.schoolName}`,
            },
            unit_amount: 1000, // $10 in cents
          },
          quantity: participants.length,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/checkout?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout?canceled=true`,
      customer_email: organizer.email,
      metadata: {
        organizerId: organizer._id.toString(),
      },
    });

    // Store session ID
    organizer.stripeSessionId = session.id;
    await organizer.save();

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error("Checkout error:", error);
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
