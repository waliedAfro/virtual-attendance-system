
import api from "./api";
import { extractApiErrorMessage } from "./exception/axiosErrorHandler";
const DASHBOARD_BASE_URL = "report";

export const DashboardService = {
getDashboard: async () => {
    try {
     

      const response = await api.get(`${DASHBOARD_BASE_URL}/dashboard`);
      
      return response.data;
    } catch (error) {
      throw new Error(extractApiErrorMessage(error));
    }
  }, 

}