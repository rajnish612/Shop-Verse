import type { DashBoardData } from "../types";
import api from "./api";
export interface RevenueChartData {
  period: string;
  revenue: number;
}
export const dashBoardApis = {
  //Get dashboard data
  async getDashBoardData(): Promise<DashBoardData> {
    const { data } = await api.get<DashBoardData>("/dashboard");
    return data;
  },

  //Get revenue data
  async getRevenue(
    startDate: string,
    endDate: string,
  ): Promise<RevenueChartData[]> {
    const { data } = await api.get<RevenueChartData[]>("/dashboard/revenue", {
      params: { startDate, endDate },
    });

    return data;
  },
};
