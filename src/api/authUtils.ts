import type { QueryClient } from "@tanstack/react-query";
import { authApi } from "./auth";
import { queryKeys } from "./queryKeys";

/**
 * Flag to prevent infinite logout loops
 */
let isLoggingOut = false;

/**
 * Clear authentication state by calling logout endpoint
 * This clears the httpOnly JWT cookie on the server
 * Use this when user explicitly logs out
 */
export async function clearAuthState(): Promise<void> {
  if (isLoggingOut) {
    return;
  }

  try {
    isLoggingOut = true;
    await authApi.logout();
  } catch {
    console.log("Error logging out");
  } finally {
    isLoggingOut = false;
  }
  deleteCookie("jwt");
}

/**
 * Clear JWT cookie client-side only
 * Use this when getting 401/403 errors (no need to call logout endpoint)
 */
export function clearAuthCookie(): void {
  deleteCookie("jwt");
}

/**
 * Clear auth cache from React Query
 * This should be called after clearing auth state
 */
export function clearAuthCache(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: queryKeys.auth.me });
  queryClient.removeQueries({ queryKey: queryKeys.users.all });
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  const hostname = window.location.hostname;
  if (hostname !== "localhost") {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
  }
}
