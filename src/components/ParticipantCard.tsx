"use client";

import { Trash2, Pencil, User, GraduationCap, Mail, UtensilsCrossed } from "lucide-react";

interface ParticipantCardProps {
  participant: {
    _id: string;
    name: string;
    gradeLevel: string;
    email: string;
    dietaryRestriction: string;
    teamName: string;
    teamColor: string;
  };
  onDelete: (id: string) => void;
  onEdit: (participant: ParticipantCardProps["participant"]) => void;
}

export default function ParticipantCard({ participant, onDelete, onEdit }: ParticipantCardProps) {
  return (
    <div
      className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/20 animate-scale-in"
      style={{
        boxShadow: `0 0 20px ${participant.teamColor}15, inset 0 1px 0 ${participant.teamColor}10`,
      }}
    >
      {/* Team color indicator */}
      <div
        className="absolute top-0 left-6 right-6 h-[2px] rounded-b-full"
        style={{ backgroundColor: participant.teamColor }}
      />

      {/* Action buttons */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
        <button
          onClick={() => onEdit(participant)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-violet-500/20 flex items-center justify-center transition-all"
        >
          <Pencil className="w-3.5 h-3.5 text-white/40 hover:text-violet-400" />
        </button>
        <button
          onClick={() => onDelete(participant._id)}
          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all"
        >
          <Trash2 className="w-3.5 h-3.5 text-white/40 hover:text-red-400" />
        </button>
      </div>

      {/* Name */}
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-white/40" />
        <span className="font-semibold text-white text-sm truncate">{participant.name}</span>
      </div>

      {/* Details */}
      <div className="space-y-1.5 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" />
          <span className="truncate">{participant.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3 h-3" />
          <span>{participant.gradeLevel}</span>
        </div>
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-3 h-3" />
          <span>{participant.dietaryRestriction}</span>
        </div>
      </div>

      {/* Team badge */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${participant.teamColor}20`,
            color: participant.teamColor,
            border: `1px solid ${participant.teamColor}30`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: participant.teamColor }}
          />
          {participant.teamName}
        </span>
      </div>
    </div>
  );
}
