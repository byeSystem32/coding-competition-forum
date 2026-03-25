import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";
import { Participant } from "@/lib/models/Participant";

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

    // Mark as pay later — not yet paid, but intent recorded
    organizer.paymentMethod = "pay_later";
    await organizer.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Pay later error:", error);
    const message = error instanceof Error ? error.message : "Pay later failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
