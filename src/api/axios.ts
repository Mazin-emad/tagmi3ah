import axios, { type AxiosInstance, type AxiosError } from "axios";
import { toApiError } from "./errors";

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
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor: Ensures withCredentials is always true
 * and adds any additional headers if needed
 */
apiClient.interceptors.request.use(
  (config) => {
    // Force withCredentials to true for all requests
    config.withCredentials = true;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Converts Axios errors to typed ApiError
 * Throws AuthError for 401/403 responses
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Convert to ApiError (which may throw AuthError for 401/403)
    const apiError = toApiError(error);

    // If toApiError threw AuthError, it will be caught here
    // Otherwise, we have a regular ApiError to throw
    return Promise.reject(apiError);
  }
);

export default apiClient;

