import type { User } from "../types";
import api from "./api";

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}
export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}
export const authApis = {
  //Register user
  async registerUser(request: RegisterUserRequest): Promise<User> {
    const { data } = await api.post("/auth/register", request);
    return data;
  },

  //Login user
  async loginUser(request: LoginRequest): Promise<void> {
    await api.post("/auth/login", request);
  },

  //Get current user
  async getMe(): Promise<User> {
    const { data } = await api.get("/auth/me");
    return data;
  },

  //Logout
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
  // Verify email OTP
  async verifyEmail(request: VerifyEmailRequest): Promise<void> {
    await api.post("/auth/verify-email", request);
  },

  // Resend verification OTP
  async resendOtp(request: ResendOtpRequest): Promise<void> {
    await api.post("/auth/resend-otp", request);
  },
  // Request password reset OTP
  async forgotPassword(request: ForgotPasswordRequest): Promise<void> {
    await api.post("/auth/forgot-password", null, {
      params: { email: request.email },
    });
  },

  // Reset password using OTP
  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await api.post("/auth/reset-password", request);
  },
};
