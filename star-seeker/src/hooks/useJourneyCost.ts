import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export type JourneyCost = {
  vehicle: string;
  cost: number;
};

const fetchJourneyCost = async (
  distance: number,
  passengers: number,
  parkingDays: number
): Promise<JourneyCost> => {
  const response = await api.get(
    `/transport/${distance}?passengers=${passengers}&parking=${parkingDays}`
  );
  return response.data;
};

export const useJourneyCost = () => {
  const [data, setData] = useState<JourneyCost | null>(null);
  const mutation = useMutation({
    mutationFn: fetchJourneyCost,
    onSuccess: (result) => setData(result),
  });

  return {
    data,
    isLoading: mutation.isPending,
    error: mutation.error,
    fetchCost: mutation.mutate,
  };
};
