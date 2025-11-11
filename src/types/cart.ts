/**
 * Cart-related types
 */

import type { Product } from "./product";

/**
 * Server-side CartItem (from API)
 * The server includes the full product object in each cart item
 */
export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    categoryId: number | null;
    imageUrl: string;
    price: number;
    stock: number;
    description?: string;
    categoryName?: string;
    brandName?: string;
  };
  quantity: number;
}

/**
 * Local CartItem (for client-side cart with full product info)
 */
export interface LocalCartItem extends Product {
  quantity: number;
}

/**
 * Server-side Cart (from API)
 */
export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalCost: number;
}

/**
 * Request to add/update cart item
 */
export interface CartItemRequest {
  productId: number;
  quantity: number;
}
