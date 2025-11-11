import { createContext, useContext } from "react";
import type { Product } from "@/types";

export interface CartItem extends Product {
	quantity: number;
}

export interface CartContextType {
	items: CartItem[];
	addItem: (product: Product) => void;
	addItems: (products: Product[]) => void;
	removeItem: (productId: string) => void;
	clearCart: () => void;
	getTotalPrice: () => number;
	getItemCount: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
}


