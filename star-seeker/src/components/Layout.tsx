"use client";

import { ReactNode, useEffect, useState } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const [stars, setStars] = useState<
    { size: number; top: number; left: number; duration: number }[]
  >([]);

  useEffect(() => {
    // 🌠 Generate stars once on client-side only
    const generateStars = () =>
      Array.from({ length: 200 }).map(() => ({
        size: Math.random() * 2 + 1, // Star size
        top: Math.random() * 100, // Position
        left: Math.random() * 100,
        duration: Math.random() * 8 + 4, // Random twinkle speed
      }));

    setStars(generateStars());
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🌌 Deep-Space Background with Animated Nebula */}
      <div className="absolute inset-0 -z-10 animated-nebula"></div>

      {/* ✨ Static Star Background */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-50"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animation: `twinkle ${star.duration}s infinite alternate ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Page Content */}
      <div className="relative">{children}</div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes twinkle {
          0% {
            opacity: 0.4;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        .animated-nebula {
          background: radial-gradient(
              circle at 30% 50%,
              rgba(80, 20, 120, 0.15) 10%,
              transparent 50%
            ),
            radial-gradient(
              circle at 70% 80%,
              rgba(50, 20, 80, 0.1) 15%,
              transparent 50%
            ),
            black;
          background-size: 200% 200%;
          animation: nebulaMovement 60s infinite ease-in-out;
        }

        @keyframes nebulaMovement {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 5% 10%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </div>
  );
}
