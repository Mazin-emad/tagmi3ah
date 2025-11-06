import axios, { type AxiosInstance, type AxiosError } from "axios";
import { toApiError } from "../errors";
import { clearAuthCookie } from "../authUtils";

const getBaseURL = (): string => {
  return import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
};

/**
 * Shared response error handler
 */
const handleResponseError = async (error: AxiosError) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    const url = error.config?.url || "";
    if (!url.includes("/auth/logout")) {
      clearAuthCookie();
    }
  }
  return Promise.reject(toApiError(error));
};

/**
 * JSON API client for product list, getById, delete operations
 */
export const jsonApiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

jsonApiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

jsonApiClient.interceptors.response.use(
  (response) => response,
  handleResponseError
);

/**
 * Multipart API client for product create/update operations
 * Browser automatically sets Content-Type: multipart/form-data with boundary
 */
export const multipartApiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

multipartApiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    // Remove Content-Type header for FormData - browser sets it with boundary
    if (config.data instanceof FormData && config.headers) {
      const headers = config.headers as Record<string, unknown>;
      delete headers["Content-Type"];
      delete headers["content-type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

multipartApiClient.interceptors.response.use(
  (response) => response,
  handleResponseError
);

/**
 * Builds FormData for multipart requests
 * @param jsonKey - The field name for the JSON part (e.g., "gpu", "cpu", "psu")
 * @param json - The JSON payload object
 * @param image - Image file (required for create, optional for update)
 */
export function buildMultipart(
  jsonKey: string,
  json: object,
  image?: File
): FormData {
  const form = new FormData();
  const jsonBlob = new Blob([JSON.stringify(json)], {
    type: "multipart/form-data",
  });
  form.append(jsonKey, jsonBlob);
  if (image) {
    form.append("image", image);
  }
  return form;
}
