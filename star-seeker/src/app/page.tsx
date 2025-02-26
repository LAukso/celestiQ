"use client";

import { useGates } from "@/hooks/useGates";
import { useState, useEffect } from "react";

interface Gate {
  code: string;
  name: string;
  location: string;
}

export default function Home() {
  const { data: gates, isLoading, error } = useGates();
  const [positions, setPositions] = useState<
    { x: number; y: number; size: string }[]
  >([]);

  const [selectedGate, setSelectedGate] = useState<Gate | null>(null); // Stores clicked gate details
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Function to generate random positions within screen limits
  const generatePositions = () => {
    if (!gates || gates.length === 0) return [];

    const newPositions: { x: number; y: number; size: string }[] = [];
    const gateSizes = ["small", "medium", "large"];
    const padding = 100; // Space between gates
    const maxAttempts = 100; // Prevents infinite loops

    gates.forEach(() => {
      let attempts = 0;
      let newX, newY;
      let isOverlapping;

      do {
        // Define viewport boundaries
        const maxWidth = window.innerWidth - 100;
        const maxHeight = window.innerHeight - 100;

        newX = Math.random() * maxWidth;
        newY = Math.random() * maxHeight;

        // Check if it overlaps existing gates
        isOverlapping = newPositions.some(
          (pos) =>
            Math.abs(pos.x - newX) < padding && Math.abs(pos.y - newY) < padding
        );

        attempts++;
      } while (isOverlapping && attempts < maxAttempts);

      // Assign a random size category
      const size = gateSizes[Math.floor(Math.random() * gateSizes.length)];

      // Store valid position with size
      newPositions.push({ x: newX, y: newY, size });
    });

    return newPositions;
  };

  // Set positions when the component mounts & update on resize
  useEffect(() => {
    const updatePositions = () => setPositions(generatePositions());

    updatePositions(); // Initial setup
    window.addEventListener("resize", updatePositions); // Update on screen resize

    return () => window.removeEventListener("resize", updatePositions);
  }, [gates]);

  const handleGateClick = (gate: any) => {
    setSelectedGate(gate);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => setSelectedGate(null), 300); // Delay unmount for smooth closing animation
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const popupElement = document.getElementById("popup");
    if (popupElement && !popupElement.contains(event.target as Node)) {
      closePopup();
    }
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isPopupOpen]);

  if (isLoading)
    return <p className="text-center mt-10 text-white">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load gates.</p>;

  return (
    <div className="relative min-h-screen text-white">
      <div className="relative w-full h-full">
        {gates?.map((gate, index) => {
          const sizeClass =
            positions[index]?.size === "small"
              ? "w-16 h-16 text-xs"
              : positions[index]?.size === "medium"
              ? "w-24 h-24 text-sm"
              : "w-32 h-32 text-lg";

          return (
            <div
              key={gate.code}
              className={`absolute flex flex-col items-center justify-center
              ${sizeClass} rounded-full border-4 border-gray-700
              transition-all duration-300 shadow-lg
              hover:shadow-blue-500/50 ring-4 ring-gray-500 cursor-pointer`}
              style={{
                top: `${positions[index]?.y}px`,
                left: `${positions[index]?.x}px`,
                background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
              }}
              onClick={() => handleGateClick(gate)}
            >
              <div className="relative w-4/5 h-4/5 rounded-full flex items-center justify-center text-white font-bold">
                {gate.code}
              </div>
            </div>
          );
        })}
      </div>

      {/* 🚀 Gate Details Popup */}
      {isPopupOpen && selectedGate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 transition-all duration-300"
          style={{
            animation: isPopupOpen
              ? "fadeIn 0.3s ease-in-out"
              : "fadeOut 0.3s ease-in-out",
          }}
        >
          <div
            id="popup"
            className="bg-gray-900 text-white p-6 rounded-lg shadow-lg relative w-96 max-w-full"
          >
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-white px-3 py-1 rounded-md"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedGate.name}</h2>
            <p>
              <strong>Code:</strong> {selectedGate.code}
            </p>
            <p>
              <strong>Description:</strong> Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. A quam asperiores ea, exercitationem
              fuga ipsum, nesciunt pariatur minima modi debitis incidunt harum
              animi est beatae, sed dolor expedita suscipit minus.
            </p>
            <p>
              <strong>Extra Details:</strong>
            </p>
            <ul>
              {selectedGate.links.map((link, index) => (
                <li key={index}>
                  <strong>HU:</strong> {link.hu}, <strong>Code:</strong>{" "}
                  {link.code}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* CSS Animation for the Liquid Effect */}
      <style jsx global>{`
        @keyframes ripple {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
