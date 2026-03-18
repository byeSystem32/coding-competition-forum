"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowRight,
  Users,
  LogOut,
  Loader2,
} from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import ParticipantCard from "@/components/ParticipantCard";
import AddParticipantModal from "@/components/AddParticipantModal";

interface Participant {
  _id: string;
  name: string;
  gradeLevel: string;
  email: string;
  dietaryRestriction: string;
  teamName: string;
  teamColor: string;
}

interface Organizer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  schoolName: string;
  verified: boolean;
  paid: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [sessionRes, participantsRes] = await Promise.all([
        fetch("/api/auth/session"),
        fetch("/api/participants"),
      ]);

      const sessionData = await sessionRes.json();
      if (!sessionData.authenticated || !sessionData.organizer.verified) {
        router.push("/register");
        return;
      }

      setOrganizer(sessionData.organizer);

      const participantsData = await participantsRes.json();
      if (participantsData.participants) {
        setParticipants(participantsData.participants);
      }
    } catch {
      router.push("/register");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddParticipant = async (data: {
    name: string;
    gradeLevel: string;
    email: string;
    dietaryRestriction: string;
    teamName: string;
  }) => {
    const res = await fetch("/api/participants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error);

    setParticipants((prev) => [...prev, result.participant]);
  };

  const handleDeleteParticipant = async (id: string) => {
    const res = await fetch(`/api/participants/${id}`, { method: "DELETE" });
    if (res.ok) {
      setParticipants((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
  };

  const existingTeams = [...new Set(participants.map((p) => p.teamName))];
  const teamGroups = participants.reduce(
    (acc, p) => {
      if (!acc[p.teamName]) acc[p.teamName] = [];
      acc[p.teamName].push(p);
      return acc;
    },
    {} as Record<string, Participant[]>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingOrbs />

      <div className="relative z-20 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-sm text-white/40">
              {organizer?.firstName} {organizer?.lastName} • {organizer?.schoolName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <Users className="w-4 h-4 text-white/40" />
              <span className="text-sm text-white/60">
                {participants.length} participant{participants.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-white/40" />
            </button>
          </div>
        </div>

        {/* Team Summary (if teams exist) */}
        {existingTeams.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {existingTeams.map((team) => {
              const color = teamGroups[team][0].teamColor;
              return (
                <span
                  key={team}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                    border: `1px solid ${color}25`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {team} ({teamGroups[team].length})
                </span>
              );
            })}
          </div>
        )}

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {/* Participant Cards */}
          {participants.map((participant) => (
            <ParticipantCard
              key={participant._id}
              participant={participant}
              onDelete={handleDeleteParticipant}
            />
          ))}

          {/* Add Button (+ card) */}
          <button
            onClick={() => setShowModal(true)}
            className="group relative min-h-[180px] rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] group-hover:bg-white/[0.1] flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <Plus className="w-6 h-6 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
            <span className="text-sm text-white/30 group-hover:text-white/50 transition-colors">
              Add Participant
            </span>
          </button>

          {/* Ghost cells for calendar aesthetic */}
          {participants.length < 7 &&
            [...Array(Math.max(0, 7 - participants.length))].map((_, i) => (
              <div
                key={`ghost-${i}`}
                className="min-h-[180px] rounded-2xl border border-white/[0.03] bg-white/[0.01]"
              />
            ))}
        </div>

        {/* Proceed to Checkout */}
        {participants.length > 0 && (
          <div className="flex justify-center">
            <button
              onClick={() => router.push("/checkout")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>

      {/* Add Participant Modal */}
      {showModal && (
        <AddParticipantModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddParticipant}
          existingTeams={existingTeams}
        />
      )}
    </div>
  );
}
