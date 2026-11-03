import { RoleType, type UserDetails } from "../types";
import api from "./api";

export const userApi = {
  //Fetch all users
  async getAllUsers(
    keyWord: string = "",
    role: RoleType | null = null,
    active: boolean | null,
  ): Promise<UserDetails[]> {
    const queryParams = new URLSearchParams();
    if (keyWord.trim()) {
      queryParams.append("keyword", keyWord.trim());
    }

    if (role) {
      queryParams.append("role", role);
    }
    if (active != null) {
      queryParams.append("active", String(active));
    }
    const query = queryParams.toString();

    const { data } = await api.get<UserDetails[]>(
      `/user${query ? `?${query}` : ""} `,
    );

    return data;
  },

  //Update user roles
  async updateRoles(userId: number, roles: RoleType[]): Promise<UserDetails> {
    const { data } = await api.patch<UserDetails>(
      `/user/update-role/${userId}`,
      roles,
    );

    return data;
  },

  //Update user status
  async updateStatus(userId: number, active: boolean): Promise<UserDetails> {
    const queryParams = new URLSearchParams();
    if (!active) {
      queryParams.append("active", String(false));
    } else {
      queryParams.append("active", String(true));
    }
    const { data } = await api.patch(
      `/user/update-status/${userId}?${queryParams}`,
    );
    return data;
  },
};
