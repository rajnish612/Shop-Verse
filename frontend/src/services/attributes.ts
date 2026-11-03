import type { ProductAttribute } from "../types";
import api from "./api";

export const attributesApi = {
  //Fetch all attributes
  async getAll(): Promise<ProductAttribute[]> {
    const { data } = await api.get<ProductAttribute[]>("/attributes/all");
    return data;
  },

  //Create attribute
  async create(name: string, values: string[]): Promise<ProductAttribute> {
    const { data } = await api.post<ProductAttribute>("/attributes/create", {
      name,
      values,
    });
    return data;
  },

  //Update attribute name
  async updateName(id: number, name: string): Promise<ProductAttribute> {
    const queryParams = new URLSearchParams();
    queryParams.append("name", name);
    const { data } = await api.patch(
      `/attributes/update/attribute-name/${id}?${queryParams}`,
    );
    return data;
  },

  // Add attribute value
  async addValue(id: number, value: string): Promise<Record<number, string>> {
    const queryParams = new URLSearchParams();
    queryParams.append("value", value);

    const { data } = await api.put<Record<number, string>>(
      `/attributes/add/attribute-value/${id}?${queryParams.toString()}`,
    );

    return data;
  },

  //Delete attribute value
  async deleteValue(id: number): Promise<void> {
    await api.delete(`/attributes/delete/attribute-value/${id}`);
  },
  //Delete attribute
  async deleteAttribute(id: number): Promise<void> {
    await api.delete(`/attributes/delete/attribute/${id}`);
  },
};
