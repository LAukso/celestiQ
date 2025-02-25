"use client";

import { useState } from "react";
import { useJourneyCost } from "@/hooks/useJourneyCost";

export default function JourneyCostPage() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [parkingDays, setParkingDays] = useState(0);

  const { data, isLoading, error, fetchCost } = useJourneyCost();

  const handleCalculate = () => {
    fetchCost(Number(distance), passengers, parkingDays);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">
        Journey Cost Calculator
      </h1>

      <div className="space-y-4">
        <input
          type="number"
          placeholder="Distance in AUs"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Passengers"
          value={passengers}
          min="1"
          onChange={(e) => setPassengers(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
        <input
          type="number"
          placeholder="Parking Days"
          value={parkingDays}
          min="0"
          onChange={(e) => setParkingDays(Number(e.target.value))}
          className="w-full p-2 border rounded-md"
        />
        <button
          onClick={handleCalculate}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Calculate Cost
        </button>
      </div>

      {isLoading && <p className="text-center mt-4">Calculating...</p>}
      {error && (
        <p className="text-center text-red-500">Error: {error.message}</p>
      )}

      {data && (
        <div className="mt-6 p-4 border rounded-md shadow-md bg-white">
          <h2 className="text-xl font-semibold">Cheapest Option</h2>
          <p className="text-gray-600">Vehicle: {data.vehicle}</p>
          <p className="text-gray-600">Total Cost: {data.cost} credits</p>
        </div>
      )}
    </div>
  );
}
