import mongoose, { Schema, Document } from "mongoose";

export interface IParticipant extends Document {
  organizerId: mongoose.Types.ObjectId;
  name: string;
  gradeLevel: string;
  email: string;
  dietaryRestriction: string;
  teamName: string;
  teamColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    organizerId: { type: Schema.Types.ObjectId, ref: "Organizer", required: true },
    name: { type: String, required: true, trim: true },
    gradeLevel: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    dietaryRestriction: { type: String, required: true, default: "None" },
    teamName: { type: String, required: true, trim: true },
    teamColor: { type: String, required: true },
  },
  { timestamps: true }
);

export const Participant =
  mongoose.models.Participant ||
  mongoose.model<IParticipant>("Participant", ParticipantSchema);
