import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export type Gate = {
  code: string;
  name: string;
  location: string;
};

const fetchGates = async (): Promise<Gate[]> => {
  const response = await api.get("/gates");
  return response.data;
};

export const useGates = () => {
  return useQuery({
    queryKey: ["gates"],
    queryFn: fetchGates,
  });
};
