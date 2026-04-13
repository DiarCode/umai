import axios from "axios";
import { handleAxiosError } from "./errorHandler";

export { ApiError, NotFoundError, isApiError, isNotFoundError } from "./errorHandler";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(handleAxiosError(error));
  },
);