"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Clock,
  Users,
  CheckCircle2,
  Loader2,
  PartyPopper,
} from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";

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
  firstName: string;
  lastName: string;
  schoolName: string;
  email: string;
  paid: boolean;
  paymentMethod?: "stripe" | "pay_later" | null;
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [payingLater, setPayingLater] = useState(false);
  const [success, setSuccess] = useState(false);
  const [payLaterSuccess, setPayLaterSuccess] = useState(false);

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

      // Check if returning from Stripe success
      if (searchParams.get("success") === "true") {
        setSuccess(true);
      }
    } catch {
      router.push("/register");
    } finally {
      setLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaying(false);
    }
  };

  const handlePayLater = async () => {
    setPayingLater(true);
    try {
      const res = await fetch("/api/checkout/pay-later", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setPayLaterSuccess(true);
    } catch (err) {
      console.error("Pay later error:", err);
      setPayingLater(false);
    }
  };

  const teamGroups = participants.reduce(
    (acc, p) => {
      if (!acc[p.teamName]) acc[p.teamName] = { color: p.teamColor, members: [] };
      acc[p.teamName].members.push(p);
      return acc;
    },
    {} as Record<string, { color: string; members: Participant[] }>
  );

  const totalCost = participants.length * 10;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <FloatingOrbs />
        <div className="relative z-20 text-center px-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">You&apos;re All Set!</h1>
          <p className="text-white/40 mb-2 max-w-md">
            Payment confirmed for {participants.length} participant
            {participants.length !== 1 ? "s" : ""} from {organizer?.schoolName}.
          </p>
          <p className="text-white/30 text-sm mb-8">
            A confirmation email has been sent to {organizer?.email}.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (payLaterSuccess) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <FloatingOrbs />
        <div className="relative z-20 text-center px-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Registration Confirmed!</h1>
          <p className="text-white/40 mb-2 max-w-md">
            {participants.length} participant
            {participants.length !== 1 ? "s" : ""} from {organizer?.schoolName} registered.
          </p>
          <p className="text-amber-400/70 text-sm mb-2 font-medium">
            Payment pending — please pay before the event.
          </p>
          <p className="text-white/30 text-sm mb-8">
            A confirmation email has been sent to {organizer?.email}.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <FloatingOrbs />

      <div className="relative z-20 max-w-3xl mx-auto px-6 py-8">
        {/* Back */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <p className="text-sm text-white/40">
            Review your teams and complete payment.
          </p>
        </div>

        {/* Teams */}
        <div className="space-y-6 mb-8">
          {Object.entries(teamGroups).map(([teamName, { color, members }]) => (
            <div
              key={teamName}
              className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm overflow-hidden"
            >
              {/* Team header */}
              <div
                className="px-6 py-4 border-b border-white/[0.06]"
                style={{
                  background: `linear-gradient(135deg, ${color}10, transparent)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="font-semibold text-white">{teamName}</h3>
                  </div>
                  <span className="text-sm text-white/40">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Members */}
              <div className="divide-y divide-white/[0.04]">
                {members.map((member) => (
                  <div
                    key={member._id}
                    className="px-6 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                        <span className="text-xs font-medium text-white/60">
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{member.name}</p>
                        <p className="text-xs text-white/40">
                          {member.gradeLevel} • {member.dietaryRestriction}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-white/50">$10.00</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 mb-8">
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500/5 via-transparent to-blue-500/5 -z-10" />

          <h3 className="font-semibold text-white mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-white/50 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participants
              </span>
              <span className="text-white">{participants.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Price per student</span>
              <span className="text-white">$10.00</span>
            </div>
          </div>

          <div className="border-t border-white/[0.08] pt-4">
            <div className="flex justify-between">
              <span className="font-semibold text-white">Total</span>
              <span className="text-2xl font-bold text-white">
                ${totalCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={paying || payingLater || participants.length === 0}
          className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          {paying ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ${totalCost.toFixed(2)}
            </>
          )}
        </button>

        {/* Stripe badge */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <CheckCircle2 className="w-3 h-3 text-white/20" />
          <span className="text-xs text-white/20">Secured by Stripe</span>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 border-t border-white/[0.08]" />
          <span className="text-xs text-white/30 uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-white/[0.08]" />
        </div>

        {/* Pay Later Button */}
        <button
          onClick={handlePayLater}
          disabled={paying || payingLater || participants.length === 0}
          className="w-full py-4 bg-transparent text-white/70 font-semibold rounded-2xl border border-white/[0.12] hover:bg-white/[0.05] hover:border-white/[0.2] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
        >
          {payingLater ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Clock className="w-5 h-5" />
              Pay Later
            </>
          )}
        </button>

        <p className="text-center text-xs text-white/25 mt-3">
          Choose &quot;Pay Later&quot; to complete registration now and pay before the event.
        </p>
      </div>
    </div>
  );
}
