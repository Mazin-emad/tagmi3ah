import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export interface GpuRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  brandId: number;
  categoryId: number;
  vramGB: number;
  tdpW: number;
  recommendedPSUWatt: number;
  performanceTier: string;
  lengthMm: number;
}

export type GpuResponse = Product & {
  categoryName?: string;
  brandName?: string;
  vramGB?: number | null;
  tdpW?: number | null;
  recommendedPSUWatt?: number | null;
  performanceTier?: string | null;
  lengthMm?: number | null;
  imageUrl?: string;
};

export const gpusApi = {
  list: async (): Promise<GpuResponse[]> => {
    const res = await jsonApiClient.get<GpuResponse[]>("/gpus");
    return res.data;
  },
  getById: async (id: number): Promise<GpuResponse> => {
    const res = await jsonApiClient.get<GpuResponse>(`/gpus/${id}`);
    return res.data;
  },
  create: async (payload: GpuRequest, image?: File): Promise<GpuResponse> => {
    const form = buildMultipart("gpu", payload, image);
    const res = await multipartApiClient.post<GpuResponse>("/gpus", form);
    return res.data;
  },
  update: async (
    id: number,
    payload: Partial<GpuRequest>,
    image?: File
  ): Promise<GpuResponse> => {
    const form = buildMultipart("gpu", payload, image);
    const res = await multipartApiClient.put<GpuResponse>(`/gpus/${id}`, form);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await jsonApiClient.delete(`/gpus/${id}`);
  },
};
