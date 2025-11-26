import axios, { type AxiosInstance, type AxiosError } from "axios";
import { toApiError } from "./errors";
import { clearAuthCookie } from "./authUtils";

/**
 * Get API base URL from environment variable
 * Falls back to http://localhost:8080 if not set
 */
const getBaseURL = (): string => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
};

/**
 * Create and configure Axios instance
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {},
});

/**
 * Request interceptor: Ensures withCredentials is always true
 * and adds any additional headers if needed
 */
apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers) {
        delete (config.headers as Record<string, string>)["Content-Type"];
        delete (config.headers as Record<string, string>)["content-type"];
      }
    } else {
      const hasBody = config.data !== undefined;
      if (
        hasBody &&
        config.headers &&
        !("Content-Type" in config.headers) &&
        !("content-type" in config.headers)
      ) {
        (config.headers as Record<string, string>)["Content-Type"] = "application/json";
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Converts Axios errors to typed ApiError
 * Clears JWT cookie client-side on 401/403 (no need to call logout endpoint)
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const url = error.config?.url || "";
      if (!url.includes("/auth/logout")) {
        clearAuthCookie();
      }
    }

    const apiError = toApiError(error);
    return Promise.reject(apiError);
  }
);

export default apiClient;
