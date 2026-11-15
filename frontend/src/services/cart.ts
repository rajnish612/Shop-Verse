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
    const response = await api.post<CartItem>("/cart/add", data);
    return response.data;
  },

  //Get all cart items
  async getAll(): Promise<CartItem[]> {
    const { data } = await api.get(`/cart/items`);
    return data;
  },
  // Increase cart item quantity by 1
  async increaseQuantity(cartItemId: number): Promise<CartItem> {
    const response = await api.patch<CartItem>(
      `/cart/items/${cartItemId}/increase`,
    );
    return response.data;
  },

  // Decrease cart item quantity by 1
  async decreaseQuantity(cartItemId: number): Promise<CartItem> {
    const response = await api.patch<CartItem>(
      `/cart/items/${cartItemId}/decrease`,
    );

    return response.data;
  },
};
