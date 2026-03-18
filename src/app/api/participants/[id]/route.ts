import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/lib/models/Organizer";
import { Participant } from "@/lib/models/Participant";

async function getOrganizer(req: NextRequest) {
  const sessionId = req.cookies.get("session")?.value;
  if (!sessionId) return null;
  const organizer = await Organizer.findById(sessionId);
  if (!organizer || !organizer.verified) return null;
  return organizer;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const organizer = await getOrganizer(req);
    if (!organizer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updates = await req.json();

    const participant = await Participant.findOneAndUpdate(
      { _id: id, organizerId: organizer._id },
      updates,
      { new: true }
    );

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    return NextResponse.json({ participant });
  } catch (error: unknown) {
    console.error("Update participant error:", error);
    const message = error instanceof Error ? error.message : "Failed to update participant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const organizer = await getOrganizer(req);
    if (!organizer) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const participant = await Participant.findOneAndDelete({
      _id: id,
      organizerId: organizer._id,
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Delete participant error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete participant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
