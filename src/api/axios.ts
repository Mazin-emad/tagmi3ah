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
    // Force withCredentials to true for all requests
    config.withCredentials = true;
    // If sending FormData, let the browser set the Content-Type with boundary
    const isFormData =
      typeof FormData !== "undefined" && config.data instanceof FormData;
    if (isFormData) {
      if (config.headers) {
        // Axios v1 uses lowercase header keys internally
        delete (config.headers as Record<string, string>)["Content-Type"];
        delete (config.headers as Record<string, string>)["content-type"];
      }
    } else {
      // Default JSON for non-multipart requests
      if (
        config.headers &&
        !("Content-Type" in config.headers) &&
        !("content-type" in config.headers)
      ) {
        (config.headers as Record<string, string>)["Content-Type"] =
          "application/json";
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
    // Check if this is an auth error (401/403)
    if (error.response?.status === 401 || error.response?.status === 403) {
      const url = error.config?.url || "";
      // Don't clear cookie if we're already calling logout endpoint
      // (401/403 on logout means cookie is already invalid/missing)
      if (!url.includes("/auth/logout")) {
        // Just delete cookie client-side - if we got 401/403,
        // the cookie is likely already invalid or missing
        clearAuthCookie();
      }
    }

    // Convert to ApiError (which may throw AuthError for 401/403)
    const apiError = toApiError(error);

    // If toApiError threw AuthError, it will be caught here
    // Otherwise, we have a regular ApiError to throw
    return Promise.reject(apiError);
  }
);

export default apiClient;
