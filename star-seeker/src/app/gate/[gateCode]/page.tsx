"use client";

import { useParams } from "next/navigation";
import { useGateDetails } from "@/hooks/useGateDetails";

export default function GateDetails() {
  const { gateCode } = useParams();
  const { data: gate, isLoading, error } = useGateDetails(gateCode as string);

  if (isLoading)
    return <p className="text-center mt-10">Loading gate details...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">Failed to load gate details.</p>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-4">{gate?.name}</h1>
      <p className="text-gray-600 text-center">Code: {gate?.code}</p>
      <p className="text-gray-600 text-center">Location: {gate?.location}</p>
      <p className="mt-6 text-lg text-center">
        {gate?.description || "No description available."}
      </p>
    </div>
  );
}
