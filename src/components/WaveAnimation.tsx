"use client";

export default function WaveAnimation() {
  return (
    <div className="absolute bottom-0 left-0 right-0 overflow-hidden z-10">
      {/* Background wave layer */}
      <svg
        className="relative w-full h-[120px] md:h-[180px]"
        viewBox="0 0 1440 180"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6">
              <animate
                attributeName="stop-color"
                values="#8B5CF6;#3B82F6;#14B8A6;#EC4899;#8B5CF6"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#3B82F6">
              <animate
                attributeName="stop-color"
                values="#3B82F6;#14B8A6;#EC4899;#8B5CF6;#3B82F6"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#14B8A6">
              <animate
                attributeName="stop-color"
                values="#14B8A6;#EC4899;#8B5CF6;#3B82F6;#14B8A6"
                dur="8s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EC4899">
              <animate
                attributeName="stop-color"
                values="#EC4899;#8B5CF6;#3B82F6;#14B8A6;#EC4899"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#8B5CF6">
              <animate
                attributeName="stop-color"
                values="#8B5CF6;#14B8A6;#EC4899;#3B82F6;#8B5CF6"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* Back wave */}
        <path
          d="M0,100 C240,140 480,60 720,100 C960,140 1200,60 1440,100 L1440,180 L0,180 Z"
          fill="url(#wave-gradient-2)"
          opacity="0.3"
        >
          <animate
            attributeName="d"
            values="M0,100 C240,140 480,60 720,100 C960,140 1200,60 1440,100 L1440,180 L0,180 Z;
                    M0,110 C240,70 480,130 720,90 C960,60 1200,130 1440,110 L1440,180 L0,180 Z;
                    M0,100 C240,140 480,60 720,100 C960,140 1200,60 1440,100 L1440,180 L0,180 Z"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        {/* Front wave */}
        <path
          d="M0,120 C360,160 720,80 1080,120 C1260,140 1380,100 1440,120 L1440,180 L0,180 Z"
          fill="url(#wave-gradient-1)"
          opacity="0.5"
        >
          <animate
            attributeName="d"
            values="M0,120 C360,160 720,80 1080,120 C1260,140 1380,100 1440,120 L1440,180 L0,180 Z;
                    M0,130 C360,90 720,150 1080,110 C1260,90 1380,130 1440,130 L1440,180 L0,180 Z;
                    M0,120 C360,160 720,80 1080,120 C1260,140 1380,100 1440,120 L1440,180 L0,180 Z"
            dur="4s"
            repeatCount="indefinite"
          />
        </path>

        {/* Foreground wave */}
        <path
          d="M0,140 C200,170 400,130 600,150 C800,170 1000,130 1200,150 C1350,160 1440,140 1440,140 L1440,180 L0,180 Z"
          fill="url(#wave-gradient-1)"
          opacity="0.7"
        >
          <animate
            attributeName="d"
            values="M0,140 C200,170 400,130 600,150 C800,170 1000,130 1200,150 C1350,160 1440,140 1440,140 L1440,180 L0,180 Z;
                    M0,150 C200,130 400,160 600,140 C800,130 1000,160 1200,140 C1350,130 1440,150 1440,150 L1440,180 L0,180 Z;
                    M0,140 C200,170 400,130 600,150 C800,170 1000,130 1200,150 C1350,160 1440,140 1440,140 L1440,180 L0,180 Z"
            dur="5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
