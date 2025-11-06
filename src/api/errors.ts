import type { AxiosError } from "axios";
import type { ApiError } from "./types";
import { AuthError } from "./types";

/**
 * Extract error message from response data
 * Handles both string responses and object responses with message/error fields
 */
function extractErrorMessage(data: unknown, defaultMessage: string): string {
  // If data is a string, use it directly
  if (typeof data === "string") {
    return data.trim() || defaultMessage;
  }

  // If data is an object, try to extract message
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    // Try message field first
    if (typeof obj.message === "string") {
      return obj.message.trim();
    }
    // Try error field
    if (typeof obj.error === "string") {
      return obj.error.trim();
    }
    // Try to stringify if it's a simple object
    if (Object.keys(obj).length === 1 && obj.message) {
      return String(obj.message);
    }
  }

  return defaultMessage;
}

/**
 * Extract field-level errors when server returns an object like:
 * { "phoneNumber": "Mobile number must be 11 digits" }
 */
function extractFieldErrors(data: unknown): Record<string, string> | undefined {
  if (!data || typeof data !== "object") return undefined;
  const obj = data as Record<string, unknown>;
  // If there's a top-level message/error, treat it as non-field error
  if (typeof obj.message === "string" || typeof obj.error === "string") {
    return undefined;
  }
  // Collect string values as field messages
  const entries = Object.entries(obj).filter(([, v]) => typeof v === "string");
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries as Array<[string, string]>);
}

/**
 * Convert AxiosError to ApiError
 * Extracts message from response data if available, otherwise uses default message
 * Handles both string and object error responses from the server
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof AuthError) {
    return {
      status: error.status,
      message: error.message,
      details: error.payload,
    };
  }

  const axiosError = error as AxiosError<unknown>;

  if (axiosError.response) {
    const status = axiosError.response.status;
    const data = axiosError.response.data;

    // Check for 401/403 - throw AuthError
    if (status === 401 || status === 403) {
      const defaultMessage =
        status === 401
          ? "Unauthorized. Please log in."
          : "Forbidden. You don't have permission to access this resource.";
      const message = extractErrorMessage(data, defaultMessage);
      throw new AuthError(message, status, data);
    }

    // Return typed ApiError with extracted message
    const defaultMessage =
      axiosError.message || `Request failed with status ${status}`;
    const message = extractErrorMessage(data, defaultMessage);
    const fieldErrors = status === 400 ? extractFieldErrors(data) : undefined;

    return {
      status,
      message,
      details: data,
      fieldErrors,
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
