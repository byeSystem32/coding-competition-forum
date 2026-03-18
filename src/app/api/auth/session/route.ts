import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sessionId = req.cookies.get("session")?.value;

    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const organizer = await Organizer.findById(sessionId).select(
      "email firstName lastName schoolName verified paid"
    );

    if (!organizer) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      organizer: {
        id: organizer._id,
        email: organizer.email,
        firstName: organizer.firstName,
        lastName: organizer.lastName,
        schoolName: organizer.schoolName,
        verified: organizer.verified,
        paid: organizer.paid,
      },
    });
  } catch (error: unknown) {
    console.error("Session error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  // suppress unused variable warning
  void req;
  return response;
}
