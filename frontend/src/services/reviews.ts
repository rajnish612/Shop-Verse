import type { Review } from "../types";
import api from "./api";

export interface CreateReviewRequest {
  rating: number;
  text: string;
  productId: number;
}
export const reviewApis = {
  //Get all reviews for specific product
  async getAll(productId: number): Promise<Review[]> {
    const { data } = await api.get(`/review/product/${productId}`);
    return data;
  },

  //create a product review
  async createReview(
    productId: number,
    request: CreateReviewRequest,
  ): Promise<Review> {
    const { data } = await api.post(
      `/review/product/${productId}?userId=${1}`,
      request,
    );
    return data;
  },
};
