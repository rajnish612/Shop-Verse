import type { Order, OrderStatus } from "../types";
import api from "./api";
import type { PaymentMethod } from "./index";

export interface CreateOrderRequest {
  userId: number;
  addressId: number;
  paymentMethod: PaymentMethod;
  couponCode: string | null;
}
export const orderApis = {
  //Create order
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>(
      `/order/create/${request.addressId}`,
      null,
      {
        params: {
          userId: request.userId,
          paymentMethod: request.paymentMethod,
          couponCode: request.couponCode || undefined,
        },
      },
    );

    return response.data;
  },

  //Get all orders for user
  async getOrdersForUser(
    userId: number,
    status?: OrderStatus,
  ): Promise<Order[]> {
    const response = await api.get<Order[]>("/order", {
      params: {
        userId,
        status: status || undefined,
      },
    });

    return response.data;
  },

  //Get all orders for admin
  async getAllForAdmin(
    keyWord?: string,
    orderStatus?: OrderStatus,
  ): Promise<Order[]> {
    const params = new URLSearchParams();

    if (keyWord) {
      params.append("keyword", keyWord);
    }

    if (orderStatus) {
      params.append("status", orderStatus);
    }

    const response = await api.get<Order[]>(`/order/all?${params.toString()}`);
    return response.data;
  },
  //Updat order status
  async updateStatus(orderId: number, status: OrderStatus): Promise<void> {
    await api.patch(`/order/update/status/${orderId}/${status}`);
  },
};
