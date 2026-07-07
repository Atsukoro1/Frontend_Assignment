"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getDonationStats, getShelters, postContribution } from "./client";
import type { ContributeRequest } from "./types";

export const queryKeys = {
  shelters: ["shelters"] as const,
  donationStats: ["donation-stats"] as const,
};

/** Interval for refreshing the collected amount / donor count. */
const STATS_REFETCH_INTERVAL_MS = 30_000;

export function useShelters() {
  return useQuery({
    queryKey: queryKeys.shelters,
    queryFn: getShelters,
    select: (data) => data.shelters ?? [],
    staleTime: 5 * 60_000,
  });
}

export function useDonationStats() {
  return useQuery({
    queryKey: queryKeys.donationStats,
    queryFn: getDonationStats,
    refetchInterval: STATS_REFETCH_INTERVAL_MS,
    refetchOnWindowFocus: true,
  });
}

export function useSubmitDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ContributeRequest) => postContribution(body),
    onSuccess: () => {
      // The freshly submitted donation should show up in the stats.
      void queryClient.invalidateQueries({ queryKey: queryKeys.donationStats });
    },
  });
}
