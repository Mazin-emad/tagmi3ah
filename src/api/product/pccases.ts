import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export interface PcCaseRequest {
  name: string;
  price: number;
  description: string;
  stock: number;
  brandId: number;
  categoryId: number;
  formFactor: string; // ATX, mATX, etc
  maxGpuLengthMm: number;
  maxCpuCoolerHeightMm: number;
  psuFormFactor: string; // ATX, SFX
}

export type PcCaseResponse = Product & {
  brandName?: string;
  imageUrl?: string;
  formFactor?: string;
  maxGpuLengthMm?: number;
  maxCpuCoolerHeightMm?: number;
  psuFormFactor?: string;
};

export const pcCasesApi = {
  list: async (): Promise<PcCaseResponse[]> => {
    const res = await jsonApiClient.get<PcCaseResponse[]>("/pccases");
    return res.data;
  },
  getById: async (id: number): Promise<PcCaseResponse> => {
    const res = await jsonApiClient.get<PcCaseResponse>(`/pccases/${id}`);
    return res.data;
  },
  create: async (payload: PcCaseRequest, image?: File): Promise<PcCaseResponse> => {
    const form = buildMultipart("pcCase", payload, image);
    const res = await multipartApiClient.post<PcCaseResponse>("/pccases", form);
    return res.data;
  },
  update: async (id: number, payload: Partial<PcCaseRequest>, image?: File): Promise<PcCaseResponse> => {
    const form = buildMultipart("pcCase", payload, image);
    if (!image) {
      const emptyFile = new File([], "empty", { type: "application/octet-stream" });
      form.append("image", emptyFile);
    }
    const res = await multipartApiClient.put<PcCaseResponse>(`/pccases/${id}`, form);
    return res.data;
  },
  remove: async (id: number): Promise<void> => {
    await jsonApiClient.delete(`/pccases/${id}`);
  },
};


