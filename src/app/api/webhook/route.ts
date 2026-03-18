import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Webhook signature verification failed";
      console.error("Webhook signature error:", message);
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const organizerId = session.metadata?.organizerId;

      if (organizerId) {
        await connectDB();
        await Organizer.findByIdAndUpdate(organizerId, { paid: true });
        console.log(`Payment completed for organizer: ${organizerId}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
