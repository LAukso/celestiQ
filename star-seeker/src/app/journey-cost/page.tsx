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
    <div className="max-w-3xl p-6 mx-auto mt-32">
      <div className="p-6 rounded-md shadow-md">
        <h1 className="text-4xl font-bold text-center mb-12 mt-6">
          Journey Cost Calculator
        </h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="distance" className="block font-semibold mb-1">
              🌍 Distance (AUs)
            </label>
            <input
              id="distance"
              type="number"
              placeholder="Enter distance in AUs"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="p-3 w-full border-4 border-gray-700
                transition-all duration-300 shadow-lg rounded-md
                hover:shadow-blue-500/50 ring-4 ring-gray-500 cursor-pointer appearance-none"
              style={{
                background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
              }}
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="passengers" className="block font-semibold mb-1">
              🧑‍🚀 Passengers
            </label>
            <input
              id="passengers"
              type="number"
              placeholder="Number of passengers"
              value={passengers}
              min="1"
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="p-3 w-full border-4 border-gray-700
                transition-all duration-300 shadow-lg rounded-md
                hover:shadow-blue-500/50 ring-4 ring-gray-500 cursor-pointer appearance-none"
              style={{
                background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
              }}
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="parkingDays" className="block font-semibold mb-1">
              🅿️ Parking Days
            </label>
            <input
              id="parkingDays"
              type="number"
              placeholder="Number of parking days"
              value={parkingDays}
              min="0"
              onChange={(e) => setParkingDays(Number(e.target.value))}
              className="p-3 w-full border-4 border-gray-700
                transition-all duration-300 shadow-lg rounded-md
                hover:shadow-blue-500/50 ring-4 ring-gray-500 cursor-pointer appearance-none"
              style={{
                background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
                boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
              }}
              aria-required="true"
            />
          </div>

          <button
            onClick={handleCalculate}
            className="mx-auto block w-6/12
                border-4 border-gray-700
                duration-300 shadow-lg py-3 rounded-md
                ring-4 ring-gray-500 cursor-pointer uppercase font-semibold"
            aria-live="polite"
            style={{
              background: `radial-gradient(circle, rgba(0, 51, 102, 0.7) 20%, rgba(0, 102, 204, 0.5) 80%)`,
              boxShadow: "0 0 20px rgba(0, 153, 255, 0.5)",
            }}
          >
            Calculate Cost
          </button>
        </div>
      </div>

      {isLoading && (
        <p className="text-center mt-4 " aria-live="polite">
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
        <div className="bg-gray-900 mt-5 p-6 rounded-lg shadow-lg relative  max-w-full">
          <h2 className="text-2xl font-semibol pb-3">💰 Journey Details</h2>
          <p className="text-sm">
            <strong>Vehicle:</strong> {data.selectedTransport.name} (Capacity:{" "}
            {data.selectedTransport.capacity} passengers)
          </p>
          <p className="text-sm">
            <strong>Rate Per AU:</strong> {data.selectedTransport.ratePerAu}{" "}
            {data.currency}
          </p>
          <p className="text-sm">
            <strong>Parking Fee:</strong> {data.parkingFee} {data.currency}
          </p>
          <hr className="my-2 border-gray-300" />
          <p className="text-xl font-semibold ">
            <strong>Total Cost:</strong> {data.totalCost} {data.currency}
          </p>
        </div>
      )}
    </div>
  );
}
