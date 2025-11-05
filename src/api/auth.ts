import apiClient from "./axios";
import type {
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthConfirmResponse,
  AuthForgotPasswordRequest,
  AuthForgotPasswordResponse,
  AuthRequireConfirmRequest,
  AuthRequireConfirmResponse,
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
  LogoutResponse,
} from "./index";

/**
 * Auth API functions
 */

export const authApi = {
  /**
   * Register a new user
   */
  register: async (
    data: AuthRegisterRequest
  ): Promise<AuthRegisterResponse> => {
    const response = await apiClient.post<AuthRegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  },

  /**
   * Confirm account with token from email
   */
  confirmAccount: async (token: string): Promise<AuthConfirmResponse> => {
    const response = await apiClient.get<AuthConfirmResponse>("/auth/confirm", {
      params: { token },
    });
    return response.data;
  },

  /**
   * Login user (server sets httpOnly cookie)
   */
  login: async (data: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const response = await apiClient.post<AuthLoginResponse>(
      "/auth/login",
      data
    );
    return response.data;
  },

  /**
   * Logout user (server clears cookie)
   */
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.get<LogoutResponse>("/auth/logout");
    return response.data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (
    data: AuthForgotPasswordRequest
  ): Promise<AuthForgotPasswordResponse> => {
    const response = await apiClient.post<AuthForgotPasswordResponse>(
      "/auth/forgot-password",
      data
    );
    return response.data;
  },

  /**
   * Request email confirmation resend
   */
  requireConfirm: async (
    data: AuthRequireConfirmRequest
  ): Promise<AuthRequireConfirmResponse> => {
    const response = await apiClient.post<AuthRequireConfirmResponse>(
      "/auth/require-confirm",
      data
    );
    return response.data;
  },

  /**
   * Reset password with token from email
   */
  resetPassword: async (
    token: string,
    data: AuthResetPasswordRequest
  ): Promise<AuthResetPasswordResponse> => {
    const response = await apiClient.put<AuthResetPasswordResponse>(
      "/auth/reset-password",
      data,
      {
        params: { token },
      }
    );
    return response.data;
  },
};
