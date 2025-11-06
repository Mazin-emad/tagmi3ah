import apiClient from "./axios";
import type { Brand, PageRequest, PagedResponse } from "./types";

export const brandsApi = {
  list: async ({
    page = 0,
    size = 20,
  }: PageRequest): Promise<PagedResponse<Brand>> => {
    const response = await apiClient.get<unknown>("/brands", {
      params: { page, size },
    });
    const data = response.data as unknown;
    if (Array.isArray(data)) {
      return {
        content: data as Brand[],
        page: 0,
        size: data.length,
        totalElements: data.length,
        totalPages: 1,
      };
    }
    return data as PagedResponse<Brand>;
  },
  getById: async (id: number): Promise<Brand> => {
    const response = await apiClient.get<Brand>(`/brands/${id}`);
    return response.data;
  },
  create: async (payload: Pick<Brand, "name">): Promise<Brand> => {
    const response = await apiClient.post<Brand>("/brands", payload);
    return response.data;
  },
  update: async (id: number, payload: Pick<Brand, "name">): Promise<Brand> => {
    const response = await apiClient.put<Brand>(`/brands/${id}`, payload);
    return response.data;
  },
  remove: async (id: number): Promise<void> => {
    await apiClient.delete(`/brands/${id}`);
  },
};
