import { apiClient, ApiResponse } from "./client";
import { GeneratedToken } from "../store/useBookingStore";

export interface BookAppointmentPayload {
  doctorId: string;
  date?: string;
  location?: string;
  age?: number;
  isEmergency?: boolean;
  visitName?: string;
  requestId?: string;
}

export interface BookAppointmentResponse {
  success: boolean;
  token: {
    id: string;
    tokenNumber: number;
    doctorId: string;
    queueId: string;
    status: string;
    type: string;
    visitingName: string;
    age?: number;
    createdAt: string;
    queue?: {
      currentToken?: number;
      totalTokens?: number;
      doctor?: {
        name?: string;
        clinicName?: string;
        clinicAddress?: string;
        consultationFee?: number;
        profilePhoto?: string;
        speciality?: string;
      };
    };
  };
}

export async function bookAppointmentApi(
  payload: BookAppointmentPayload
): Promise<ApiResponse<BookAppointmentResponse>> {
  const dateStr = payload.date || new Date().toISOString().split("T")[0];
  const reqId = payload.requestId || `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  return apiClient<BookAppointmentResponse>("/api/patient/book-appointment", {
    method: "POST",
    body: {
      doctorId: payload.doctorId,
      date: dateStr,
      location: payload.location || "",
      age: payload.age || 25,
      isEmergency: Boolean(payload.isEmergency),
      visitName: payload.visitName || "Patient",
      requestId: reqId,
    },
  });
}

export async function getMyBookingsApi(): Promise<ApiResponse<{ bookings: any[] }>> {
  return apiClient<{ bookings: any[] }>("/api/patient/my-bookings", {
    method: "GET",
  });
}

export async function cancelBookingApi(tokenId: string, reason?: string): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return apiClient<{ success: boolean; message: string }>("/api/patient/queue/cancel-token", {
    method: "POST",
    body: { tokenId, reason },
  });
}
