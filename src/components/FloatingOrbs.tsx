"use client";

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large purple orb */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full animate-float-slow"
        style={{
          top: "-10%",
          right: "-10%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Medium blue orb */}
      <div
        className="absolute w-[400px] h-[400px] rounded-full animate-float-medium"
        style={{
          top: "40%",
          left: "-5%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Small pink orb */}
      <div
        className="absolute w-[300px] h-[300px] rounded-full animate-float-fast"
        style={{
          bottom: "10%",
          right: "20%",
          background:
            "radial-gradient(circle, rgba(236,72,153,0.1) 0%, rgba(236,72,153,0) 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Teal accent orb */}
      <div
        className="absolute w-[350px] h-[350px] rounded-full animate-float-medium"
        style={{
          top: "20%",
          left: "40%",
          background:
            "radial-gradient(circle, rgba(20,184,166,0.08) 0%, rgba(20,184,166,0) 70%)",
          filter: "blur(50px)",
          animationDelay: "-5s",
        }}
      />

      {/* Small floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20 animate-pulse-glow"
          style={{
            top: `${15 + i * 15}%`,
            left: `${10 + i * 16}%`,
            animationDelay: `${i * 0.7}s`,
          }}
        />
      ))}
    </div>
  );
}
