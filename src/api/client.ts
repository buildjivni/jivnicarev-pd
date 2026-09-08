import { Platform } from "react-native";
import { useAuthStore } from "../store/useAuthStore";
import Constants from "expo-constants";

// Candidate base URLs: Local Wi-Fi LAN, USB adb reverse loopback, emulator
export const CANDIDATE_BASE_URLS = [
  "http://10.2.8.2:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://10.0.2.2:3000",
];

let activeBaseUrl = CANDIDATE_BASE_URLS[0];

export const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return activeBaseUrl;
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  status: number;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
    headers?: Record<string, string>;
    timeoutMs?: number;
  } = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    body,
    headers = {},
    timeoutMs = 8000,
  } = options;

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const token = useAuthStore.getState().token;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Try activeBaseUrl first, then fallback to other candidates if network error
  const urlsToTry = [
    activeBaseUrl,
    ...CANDIDATE_BASE_URLS.filter((u) => u !== activeBaseUrl),
  ];

  let lastError: any = null;

  for (const base of urlsToTry) {
    const url = `${base}${cleanEndpoint}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Found working base URL
      activeBaseUrl = base;

      let json: any = null;
      const text = await res.text();
      if (text) {
        try {
          json = JSON.parse(text);
        } catch {
          json = { rawText: text };
        }
      }

      if (!res.ok) {
        const errorMsg =
          json?.error ||
          json?.message ||
          `Server returned ${res.status}: ${res.statusText}`;
        return {
          success: false,
          error: errorMsg,
          code: json?.code,
          status: res.status,
        };
      }

      return {
        success: true,
        data: (json?.data !== undefined ? json.data : json) as T,
        status: res.status,
      };
    } catch (error: any) {
      clearTimeout(timer);
      lastError = error;
      // Network/timeout error: continue to next candidate URL
    }
  }

  const isTimeout = lastError?.name === "AbortError";
  return {
    success: false,
    error: isTimeout
      ? "Network request timed out. Please check your connection."
      : lastError?.message || "Failed to connect to server.",
    code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
    status: isTimeout ? 408 : 0,
  };
}
