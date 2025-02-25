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

const createGraph = (gates: GateData[]) => {
  const graph: Record<string, { code: string; hu: number }[]> = {};
  gates.forEach((gate) => {
    graph[gate.code] = gate.links.map((link) => ({
      code: link.code,
      hu: Number(link.hu),
    }));
  });
  return graph;
};

const reconstructPath = (
  previous: Record<string, string | null>,
  end: string
) => {
  const path = [];
  let step: string | null = end;
  while (step) {
    path.unshift(step);
    step = previous[step];
  }
  return path;
};

const findRoutes = async (
  startGate: string,
  endGate: string | null
): Promise<RouteDetails[]> => {
  console.log(
    `Finding routes from ${startGate} to ${endGate || "Anywhere"}...`
  );

  const allGatesResponse = await api.get(`/gates`);
  const allGates: GateData[] = allGatesResponse.data;
  const graph = createGraph(allGates);

  console.log("Graph Structure:", graph);

  const calculateRoute = (destinationGate: GateData) => {
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
  };

  if (!endGate || endGate === "ANYWHERE") {
    return allGates
      .filter((gate) => gate.code !== startGate)
      .map(calculateRoute)
      .filter((route) => route.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance);
  } else {
    return allGates
      .map((gate) => (gate.code === endGate ? calculateRoute(gate) : null))
      .filter(
        (route): route is RouteDetails =>
          route !== null && route.distance !== Infinity
      )
      .sort((a, b) => a.distance - b.distance);
  }
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
      return {
        path: reconstructPath(previous, end),
        totalCost: distances[end],
      };
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
    mutationFn: ({
      startGate,
      endGate,
    }: {
      startGate: string;
      endGate: string | null;
    }) => findRoutes(startGate, endGate),
    onSuccess: (result) => {
      setData(result);
    },
  });

  return {
    data,
    isLoading: mutation.isPending,
    error: mutation.error,
    fetchRoutes: (startGate: string, endGate: string | null) =>
      mutation.mutate({ startGate, endGate }),
  };
};
