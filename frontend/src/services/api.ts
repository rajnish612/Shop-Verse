import axios from "axios";
import { toast } from "sonner";
export const API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_URL + "/api",
  withCredentials: true,
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || "Something went wrong.";
      const url = error.config?.url || "";
      if (status === 401) {
        // Login failures are handled by the login page.
        if (url.includes("/auth/login")) {
          return Promise.reject(error);
        }

        // Initial authentication check: no session is normal.
        if (url.includes("/auth/me")) {
          return Promise.reject(error);
        }

        window.dispatchEvent(new Event("auth:unauthorized"));
        toast.error("Your session has expired. Please log in again.");
      } else if (status === 403) {
        toast.error(message);
      } else {
        toast.error(message);
      }
    } else if (error.request) {
      toast.error("Unable to connect to the server. Please try again.");
    } else {
      toast.error(error.message || "Something went wrong.");
    }

    return Promise.reject(error);
  },
);
export default api;
