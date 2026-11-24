import type { DashBoardData } from "../types";
import api from "./api";

export const dashBoardApis = {
  //Get dashboard data
  async getDashBoardData(): Promise<DashBoardData> {
    const { data } = await api.get<DashBoardData>("/dashboard");
    return data;
  },
};
