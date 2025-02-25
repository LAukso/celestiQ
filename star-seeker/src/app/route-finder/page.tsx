"use client";

import { useState } from "react";
import { useGates } from "@/hooks/useGates";
import { useCheapestRoute } from "@/hooks/useCheapestRoute";

export default function RouteFinderPage() {
  const { data: gates, isLoading: loadingGates } = useGates();
  const [startGate, setStartGate] = useState("");

  const { data: routes, isLoading, error, fetchRoutes } = useCheapestRoute();

  const handleFindRoutes = () => {
    if (!startGate) return;
    fetchRoutes(startGate);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-400 mb-8">
        🛸 Find Cheapest Routes
      </h1>

      <div className="space-y-4">
        {loadingGates ? (
          <p className="text-center text-blue-300">Loading gates...</p>
        ) : (
          <>
            <select
              value={startGate}
              onChange={(e) => setStartGate(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-md bg-gray-800 text-gray-300"
            >
              <option value="">Select Starting Gate</option>
              {gates?.map((gate) => (
                <option key={gate.code} value={gate.code}>
                  {gate.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleFindRoutes}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              disabled={!startGate}
            >
              🚀 Find Routes
            </button>
          </>
        )}
      </div>

      {isLoading && (
        <p className="text-center mt-4 text-blue-300">Finding routes...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}

      {routes && (
        <div className="mt-6 p-4 border border-gray-700 rounded-md shadow-md bg-gray-800">
          <h2 className="text-xl font-semibold text-blue-300">
            Cheapest Routes
          </h2>
          <ul className="space-y-3">
            {routes.map((route, index) => (
              <li
                key={index}
                className="border border-gray-600 p-2 rounded-md bg-gray-900"
              >
                <p className="text-lg font-semibold">To: {route.to}</p>
                <p className="text-gray-400">Distance: {route.distance} AUs</p>
                <p className="text-gray-400">Cost: {route.cost} credits</p>
                <p className="text-gray-400">
                  Route: {route.route.join(" → ")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
