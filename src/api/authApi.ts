import { apiClient, ApiResponse } from "./client";
import { UserProfile } from "../store/useAuthStore";

export interface SendOtpResult {
  message: string;
  sessionId: string;
  channel?: "WHATSAPP" | "SMS";
}

export interface VerifyOtpResult {
  message: string;
  userExists: boolean;
  needsProfile: boolean;
  token: string;
  user: {
    id: string;
    phone: string;
    name: string;
    role: string;
    doctorId: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
}

export interface SendEmailCodeResult {
  message: string;
  email: string;
}

export async function sendEmailOtpApi(email: string): Promise<ApiResponse<SendEmailCodeResult>> {
  return apiClient<SendEmailCodeResult>("/api/auth/email/send-code", {
    method: "POST",
    body: { email: email.trim().toLowerCase() },
  });
}

export async function verifyEmailOtpApi(
  email: string,
  code: string
): Promise<ApiResponse<VerifyOtpResult>> {
  return apiClient<VerifyOtpResult>("/api/auth/email/verify-code", {
    method: "POST",
    body: {
      email: email.trim().toLowerCase(),
      code: code.trim(),
    },
  });
}

export async function sendOtpApi(phone: string): Promise<ApiResponse<SendOtpResult>> {
  const digits = phone.replace(/\D/g, "").slice(-10);
  const phoneNumber = `+91${digits}`;
  return apiClient<SendOtpResult>("/api/auth/send-otp", {
    method: "POST",
    body: { phone: digits, phoneNumber },
  });
}

export async function verifyOtpApi(
  phone: string,
  otp: string,
  sessionId?: string,
  name?: string,
  location?: string
): Promise<ApiResponse<VerifyOtpResult>> {
  const digits = phone.replace(/\D/g, "").slice(-10);
  const phoneNumber = `+91${digits}`;
  return apiClient<VerifyOtpResult>("/api/auth/verify-otp", {
    method: "POST",
    body: {
      phone: digits,
      phoneNumber,
      otp,
      otpCode: otp,
      sessionId,
      name,
      location,
    },
  });
}

export async function updateProfileApi(
  profile: Partial<UserProfile>,
  tokenOverride?: string
): Promise<ApiResponse<{ success: boolean; user: UserProfile }>> {
  const headers: Record<string, string> = {};
  if (tokenOverride) {
    headers["Authorization"] = `Bearer ${tokenOverride}`;
  }
  return apiClient<{ success: boolean; user: UserProfile }>("/api/patient/profile", {
    method: "PUT",
    body: profile,
    headers,
  });
}

export async function googleOAuthMobileApi(
  idToken: string
): Promise<ApiResponse<{ token: string; user: any; needsPhone?: boolean; isNewPatient?: boolean }>> {
  return apiClient<{ token: string; user: any; needsPhone?: boolean; isNewPatient?: boolean }>(
    "/api/auth/mobile/google",
    {
      method: "POST",
      body: {
        idToken,
        flow: "patient",
      },
    }
  );
}

export async function deleteAccountApi(): Promise<ApiResponse<{ success: boolean; message: string }>> {
  return apiClient<{ success: boolean; message: string }>("/api/patient/account/delete", {
    method: "POST",
  });
}
