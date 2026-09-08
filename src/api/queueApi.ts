import { apiClient, ApiResponse } from "./client";

export interface LiveQueueStatus {
  token: {
    id: string;
    tokenNumber: number;
    status: "WAITING" | "BOOKED" | "READY" | "CALLED" | "IN_CONSULTATION" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    type: string;
    createdAt: string;
  };
  queue: {
    status: string;
    currentToken: number;
    totalTokens: number;
    estimatedWaitMinutes: number;
    tokensAhead: number;
  };
  doctor: {
    name: string;
    clinicName: string;
    clinicCity?: string;
    clinicDistrict?: string;
  };
}

export async function trackQueueTokenApi(
  tokenId: string
): Promise<ApiResponse<LiveQueueStatus>> {
  return apiClient<LiveQueueStatus>(`/api/public/track/${encodeURIComponent(tokenId)}`, {
    method: "GET",
    timeoutMs: 8000,
  });
}
