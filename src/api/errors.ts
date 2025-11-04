import type { AxiosError } from "axios";
import type { ApiError } from "./types";
import { AuthError } from "./types";

/**
 * Convert AxiosError to ApiError
 * Extracts message from response data if available, otherwise uses default message
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof AuthError) {
    return {
      status: error.status,
      message: error.message,
      details: error.payload,
    };
  }

  const axiosError = error as AxiosError<{ message?: string; error?: string }>;

  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data;

    // Check for 401/403 - throw AuthError
    if (status === 401 || status === 403) {
      const message =
        data?.message ||
        data?.error ||
        status === 401
          ? "Unauthorized. Please log in."
          : "Forbidden. You don't have permission to access this resource.";
      throw new AuthError(message, status, data);
    }

    // Return typed ApiError
    return {
      status,
      message:
        data?.message ||
        data?.error ||
        axiosError.message ||
        `Request failed with status ${status}`,
      details: data,
    };
  }

  if (axiosError.request) {
    return {
      status: 0,
      message: "Network error. Please check your connection.",
      details: axiosError.request,
    };
  }

  return {
    status: 0,
    message: axiosError.message || "An unexpected error occurred",
    details: axiosError,
  };
}

