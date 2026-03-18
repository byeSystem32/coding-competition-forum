import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "float-medium": "float-medium 15s ease-in-out infinite",
        "float-fast": "float-fast 10s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "fade-in": "fade-in 0.6s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "25%": { transform: "translate(30px, -30px) rotate(5deg)" },
          "50%": { transform: "translate(-20px, -60px) rotate(-5deg)" },
          "75%": { transform: "translate(20px, -30px) rotate(3deg)" },
        },
        "float-medium": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-40px, -20px) scale(1.1)" },
          "66%": { transform: "translate(30px, -40px) scale(0.9)" },
        },
        "float-fast": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg) scale(1)" },
          "50%": { transform: "translate(20px, -30px) rotate(10deg) scale(1.05)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
