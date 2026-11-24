import { RoleType, type UserDetails } from "../types";
import api from "./api";
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
export const userApi = {
  //Fetch all users
  async getAllUsers(
    keyWord: string = "",
    role: RoleType | null = null,
    active: boolean | null,
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<UserDetails>> {
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

    queryParams.append("page", page.toString());
    queryParams.append("size", size.toString());
    const query = queryParams.toString();

    const { data } = await api.get<PageResponse<UserDetails>>(
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
