import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";
import { generateVerificationCode, sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, firstName, lastName, schoolName } = await req.json();

    if (!email || !firstName || !lastName || !schoolName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const code = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Upsert: update if exists, create if not
    const organizer = await Organizer.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      {
        email: email.toLowerCase().trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        schoolName: schoolName.trim(),
        verificationCode: code,
        codeExpiresAt,
        verified: false,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send verification email
    await sendVerificationEmail(email, code, firstName);

    const response = NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });

    // Set session cookie with organizer ID
    response.cookies.set("session", organizer._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
