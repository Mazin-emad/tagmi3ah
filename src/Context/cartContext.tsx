import { useState, useEffect, type ReactNode, type JSX } from "react";
import type { Product } from "@/types";
import { useAddToCart, useDeleteCartItem } from "@/hooks/useCart";
import { CartContext } from "./cartContextBase";

interface CartItem extends Product {
  quantity: number;
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load from localStorage on mount
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cart");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Server sync mutations (optimistic local-first UX)
  const { mutate: addToServer } = useAddToCart();
  const { mutate: deleteFromServer } = useDeleteCartItem();

  // Save to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);

  const toNumberId = (id: string): number | null => {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  };

  const addItem = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // Best-effort sync to server cart
    const productIdNum = toNumberId(product.id);
    if (productIdNum !== null) {
      addToServer({ productId: productIdNum, quantity: 1 });
    }
  };

  const addItems = (products: Product[]) => {
    setItems((prev) => {
      const newItems = [...prev];
      products.forEach((product) => {
        const existing = newItems.find((item) => item.id === product.id);
        if (existing) {
          existing.quantity += 1;
        } else {
          newItems.push({ ...product, quantity: 1 });
        }
      });
      return newItems;
    });

    // Sync each added product to server (best-effort)
    const uniqueIds = new Set<number>();
    for (const p of products) {
      const n = toNumberId(p.id);
      if (n !== null && !uniqueIds.has(n)) {
        uniqueIds.add(n);
      }
    }
    uniqueIds.forEach((pid) => addToServer({ productId: pid, quantity: 1 }));
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
    const productIdNum = toNumberId(productId);
    if (productIdNum !== null) {
      deleteFromServer(productIdNum);
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addItems,
        removeItem,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
