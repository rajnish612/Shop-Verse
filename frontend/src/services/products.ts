import type { Product } from "../types";
import api from "./api";

export interface CreateProductRequest {
  name: string;
  description: string;
  categoryId: number;
  mrpPrice: number;
  discount: number;
  stockQuantity: number;
  imageUrls: string[];
  attributeValueIds: number[];
}
export interface ProductSearchFilters {
  keyword?: string;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  stockMin?: number;
  stockMax?: number;
  attributeValueIds?: number[];
}

export const productApis = {
  //Create product
  async create(request: CreateProductRequest): Promise<Product> {
    const { data } = await api.post("/product/create", request);
    return data;
  },
  //Get all products
  async getAll(filters: ProductSearchFilters = {}): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    // if (filters.categoryId !== undefined) params.set('categoryId', String(filters.categoryId));
    filters.categoryIds?.forEach((id) =>
      params.append("categoryIds", String(id)),
    );

    if (filters.minPrice !== undefined)
      params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", String(filters.maxPrice));
    if (filters.minRating !== undefined)
      params.set("minRating", String(filters.minRating));
    if (filters.inStock !== undefined)
      params.set("inStock", String(filters.inStock));
    if (filters.stockMin !== undefined)
      params.set("stockMin", String(filters.stockMin));
    if (filters.stockMax !== undefined)
      params.set("stockMax", String(filters.stockMax));
    filters.attributeValueIds?.forEach((id) =>
      params.append("attributeValueIds", String(id)),
    );
    const query = params.toString();
    const { data } = await api.get<Product[]>(
      `/product${query ? `?${query}` : ""}`,
    );
    return data;
  },

  //Get latest deals of products
  async getDeals(): Promise<Product[]> {
    const { data } = await api.get("/product/deals");
    return data;
  },

  //Get product by product
  async getProduct(id: number): Promise<Product> {
    const { data } = await api.get(`/product/${id}`);
    return data;
  },
};
