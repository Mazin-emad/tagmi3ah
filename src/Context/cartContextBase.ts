import { createContext, useContext } from "react";
import type { Product, LocalCartItem } from "@/types";

export interface CartContextType {
  items: LocalCartItem[];
  addItem: (product: Product, qty?: number) => void;
  addItems: (products: Product[]) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
  updatingProductId: string | null;
  isItemInCart: (productId: string | number) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
