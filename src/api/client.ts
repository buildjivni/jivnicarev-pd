import { Platform } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

import Constants from "expo-constants";

// Determine default backend API base URL
export const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  
  // Staging / Production fallback or Local development
  if (__DEV__) {
    // Automatically detect dev server host IP (works on both real physical phone & emulator)
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
      (Constants as any).manifest?.debuggerHost;

    if (hostUri) {
      const hostIp = hostUri.split(":")[0];
      if (hostIp) {
        return `http://${hostIp}:3000`;
      }
    }

    // Fallback for Android (physical device LAN or emulator)
    if (Platform.OS === "android") {
      return "http://10.2.8.2:3000";
    }
    return "http://10.2.8.2:3000";
  }

  return "http://10.2.8.2:3000";
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
    timeoutMs = 12000,
  } = options;

  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  const token = useAuthStore.getState().token;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

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

    let json: any = null;
    const text = await res.text();
    if (text) {
      try {
        json = JSON.parse(text);
      } catch (e) {
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
    const isTimeout = error.name === "AbortError";
    return {
      success: false,
      error: isTimeout
        ? "Network request timed out. Please check your connection."
        : error.message || "Failed to connect to server.",
      code: isTimeout ? "TIMEOUT" : "NETWORK_ERROR",
      status: isTimeout ? 408 : 0,
    };
  }
}
