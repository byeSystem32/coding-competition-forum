import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const sessionId = req.cookies.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    const organizer = await Organizer.findById(sessionId);

    if (!organizer) {
      return NextResponse.json({ error: "Organizer not found" }, { status: 404 });
    }

    if (organizer.verified) {
      return NextResponse.json({ success: true, message: "Already verified" });
    }

    if (new Date() > organizer.codeExpiresAt) {
      return NextResponse.json({ error: "Verification code has expired" }, { status: 400 });
    }

    if (organizer.verificationCode !== code.trim()) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    organizer.verified = true;
    await organizer.save();

    return NextResponse.json({ success: true, message: "Email verified successfully" });
  } catch (error: unknown) {
    console.error("Verification error:", error);
    const message = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
