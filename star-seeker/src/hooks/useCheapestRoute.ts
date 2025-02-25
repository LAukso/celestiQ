import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/services/api";

export type RouteDetails = {
  to: string;
  distance: number;
  cost: number;
  route: string[];
};

export type GateData = {
  code: string;
  name: string;
  links: { code: string; hu: string }[];
};

const fetchGateData = async (gateCode: string): Promise<GateData> => {
  const response = await api.get(`/gates/${gateCode}`);
  return response.data;
};

const findCheapestRoutes = async (
  startGate: string
): Promise<RouteDetails[]> => {
  console.log(`Finding cheapest routes from ${startGate}...`);

  const startData = await fetchGateData(startGate);
  const allGatesResponse = await api.get(`/gates`);
  const allGates: GateData[] = allGatesResponse.data;

  const graph: Record<string, { code: string; hu: number }[]> = {};
  allGates.forEach((gate) => {
    graph[gate.code] = gate.links.map((link) => ({
      code: link.code,
      hu: Number(link.hu),
    }));
  });

  console.log("Graph Structure:", graph);

  // Find shortest routes to all gates using Dijkstra’s algorithm
  const routeList: RouteDetails[] = allGates
    .filter((gate) => gate.code !== startGate)
    .map((destinationGate) => {
      const { path, totalCost } = dijkstra(
        graph,
        startGate,
        destinationGate.code
      );
      return {
        to: destinationGate.name,
        distance: totalCost,
        cost: totalCost,
        route: path,
      };
    })
    .filter((route) => route.distance !== Infinity)
    .sort((a, b) => a.distance - b.distance);

  console.log("Sorted Routes:", routeList);
  return routeList;
};

const dijkstra = (
  graph: Record<string, { code: string; hu: number }[]>,
  start: string,
  end: string
) => {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const queue: { code: string; distance: number }[] = [];

  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[start] = 0;
  queue.push({ code: start, distance: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.distance - b.distance);
    const { code } = queue.shift()!;

    if (code === end) {
      let path = [];
      let step: string | null = end;
      while (step) {
        path.unshift(step);
        step = previous[step];
      }
      return { path, totalCost: distances[end] };
    }

    graph[code]?.forEach(({ code: neighbor, hu }) => {
      const newDist = distances[code] + hu;
      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = code;
        queue.push({ code: neighbor, distance: newDist });
      }
    });
  }

  return { path: [], totalCost: Infinity };
};

export const useCheapestRoute = () => {
  const [data, setData] = useState<RouteDetails[] | null>(null);
  const mutation = useMutation({
    mutationFn: (startGate: string) => findCheapestRoutes(startGate),
    onSuccess: (result) => {
      setData(result);
    },
  });

  return {
    data,
    isLoading: mutation.isPending,
    error: mutation.error,
    fetchRoutes: (startGate: string) => mutation.mutate(startGate),
  };
};
