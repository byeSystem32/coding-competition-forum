import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";
import { Participant } from "@/lib/models/Participant";
import { getTeamColor } from "@/lib/teamColors";

async function getOrganizer(req: NextRequest) {
  const sessionId = req.cookies.get("session")?.value;
  if (!sessionId) return null;
  const organizer = await Organizer.findById(sessionId);
  if (!organizer || !organizer.verified) return null;
  return organizer;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const organizer = await getOrganizer(req);
    if (!organizer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participants = await Participant.find({ organizerId: organizer._id }).sort({
      createdAt: 1,
    });

    return NextResponse.json({ participants });
  } catch (error: unknown) {
    console.error("Get participants error:", error);
    const message = error instanceof Error ? error.message : "Failed to get participants";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const organizer = await getOrganizer(req);
    if (!organizer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, gradeLevel, email, dietaryRestriction, teamName } = await req.json();

    if (!name || !gradeLevel || !email || !teamName) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Get existing team colors for this organizer
    const existingParticipants = await Participant.find({ organizerId: organizer._id });
    const teamColorMap: Record<string, string> = {};
    existingParticipants.forEach((p) => {
      teamColorMap[p.teamName] = p.teamColor;
    });

    // If team already has a color, use it; otherwise assign new
    let teamColor = teamColorMap[teamName.trim()];
    if (!teamColor) {
      const usedColors = Object.values(teamColorMap);
      teamColor = getTeamColor(teamName.trim(), usedColors);
    }

    const participant = await Participant.create({
      organizerId: organizer._id,
      name: name.trim(),
      gradeLevel,
      email: email.toLowerCase().trim(),
      dietaryRestriction: dietaryRestriction || "None",
      teamName: teamName.trim(),
      teamColor,
    });

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error: unknown) {
    console.error("Create participant error:", error);
    const message = error instanceof Error ? error.message : "Failed to create participant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
