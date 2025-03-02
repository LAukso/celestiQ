"use client";

import { useState, useCallback } from "react";
import { useGates } from "@/hooks/useGates";
import { useCheapestRoute } from "@/hooks/useCheapestRoute";

export default function RouteFinderPage() {
  const { data: gates, isLoading: loadingGates } = useGates();
  const [startGate, setStartGate] = useState("");
  const [endGate, setEndGate] = useState("ANYWHERE");

  const { data: routes, isLoading, error, fetchRoutes } = useCheapestRoute();

  const handleFindRoutes = useCallback(() => {
    if (!startGate) return;
    fetchRoutes(startGate, endGate === "ANYWHERE" ? null : endGate);
  }, [startGate, endGate, fetchRoutes]);

  return (
    <div className="max-w-3xl mx-auto mt-32 p-6">
      <div className="p-6 rounded-md shadow-md">
        <h1 className="text-4xl font-bold text-center mb-12 mt-6">
          🛸 Find Routes
        </h1>
        <div className="space-y-4">
          {loadingGates ? (
            <p className="text-center text-blue-300">Loading gates...</p>
          ) : (
            <>
              <div className="flex space-x-2">
                <label htmlFor="start-gate" className="sr-only">
                  Select Start Gate
                </label>
                <select
                  id="start-gate"
                  value={startGate}
                  onChange={(e) => setStartGate(e.target.value)}
                  className="w-1/2 p-3 border-4 border-gray-700
                transition-all duration-300 shadow-lg rounded-md
                hover:shadow-blue-500/50 ring-4 ring-gray-500 cursor-pointer"
                  style={{
                    background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                    boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
                  }}
                  aria-label="Select Start Gate"
                >
                  <option value="">Select Start</option>
                  {gates?.map((gate) => (
                    <option key={gate.code} value={gate.code}>
                      {gate.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="end-gate" className="sr-only">
                  Select End Gate
                </label>
                <select
                  id="end-gate"
                  value={endGate}
                  onChange={(e) => setEndGate(e.target.value)}
                  className="w-1/2 p-3 border-4 border-gray-700
                transition-all duration-300 shadow-lg rounded-md
                hover:shadow-blue-500/50 ring-4 ring-gray-500 cursor-pointer"
                  style={{
                    background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                    boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
                  }}
                  aria-label="Select End Gate"
                >
                  <option value="ANYWHERE">Anywhere</option>
                  {gates?.map((gate) => (
                    <option key={gate.code} value={gate.code}>
                      {gate.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleFindRoutes}
                // className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                className="mx-auto block w-6/12
                border-4 border-gray-700
                duration-300 shadow-lg py-3 rounded-md
                ring-4 ring-gray-500 cursor-pointer uppercase font-semibold"
                aria-live="polite"
                style={{
                  background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                  boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
                }}
                disabled={!startGate}
                aria-disabled={!startGate}
              >
                Find Routes
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

        {routes && routes.length > 0 ? (
          <div className="mt-6 p-4 border border-gray-700 rounded-md shadow-md bg-gray-800">
            <h2 className="text-xl font-semibold pb-3">Possible Routes</h2>
            <ul className="space-y-3">
              {routes.map((route, index) => (
                <li
                  key={index}
                  className="border border-gray-600 p-2 rounded-md bg-gray-900"
                >
                  <p className="text-lg font-semibold">To: {route.to}</p>
                  <p className="text-gray-400">
                    Distance: {route.distance} AUs
                  </p>
                  <p className="text-gray-400">Cost: {route.cost} credits</p>
                  <p className="text-gray-400">
                    Route: {route.route.join(" → ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-6">No available route.</p>
        )}
      </div>
    </div>
  );
}
