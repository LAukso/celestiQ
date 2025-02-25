"use client";
import { useGates } from "@/hooks/useGates";
import Link from "next/link";

export default function Home() {
  const { data: gates, isLoading, error } = useGates();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Failed to load gates.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Hyperspace Gates</h1>
      <ul className="space-y-4">
        {gates?.map((gate) => (
          <li
            key={gate.code}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <Link href={`/gate/${gate.code}`}>
              <h2 className="text-xl font-semibold hover:underline cursor-pointer">
                {gate.name}
              </h2>
            </Link>
            <p className="text-gray-600">Location: {gate.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
