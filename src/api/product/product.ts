import type { Product } from "@/api/types";
import { jsonApiClient, multipartApiClient, buildMultipart } from "./client";

export let productsAPI={
    list: async ()=>{
        const response = await jsonApiClient.get("/products");
        return response.data;
    },
    getById: async (id:number)=>{
       const response = await jsonApiClient.get(`/products/${id}`); 
       return response.data;
    },
    create: async (payload:Product,image?:File)=>{
        const form=buildMultipart("product",payload,image);
        const response= await multipartApiClient.put(`/products`,form);
        return response.data;
    },
     update: async (
        id: number,
        payload: Partial<Product>,
        image?: File
      ): Promise<Product> => {
        const form = buildMultipart("cpu", payload, image);
        const res = await multipartApiClient.put<Product>(`/products/${id}`, form);
        return res.data;
      },
      remove: async (id: number): Promise<void> => {
        await jsonApiClient.delete(`/products/${id}`);
      },
}