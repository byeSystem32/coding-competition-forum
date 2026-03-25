import mongoose, { Schema, Document } from "mongoose";

export interface IOrganizer extends Document {
  email: string;
  firstName: string;
  lastName: string;
  schoolName: string;
  verificationCode: string;
  codeExpiresAt: Date;
  verified: boolean;
  paid: boolean;
  paymentMethod?: "stripe" | "pay_later";
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizerSchema = new Schema<IOrganizer>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    schoolName: { type: String, required: true, trim: true },
    verificationCode: { type: String, required: true },
    codeExpiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, enum: ["stripe", "pay_later"] },
    stripeSessionId: { type: String },
  },
  { timestamps: true }
);

export const Organizer =
  mongoose.models.Organizer || mongoose.model<IOrganizer>("Organizer", OrganizerSchema);
