"use client";

import { useState } from "react";
import {
  X,
  UserPlus,
  GraduationCap,
  UtensilsCrossed,
  Users,
  PlusCircle,
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

interface AddParticipantModalProps {
  onClose: () => void;
  onAdd: (participant: {
    name: string;
    gradeLevel: string;
    email: string;
    dietaryRestriction: string;
    teamName: string;
  }) => Promise<void>;
  existingTeams: string[];
}

const GRADE_LEVELS = [
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade",
  "10th Grade",
  "11th Grade",
  "12th Grade",
  "College Freshman",
  "College Sophomore",
  "College Junior",
  "College Senior",
];

const DIETARY_OPTIONS = [
  { value: "None", label: "None", emoji: "🚫" },
  { value: "Vegetarian", label: "Vegetarian", emoji: "🥬" },
  { value: "Vegan", label: "Vegan", emoji: "🌱" },
  { value: "Halal", label: "Halal", emoji: "🍖" },
  { value: "Kosher", label: "Kosher", emoji: "✡️" },
  { value: "Gluten-Free", label: "Gluten-Free", emoji: "🌾" },
  { value: "Nut Allergy", label: "Nut Allergy", emoji: "🥜" },
  { value: "Dairy-Free", label: "Dairy-Free", emoji: "🥛" },
  { value: "Other", label: "Other", emoji: "📝" },
];

export default function AddParticipantModal({
  onClose,
  onAdd,
  existingTeams,
}: AddParticipantModalProps) {
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [email, setEmail] = useState("");
  const [dietaryRestriction, setDietaryRestriction] = useState("None");
  const [teamName, setTeamName] = useState("");
  const [customTeam, setCustomTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !gradeLevel || !email || !teamName) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await onAdd({ name, gradeLevel, email, dietaryRestriction, teamName });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add participant";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const gradeOptions = GRADE_LEVELS.map((g) => ({
    value: g,
    label: g,
    icon: (
      <span className="text-xs text-white/30 font-mono w-5 text-center">
        {g.match(/\d+/)?.[0] || g[0]}
      </span>
    ),
  }));

  const dietaryOptions = DIETARY_OPTIONS.map((d) => ({
    value: d.value,
    label: d.label,
    icon: <span className="text-sm">{d.emoji}</span>,
  }));

  const teamOptions = [
    ...existingTeams.map((t) => ({
      value: t,
      label: t,
      icon: <Users className="w-3.5 h-3.5 text-white/40" />,
    })),
    {
      value: "__new__",
      label: "Create new team",
      icon: <PlusCircle className="w-3.5 h-3.5 text-violet-400" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="relative bg-black/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
          {/* Gradient accent border */}
          <div className="absolute inset-0 rounded-2xl p-[1px] -z-10">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/20 via-blue-500/20 to-teal-500/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-violet-400" />
              </div>
              <h2 className="text-lg font-semibold text-white">Add Participant</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@school.edu"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all text-sm"
              />
            </div>

            {/* Grade Level - Custom Select */}
            <CustomSelect
              value={gradeLevel}
              onChange={setGradeLevel}
              options={gradeOptions}
              placeholder="Select grade..."
              label="Grade Level"
              icon={<GraduationCap className="w-3.5 h-3.5" />}
            />

            {/* Dietary Restriction - Custom Select */}
            <CustomSelect
              value={dietaryRestriction}
              onChange={setDietaryRestriction}
              options={dietaryOptions}
              placeholder="Select restriction..."
              label="Dietary Restriction"
              icon={<UtensilsCrossed className="w-3.5 h-3.5" />}
            />

            {/* Team */}
            <div>
              {!customTeam && existingTeams.length > 0 ? (
                <CustomSelect
                  value={teamName}
                  onChange={(val) => {
                    if (val === "__new__") {
                      setCustomTeam(true);
                      setTeamName("");
                    } else {
                      setTeamName(val);
                    }
                  }}
                  options={teamOptions}
                  placeholder="Select a team..."
                  label="Team Name"
                  icon={<Users className="w-3.5 h-3.5" />}
                />
              ) : (
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Team Name
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Lincoln High Team A"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all text-sm"
                  />
                  {existingTeams.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCustomTeam(false)}
                      className="mt-2 text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
                    >
                      ← Choose existing team
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Add Participant
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
