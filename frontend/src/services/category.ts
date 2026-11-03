import { data } from "react-router";
import type { Category, CategoryCounts } from "../types";
import api from "./api";

export interface CategoryRequest {
  name: string;
  code: string;
  parentId?: number | null;
}

export const categoriesApi = {
  //Fetch all categories
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>("/category");

    return data;
  },

  //Fetch category by id
  async getById(categoryId: number): Promise<Category> {
    const { data } = await api.get<Category>(`/category/${categoryId}`);
    return data;
  },

  //Create new Category
  async create(request: CategoryRequest): Promise<Category> {
    const { data } = await api.post<Category>("/category", request);
    return data;
  },

  //Update existing category
  async update(
    categoryId: number,
    request: CategoryRequest,
  ): Promise<Category> {
    const { data } = await api.put<Category>(
      `/category/${categoryId}`,
      request,
    );
    return data;
  },

  //Delete category
  async remove(categoryId: number): Promise<void> {
    await api.delete<void>(`/category/${categoryId}`);
  },

  //Get root and nested category count
  async getCategoryCount(): Promise<CategoryCounts> {
    const { data } = await api.get<CategoryCounts>("/category/count");
    return data;
  },
};
