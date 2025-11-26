import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/api/auth";
import { queryKeys } from "@/api/queryKeys";
import type {
  AuthRegisterRequest,
  AuthLoginRequest,
  AuthForgotPasswordRequest,
  AuthRequireConfirmRequest,
  AuthResetPasswordRequest,
} from "@/api/types";
import type { ApiError } from "@/api/types";

/**
 * Hook to register a new user
 *
 * @example
 * ```tsx
 * const { mutate: register, isPending, isError, error } = useRegister();
 * register({ email: "user@example.com", password: "password123", name: "John" });
 * ```
 */
export function useRegister() {
  return useMutation({
    mutationFn: (data: AuthRegisterRequest) => authApi.register(data),
  });
}

/**
 * Hook to confirm account with email token
 *
 * @example
 * ```tsx
 * const { mutate: confirm, isPending, isSuccess } = useConfirmAccount();
 * confirm(token, {
 *   onSuccess: () => toast.success("Account confirmed!"),
 * });
 * ```
 */
export function useConfirmAccount() {
  return useMutation({
    mutationFn: (token: string) => authApi.confirmAccount(token),
  });
}

/**
 * Hook to login user
 * Invalidates ["auth","me"] on success to fetch updated user data
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending, error } = useLogin();
 * login(
 *   { email: "user@example.com", password: "password123" },
 *   {
 *     onSuccess: () => navigate("/dashboard"),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * ```
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuthLoginRequest) => authApi.login(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

/**
 * Hook to logout user
 * Invalidates ["auth","me"] and user-related queries on success
 *
 * @example
 * ```tsx
 * const { mutate: logout, isPending } = useLogout();
 * logout(undefined, {
 *   onSuccess: () => navigate("/login"),
 * });
 * ```
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.clear();
    },
  });
}

/**
 * Hook to request password reset email
 *
 * @example
 * ```tsx
 * const { mutate: requestReset, isPending, isSuccess } = useRequestPasswordReset();
 * requestReset({ email: "user@example.com" });
 * ```
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: AuthForgotPasswordRequest) =>
      authApi.forgotPassword(data),
  });
}

/**
 * Hook to request email confirmation resend
 *
 * @example
 * ```tsx
 * const { mutate: resendConfirm, isPending } = useRequireEmailConfirmation();
 * resendConfirm({ email: "user@example.com" });
 * ```
 */
export function useRequireEmailConfirmation() {
  return useMutation({
    mutationFn: (data: AuthRequireConfirmRequest) =>
      authApi.requireConfirm(data),
  });
}

/**
 * Hook to reset password with token from email
 *
 * @example
 * ```tsx
 * const { mutate: resetPassword, isPending } = useResetPassword();
 * resetPassword(
 *   { token: "reset-token", newPassword: "newPassword123" },
 *   {
 *     onSuccess: () => navigate("/login"),
 *   }
 * );
 * ```
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      token,
      ...data
    }: AuthResetPasswordRequest & { token: string }) =>
      authApi.resetPassword(token, data),
  });
}
