import { apiClient, ApiResponse } from "./client";

export interface DoctorReviewPayload {
  doctorId: string;
  rating: number;
  tags?: string[];
  comment?: string;
  visitId?: string;
}

export interface PlatformFeedbackPayload {
  rating: number;
  category: "App Experience" | "Queue Accuracy" | "Clinic Coordination" | "General Feedback";
  comment: string;
  allowStories?: boolean;
}

export async function submitDoctorReviewApi(
  payload: DoctorReviewPayload
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return apiClient<{ success: boolean; message: string }>("/api/patient/ratings/doctor", {
    method: "POST",
    body: payload,
  });
}

export async function submitPlatformFeedbackApi(
  payload: PlatformFeedbackPayload
): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return apiClient<{ success: boolean; message: string }>("/api/patient/ratings/platform", {
    method: "POST",
    body: payload,
  });
}
