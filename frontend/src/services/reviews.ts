import type { Review } from "../types";
import api from "./api";

export const reviewApis = {
  //Get all reviews for specific product
  async getAll(productId: number): Promise<Review[]> {
    const { data } = await api.get(`/review/product/${productId}`);
    return data;
  },
};
