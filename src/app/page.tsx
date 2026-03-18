"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Wand2, ChevronRight } from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";
import WaveAnimation from "@/components/WaveAnimation";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user already has a session
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.organizer.verified) {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <FloatingOrbs />

      {/* Main Content */}
      <div
        className={`relative z-20 flex flex-col items-center text-center px-6 transition-all duration-1000 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-white/60 font-medium">Registration Open</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9] mb-4">
          CSN 2026
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/90 tracking-tight mb-6">
          Coding Challenge
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/40 max-w-md mb-12 leading-relaxed">
          Compete. Create. Conquer.
          <br />
          The ultimate student coding competition.
        </p>

        {/* Register Button */}
        <button
          onClick={() => router.push("/register")}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold text-lg rounded-2xl hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        >
          <Wand2 className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span>Register</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Price tag */}
        <p className="mt-6 text-sm text-white/30">$10 per participant</p>
      </div>

      {/* Wave */}
      <WaveAnimation />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-[5]" />
    </div>
  );
}
