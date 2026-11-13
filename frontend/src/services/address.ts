import api from "./api";
import type { Address } from "../types";

export interface AddressRequest {
  locality: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export const addressesApi = {
  //get address by userId
  async getByUser(userId: number): Promise<Address[]> {
    const { data } = await api.get<Address[]>(
      `/address/user`,
    );
    return data;
  },

  //create address
  async create(userId: number, request: AddressRequest): Promise<Address> {
    const { data } = await api.post<Address>(
      `/address/add?userId=${encodeURIComponent(userId)}`,
      request,
    );
    return data;
  },

  //Remove address
  async remove(userId: number, addressId: number): Promise<void> {
    await api.delete<void>(
      `/address/delete/${addressId}?userId=${encodeURIComponent(userId)}`,
    );
  },
};
