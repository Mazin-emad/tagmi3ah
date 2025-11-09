import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export interface RamKitRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  brandId: number;
  categoryId: number;
  capacityGB: number;
  modules: number;
  speedMHz: number;
  type: string; // DDR4/DDR5
  casLatency: number;
}

export type RamKitResponse = Product & {
  brandName?: string;
  imageUrl?: string;
  capacityGB?: number;
  modules?: number;
  speedMHz?: number;
  type?: string;
  casLatency?: number;
};

export const ramKitsApi = {
  list: async (): Promise<RamKitResponse[]> => {
    const res = await jsonApiClient.get<RamKitResponse[]>("/ramkits");
    return res.data;
  },
  getById: async (id: number): Promise<RamKitResponse> => {
    const res = await jsonApiClient.get<RamKitResponse>(`/ramkits/${id}`);
    return res.data;
  },
  create: async (payload: RamKitRequest, image?: File): Promise<RamKitResponse> => {
    const form = buildMultipart("ramKit", payload, image);
    const res = await multipartApiClient.post<RamKitResponse>("/ramkits", form);
    return res.data;
  },
  update: async (id: number, payload: Partial<RamKitRequest>, image?: File): Promise<RamKitResponse> => {
    const form = buildMultipart("ramKit", payload, image);
    const res = await multipartApiClient.put<RamKitResponse>(`/ramkits/${id}`, form);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await jsonApiClient.delete(`/ramkits/${id}`);
  },
};


