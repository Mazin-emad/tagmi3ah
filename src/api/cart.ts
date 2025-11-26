import { jsonApiClient } from "./product/client";
import type { AxiosResponse } from "axios";
import type { CartItem, Cart, CartItemRequest } from "@/types/cart";

export type { CartItem, Cart, CartItemRequest };

export async function getMyCart(): Promise<Cart> {
  const res: AxiosResponse<Cart> = await jsonApiClient.get("/carts/me");
  return res.data;
}

export async function getAllCarts(): Promise<Cart[]> {
  const res: AxiosResponse<Cart[]> = await jsonApiClient.get("/carts");
  return res.data;
}

export async function addToCart(body: CartItemRequest): Promise<void> {
  await jsonApiClient.post("/carts/me", body);
}

export async function updateCartItem(body: CartItemRequest): Promise<Cart> {
  const res: AxiosResponse<Cart> = await jsonApiClient.put("/carts/me", body);
  return res.data;
}

export async function deleteCartItem(productId: number): Promise<void> {
  await jsonApiClient.delete(`/carts/me/${productId}`);
}

export async function deleteAllCartItems(): Promise<void> {
  await jsonApiClient.delete(`/carts/me/clear`);
}
