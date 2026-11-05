import type { Coupon } from "../types";
import api from "./api";

export interface CouponFilters {
  code?: string;
  active?: boolean;
  fromDate?: string;
  toDate?: string;
}

export interface CouponRequest {
  code: string;
  discount: number;
  percentage: boolean;
  expiresAt: string | null;
}
export const couponApi = {
  //     //
  //   async apply(code: string): Promise<Coupon> {
  //     const { data } = await api.get<Coupon>(`/coupon/code/${code}`);
  //     return data;
  //   },

  //Create coupon
  async create(request: Coupon): Promise<Coupon> {
    const { data } = await api.post<Coupon>("/coupon/create", request);
    return data;
  },

  //Get all coupons
  async getAll(filters: CouponFilters = {}): Promise<Coupon[]> {
    const params = new URLSearchParams();

    if (filters.code?.trim()) {
      params.append("code", filters.code.trim());
    }

    if (filters.active !== undefined) {
      params.append("active", String(filters.active));
    }

    if (filters.fromDate) {
      params.append("fromDate", filters.fromDate);
    }

    if (filters.toDate) {
      params.append("toDate", filters.toDate);
    }

    const query = params.toString();

    const { data } = await api.get<Coupon[]>(
      `/coupon${query ? `?${query}` : ""}`,
    );
    return data;
  },

  //Update coupon status
  async updateStatus(couponId: number, active: boolean): Promise<Coupon> {
    const query = new URLSearchParams({
      active: String(active),
    });
    const { data } = await api.patch(`/coupon/${couponId}/status?${query}`);
    return data;
  },

  //apply coupon
  async apply(code: string): Promise<Coupon> {
    const { data } = await api.get<Coupon>(`/coupon/code/${code}`);
    return data;
  },
};
