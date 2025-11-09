import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export interface CpuRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  brandId: number;
  categoryId: number;
  cores: number;
  threads: number;
  baseClockGHz: number;
  boostClockGHz: number;
  socket: string;
  tdpW: number;
}

export type CpuResponse = Product & {
  brandName?: string;
  imageUrl?: string;
  cores?: number;
  threads?: number;
  baseClockGHz?: number;
  boostClockGHz?: number;
  socket?: string;
  tdpW?: number;
};

export const cpusApi = {
  list: async (): Promise<CpuResponse[]> => {
    const res = await jsonApiClient.get<CpuResponse[]>("/cpus");
    return res.data;
  },
  getById: async (id: number): Promise<CpuResponse> => {
    const res = await jsonApiClient.get<CpuResponse>(`/cpus/${id}`);
    return res.data;
  },
  create: async (payload: CpuRequest, image?: File): Promise<CpuResponse> => {
    const form = buildMultipart("cpu", payload, image);
    const res = await multipartApiClient.post<CpuResponse>("/cpus", form);
    return res.data;
  },
  update: async (
    id: number,
    payload: Partial<CpuRequest>,
    image?: File
  ): Promise<CpuResponse> => {
    const form = buildMultipart("cpu", payload, image);
    const res = await multipartApiClient.put<CpuResponse>(`/cpus/${id}`, form);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await jsonApiClient.delete(`/cpus/${id}`);
  },
};
