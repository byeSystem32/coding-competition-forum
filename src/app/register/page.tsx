"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Mail,
  User,
  School,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  LogIn,
  CheckCircle2,
  Fingerprint,
  ScanLine,
} from "lucide-react";
import FloatingOrbs from "@/components/FloatingOrbs";

type Mode = "register" | "login";
type Step = "info" | "verify" | "auto-verifying";
type AutoVerifyPhase = "scanning" | "verifying" | "confirmed";

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>("info");
  const [mounted, setMounted] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // Verification
  const [code, setCode] = useState("");
  const [fallbackCode, setFallbackCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-verify animation
  const [autoPhase, setAutoPhase] = useState<AutoVerifyPhase>("scanning");
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.organizer.verified) {
          router.push("/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const autoVerify = useCallback(
    async (verificationCode: string) => {
      setStep("auto-verifying");
      setAutoPhase("scanning");
      setProgressWidth(0);

      // Phase 1: Scanning (0-40%)
      await new Promise((r) => setTimeout(r, 400));
      setProgressWidth(20);
      await new Promise((r) => setTimeout(r, 500));
      setProgressWidth(40);

      // Phase 2: Verifying (40-80%)
      setAutoPhase("verifying");
      await new Promise((r) => setTimeout(r, 300));
      setProgressWidth(55);

      // Actually verify
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: verificationCode }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProgressWidth(80);
        await new Promise((r) => setTimeout(r, 400));
        setProgressWidth(100);

        // Phase 3: Confirmed
        setAutoPhase("confirmed");
        await new Promise((r) => setTimeout(r, 1000));

        router.push("/dashboard");
      } catch {
        // If auto-verify fails, fall back to manual code entry
        setStep("verify");
        setError("Verification failed. Please enter the code manually.");
      }
    },
    [router]
  );

  const switchMode = () => {
    setMode(mode === "register" ? "login" : "register");
    setStep("info");
    setError("");
    setCode("");
    setFallbackCode("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, schoolName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      if (data.code) {
        setFallbackCode(data.code);
        setLoading(false);
        autoVerify(data.code);
      } else {
        setStep("verify");
        setLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      setFirstName(data.firstName || "");

      if (data.code) {
        setFallbackCode(data.code);
        setLoading(false);
        autoVerify(data.code);
      } else {
        setStep("verify");
        setLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body =
        mode === "register"
          ? { email, firstName, lastName, schoolName }
          : { email };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setError("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend code";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Auto-verify animation screen ───
  if (step === "auto-verifying") {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        <FloatingOrbs />

        <div className="relative z-20 w-full max-w-sm px-6">
          <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 backdrop-blur-xl">
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-violet-500/10 via-transparent to-blue-500/10 -z-10" />

            {/* Animated icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                {/* Rotating ring */}
                <div
                  className={`absolute -inset-3 rounded-full border-2 transition-all duration-1000 ${
                    autoPhase === "confirmed"
                      ? "border-emerald-500/40 scale-110"
                      : "border-violet-500/20 animate-spin"
                  }`}
                  style={{
                    animationDuration: "3s",
                    borderTopColor:
                      autoPhase === "confirmed"
                        ? "rgb(16 185 129 / 0.6)"
                        : "rgb(139 92 246 / 0.6)",
                  }}
                />

                {/* Pulsing glow */}
                <div
                  className={`absolute -inset-6 rounded-full transition-all duration-700 ${
                    autoPhase === "confirmed"
                      ? "bg-emerald-500/10"
                      : "bg-violet-500/10 animate-pulse"
                  }`}
                />

                {/* Center icon */}
                <div
                  className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700 ${
                    autoPhase === "confirmed"
                      ? "bg-emerald-500/20 border border-emerald-500/30"
                      : "bg-violet-500/10 border border-violet-500/20"
                  }`}
                >
                  {autoPhase === "scanning" && (
                    <ScanLine className="w-7 h-7 text-violet-400 animate-pulse" />
                  )}
                  {autoPhase === "verifying" && (
                    <Fingerprint className="w-7 h-7 text-violet-400 animate-pulse" />
                  )}
                  {autoPhase === "confirmed" && (
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Status text */}
            <div className="text-center mb-8">
              <h2 className="text-lg font-semibold text-white mb-1.5 transition-all duration-300">
                {autoPhase === "scanning" && "Scanning credentials..."}
                {autoPhase === "verifying" && "Verifying identity..."}
                {autoPhase === "confirmed" && "Verified!"}
              </h2>
              <p className="text-sm text-white/40 transition-all duration-300">
                {autoPhase === "scanning" && "Checking your registration details"}
                {autoPhase === "verifying" && "Confirming your email address"}
                {autoPhase === "confirmed" && "Redirecting to your dashboard..."}
              </p>
            </div>

            {/* Progress bar */}
            <div className="relative h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out ${
                  autoPhase === "confirmed"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                    : "bg-gradient-to-r from-violet-500 to-blue-500"
                }`}
                style={{ width: `${progressWidth}%` }}
              />
              {/* Shimmer effect on progress bar */}
              {autoPhase !== "confirmed" && (
                <div
                  className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]"
                  style={{ left: `${progressWidth - 10}%` }}
                />
              )}
            </div>

            {/* Animated dots */}
            {autoPhase !== "confirmed" && (
              <div className="flex justify-center gap-1.5 mt-6">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Normal registration / login / manual verify ───
  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <FloatingOrbs />

      <div
        className={`relative z-20 w-full max-w-md px-6 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Back link */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Card */}
        <div className="relative bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl">
          {/* Gradient glow */}
          <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-violet-500/10 via-transparent to-blue-500/10 -z-10" />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              {step === "verify"
                ? "Verify Email"
                : mode === "register"
                  ? "Register"
                  : "Welcome Back"}
            </h1>
            <p className="text-sm text-white/40">
              {step === "verify"
                ? `We sent a 6-digit code to ${email}`
                : mode === "register"
                  ? "Enter your contact information to get started."
                  : "Sign in with your email to access your dashboard."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === "info" ? (
            <>
              {mode === "register" ? (
                /* REGISTER FORM */
                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                      <Mail className="w-3.5 h-3.5" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@school.edu"
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                        <User className="w-3.5 h-3.5" />
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="John"
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                        <User className="w-3.5 h-3.5" />
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Doe"
                        className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                      <School className="w-3.5 h-3.5" />
                      School Name
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                      placeholder="Lincoln High School"
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                      <Mail className="w-3.5 h-3.5" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@school.edu"
                      autoFocus
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Send Verification Code
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle between register / login */}
              <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
                <p className="text-sm text-white/30">
                  {mode === "register" ? (
                    <>
                      Already registered?{" "}
                      <button
                        onClick={switchMode}
                        className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                      >
                        Sign back in
                      </button>
                    </>
                  ) : (
                    <>
                      New here?{" "}
                      <button
                        onClick={switchMode}
                        className="text-violet-400 hover:text-violet-300 font-medium transition-colors"
                      >
                        Register instead
                      </button>
                    </>
                  )}
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-white/60 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:text-white/15 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Verify & Continue
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-white/30 hover:text-white/60 transition-colors"
                >
                  Didn&apos;t receive a code? Resend
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              step === "info" ? "w-8 bg-white" : "w-2 bg-white/20"
            }`}
          />
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              step !== "info" ? "w-8 bg-white" : "w-2 bg-white/20"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
