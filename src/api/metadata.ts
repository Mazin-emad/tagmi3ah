import apiClient from "./axios";
import type {
  UpdateMetadataRequest,
  UpdateMetadataResponse,
} from "./types";

/**
 * Metadata API functions
 */

export const metadataApi = {
  /**
   * Update metadata (categories and brands) - admin only
   */
  update: async (
    data: UpdateMetadataRequest
  ): Promise<UpdateMetadataResponse> => {
    const response = await apiClient.put<UpdateMetadataResponse>(
      "/metadata",
      data
    );
    return response.data;
  },

  /**
   * Get metadata (categories and brands)
   */
  get: async (): Promise<UpdateMetadataResponse> => {
    const response = await apiClient.get<UpdateMetadataResponse>("/metadata");
    return response.data;
  },
};

