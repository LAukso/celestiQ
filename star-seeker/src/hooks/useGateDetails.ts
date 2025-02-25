import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export type GateDetails = {
  code: string;
  name: string;
  location: string;
  description?: string;
};

const fetchGateDetails = async (gateCode: string): Promise<GateDetails> => {
  const response = await api.get(`/gates/${gateCode}`);
  return response.data;
};

export const useGateDetails = (gateCode: string) => {
  return useQuery({
    queryKey: ["gateDetails", gateCode],
    queryFn: () => fetchGateDetails(gateCode),
    enabled: !!gateCode,
  });
};
