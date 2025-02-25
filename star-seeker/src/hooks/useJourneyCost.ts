import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export type TransportOption = {
  name: string;
  capacity: number;
  ratePerAu: number;
};

export type JourneyCost = {
  selectedTransport?: TransportOption;
  journeyCost: number;
  parkingFee: number;
  totalCost: number;
  currency: string;
  availableTransports: TransportOption[];
  warningMessage?: string;
  errorMessage?: string;
};

const fetchJourneyCost = async ({
  distance,
  passengers = 1,
  parkingDays = 0,
}: {
  distance: number;
  passengers?: number;
  parkingDays?: number;
}): Promise<JourneyCost> => {
  try {
    const response = await api.get(
      `/transport/${distance}?passengers=${passengers}&parking=${parkingDays}`
    );

    const {
      recommendedTransport,
      journeyCost,
      parkingFee,
      currency,
      availableTransports,
    } = response.data;

    let selectedTransport = recommendedTransport;
    let warningMessage = "";
    let errorMessage = "";

    if (availableTransports && availableTransports.length > 0) {
      const suitableVehicles = availableTransports.filter(
        (vehicle: { capacity: number }) => vehicle.capacity >= passengers
      );
      if (suitableVehicles.length > 0) {
        selectedTransport = suitableVehicles[0];
      } else {
        errorMessage =
          "❌ No vehicle available with enough seats for the selected number of passengers.";
      }
    }

    if (selectedTransport.capacity < passengers) {
      errorMessage =
        "🚨 No vehicle available with enough seats for the selected number of passengers.";
    } else if (selectedTransport.capacity > passengers) {
      const extraSeats = selectedTransport.capacity - passengers;
      warningMessage = `ℹ️ You can bring ${extraSeats} more ${
        extraSeats > 1 ? "passengers" : "passenger"
      } at no extra cost.`;
    } else {
      warningMessage = "";
    }

    const totalCost = (journeyCost + parkingFee).toFixed(2);
    return {
      selectedTransport: selectedTransport ?? undefined,
      journeyCost: journeyCost,
      parkingFee: parkingFee,
      totalCost: totalCost,
      currency: currency || "GBP",
      availableTransports: availableTransports || [],
      warningMessage,
      errorMessage,
    };
  } catch (error) {
    console.error("❌ Error fetching journey cost:", error);
    throw new Error("Failed to fetch journey cost");
  }
};

export const useJourneyCost = () => {
  const [data, setData] = useState<JourneyCost | null>(null);

  const mutation = useMutation({
    mutationFn: fetchJourneyCost,
    onSuccess: (result) => {
      setData(result);
    },
  });

  const fetchCost = useCallback(
    (distance: number, passengers: number = 1, parkingDays: number = 0) => {
      mutation.mutate({ distance, passengers, parkingDays });
    },
    [mutation]
  );

  return {
    data,
    isLoading: mutation.status === "pending",
    error: mutation.error,
    fetchCost,
  };
};
