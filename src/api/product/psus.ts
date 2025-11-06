import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export interface PsuRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  brandName: string;
  wattage: number;
  efficiency: string; // e.g., "80+ Gold"
  modularity: string; // e.g., "Semi"
  formFactor: string; // e.g., "ATX"
}

export type PsuResponse = Product & {
  brandName?: string;
  imageUrl?: string;
  wattage?: number;
  efficiency?: string;
  modularity?: string;
  formFactor?: string;
};

export const psusApi = {
  list: async (): Promise<PsuResponse[]> => {
    const res = await jsonApiClient.get<PsuResponse[]>("/psus");
    return res.data;
  },
  getById: async (id: number): Promise<PsuResponse> => {
    const res = await jsonApiClient.get<PsuResponse>(`/psus/${id}`);
    return res.data;
  },
  create: async (payload: PsuRequest, image?: File): Promise<PsuResponse> => {
    const form = buildMultipart("psu", payload, image);
    const res = await multipartApiClient.post<PsuResponse>("/psus", form);
    return res.data;
  },
  update: async (id: number, payload: Partial<PsuRequest>, image?: File): Promise<PsuResponse> => {
    const form = buildMultipart("psu", payload, image);
    const res = await multipartApiClient.put<PsuResponse>(`/psus/${id}`, form);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await jsonApiClient.delete(`/psus/${id}`);
  },
};


