import type { CartItem } from "../types";
import api from "./api";

export interface AddToCartRequest {
  productId: number;
  quantity: number;
  selectedAttributes: Record<number, number>;
}
export const cartApis = {
  //Add product to cart
  async addToCart(data: AddToCartRequest): Promise<CartItem> {
    const response = await api.post<CartItem>("/cart/add", data, {
      params: {
        userId: 1,
      },
    });
    return response.data;
  },

  //Get all cart items
  async getAll(): Promise<CartItem[]> {
    const { data } = await api.get(`/cart/items`);
    return data;
  },
};
