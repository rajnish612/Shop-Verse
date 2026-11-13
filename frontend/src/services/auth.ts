import type { User } from "../types";
import api from "./api";

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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
};
