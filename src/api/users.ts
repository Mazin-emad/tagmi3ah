import apiClient from "./axios";
import type {
  MeResponse,
  AllUsersResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  UpdateMeResponse,
  UpdateMeRequest,
} from "./index";

/**
 * Users API functions
 */

export const usersApi = {
  /**
   * Get current authenticated user (requires auth cookie)
   */
  getMe: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>("/users/me");
    return response.data;
  },

  /**
   * Get all users (admin only, requires admin auth cookie)
   */
  getAllUsers: async (): Promise<AllUsersResponse> => {
    const response = await apiClient.get<AllUsersResponse>("/users/all");
    return response.data;
  },

  /**
   * Change current user's password
   */
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ChangePasswordResponse> => {
    const response = await apiClient.put<ChangePasswordResponse>(
      "/users/me/password",
      data
    );
    return response.data;
  },

  /**
   * Update current user's information
   */
  updateMe: async (data: UpdateMeRequest): Promise<UpdateMeResponse> => {
    const response = await apiClient.put<UpdateMeResponse>("/users/me", data);
    return response.data;
  },
};
