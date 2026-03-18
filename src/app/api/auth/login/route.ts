import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const organizer = await Organizer.findOne({ email: email.toLowerCase().trim() });

    if (!organizer) {
      return NextResponse.json(
        { error: "No account found with that email. Please register first." },
        { status: 404 }
      );
    }

    // Generate new verification code
    const code = generateVerificationCode();
    organizer.verificationCode = code;
    organizer.codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    organizer.verified = false; // require re-verification
    await organizer.save();

    // Send verification email
    await sendVerificationEmail(email, code, organizer.firstName);

    const response = NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      firstName: organizer.firstName,
    });

    // Set session cookie
    response.cookies.set("session", organizer._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
