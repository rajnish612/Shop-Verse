import type { Product } from "../types";
import api from "./api";

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
  products: Product[];
}
export const chatApis = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const { data } = await api.post("/ai/chat", request);
    return data;
  },
  async getProductSummary(productId: number): Promise<ChatResponse> {
    const { data } = await api.get(`/ai/summary/${productId}`);
    return data;
  },
};
