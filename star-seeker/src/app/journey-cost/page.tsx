"use client";

import { useState, useEffect, useCallback } from "react";
import { useJourneyCost } from "@/hooks/useJourneyCost";

export default function JourneyCostPage() {
  const [distance, setDistance] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [parkingDays, setParkingDays] = useState(0);
  const [warnings, setWarnings] = useState({
    warningMessage: "",
    errorMessage: "",
  });

  const { data, isLoading, error, fetchCost } = useJourneyCost();

  const handleCalculate = useCallback(() => {
    if (!distance || isNaN(Number(distance))) {
      alert("Please enter a valid distance.");
      return;
    }

    fetchCost(Number(distance), passengers, parkingDays);
  }, [distance, passengers, parkingDays, fetchCost]);

  useEffect(() => {
    if (data) {
      setWarnings({
        warningMessage: data.warningMessage ?? "",
        errorMessage: data.errorMessage ?? "",
      });
    }
  }, [data]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-500">
        🚀 Journey Cost Calculator
      </h1>

      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="distance"
              className="block text-gray-700 font-semibold mb-1"
            >
              🌍 Distance (AUs)
            </label>
            <input
              id="distance"
              type="number"
              placeholder="Enter distance in AUs"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full p-3 border rounded-md"
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="passengers"
              className="block text-gray-700 font-semibold mb-1"
            >
              🧑‍🚀 Passengers
            </label>
            <input
              id="passengers"
              type="number"
              placeholder="Number of passengers"
              value={passengers}
              min="1"
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full p-3 border rounded-md"
              aria-required="true"
            />
          </div>

          <div>
            <label
              htmlFor="parkingDays"
              className="block text-gray-700 font-semibold mb-1"
            >
              🅿️ Parking Days
            </label>
            <input
              id="parkingDays"
              type="number"
              placeholder="Number of parking days"
              value={parkingDays}
              min="0"
              onChange={(e) => setParkingDays(Number(e.target.value))}
              className="w-full p-3 border rounded-md"
              aria-required="true"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 font-semibold"
            aria-live="polite"
          >
            Calculate Cost
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="text-center mt-4 text-blue-400" aria-live="polite">
          Calculating...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500 mt-4" aria-live="assertive">
          Error: {error.message}
        </p>
      )}

      {warnings.errorMessage && (
        <p
          className="text-center mt-4 text-red-500 font-semibold"
          aria-live="assertive"
        >
          {warnings.errorMessage}
        </p>
      )}
      {warnings.warningMessage && !warnings.errorMessage && (
        <p
          className="text-center mt-4 text-yellow-500 font-semibold"
          aria-live="polite"
        >
          {warnings.warningMessage}
        </p>
      )}

      {data?.selectedTransport && !warnings.errorMessage && (
        <div className="mt-6 p-6 border rounded-md shadow-md bg-gray-100">
          <h2 className="text-2xl font-semibold text-gray-800 pb-3">
            💰 Journey Details
          </h2>
          <p className="text-gray-600 text-sm">
            <strong>Vehicle:</strong> {data.selectedTransport.name} (Capacity:{" "}
            {data.selectedTransport.capacity} passengers)
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Rate Per AU:</strong> {data.selectedTransport.ratePerAu}{" "}
            {data.currency}
          </p>
          <p className="text-gray-600 text-sm">
            <strong>Parking Fee:</strong> {data.parkingFee} {data.currency}
          </p>
          <hr className="my-2 border-gray-300" />
          <p className="text-xl font-semibold text-gray-900">
            <strong>Total Cost:</strong> {data.totalCost} {data.currency}
          </p>
        </div>
      )}
    </div>
  );
}
