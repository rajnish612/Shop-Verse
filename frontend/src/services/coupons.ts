import type { Coupon } from "../types";
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
  async getAll(
    filters: CouponFilters = {},
    page: number = 0,
    size: number = 10,
  ): Promise<PageResponse<Coupon>> {
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

    params.append("page", String(page));
    params.append("size", String(size));

    const query = params.toString();

    const { data } = await api.get<PageResponse<Coupon>>(
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

  //used coupons
  async getUsedCoupons(): Promise<Coupon[]> {
    const { data } = await api.get<Coupon[]>("/coupon/used");
    return data;
  },
};
