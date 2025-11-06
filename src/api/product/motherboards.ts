import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export interface MotherboardRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  brandName: string;
  socket: string;
  chipset: string;
  formFactor: string;
  ramType: string; // DDR4/DDR5
  ramSlots: number;
  maxMemorySpeedMHz: number;
  pcieVersion: string;
  m2Slots: number;
  wifi: boolean;
}

export type MotherboardResponse = Product & {
  brandName?: string;
  imageUrl?: string;
  socket?: string;
  chipset?: string;
  formFactor?: string;
  ramType?: string;
  ramSlots?: number;
  maxMemorySpeedMHz?: number;
  pcieVersion?: string;
  m2Slots?: number;
  wifi?: boolean;
};

export const motherboardsApi = {
  list: async (): Promise<MotherboardResponse[]> => {
    const res = await jsonApiClient.get<MotherboardResponse[]>("/motherboards");
    return res.data;
  },
  getById: async (id: number): Promise<MotherboardResponse> => {
    const res = await jsonApiClient.get<MotherboardResponse>(`/motherboards/${id}`);
    return res.data;
  },
  create: async (payload: MotherboardRequest, image?: File): Promise<MotherboardResponse> => {
    const form = buildMultipart("motherboard", payload, image);
    const res = await multipartApiClient.post<MotherboardResponse>("/motherboards", form);
    return res.data;
  },
  update: async (id: number, payload: Partial<MotherboardRequest>, image?: File): Promise<MotherboardResponse> => {
    const form = buildMultipart("motherboard", payload, image);
    const res = await multipartApiClient.put<MotherboardResponse>(`/motherboards/${id}`, form);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await jsonApiClient.delete(`/motherboards/${id}`);
  },
};


