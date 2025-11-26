import { useMemo, useState, type ReactNode, type JSX } from "react";
import type { Product, LocalCartItem } from "@/types";
import {
  useGetMyCart,
  useAddToCart,
  useUpdateCartItem,
  useDeleteCartItem,
  useDeleteAllCartItems,
} from "@/hooks/useCart";
import { CartContext } from "./cartContextBase";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const { data: serverCart } = useGetMyCart();

  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null
  );

  const { mutate: addToServer } = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const { mutate: deleteFromServer } = useDeleteCartItem();
  const { mutate: deleteAllCartItemsOnServer } = useDeleteAllCartItems();

  const updateCartItemOnServer = (body: {
    productId: number;
    quantity: number;
  }) => {
    setUpdatingProductId(String(body.productId));
    updateCartItemMutation.mutate(body, {
      onSettled: () => {
        setUpdatingProductId(null);
      },
    });
  };

  const items = useMemo<LocalCartItem[]>(() => {
    if (!serverCart?.items || serverCart.items.length === 0) {
      return [];
    }

    return serverCart.items.map((cartItem) => {
      const product = cartItem.product;
      const localProduct: Product = {
        id: String(product.id),
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        description: product.description || "",
        categoryName: product.categoryName || "",
        brandName: product.brandName || "",
        stock: product.stock,
      };

      return {
        ...localProduct,
        quantity: cartItem.quantity,
      };
    });
  }, [serverCart]);

  const toNumberId = (id: string): number | null => {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  };

  const addItem = (product: Product, qty: number = 1) => {
    const productIdNum = toNumberId(product.id);
    if (productIdNum === null) return;

    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      const newQuantity = existing.quantity + qty;
      updateItemQuantity(product.id, newQuantity);
    } else {
      addToServer({ productId: productIdNum, quantity: qty });
    }
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    const productIdNum = toNumberId(productId);
    if (productIdNum === null) return;

    updateCartItemOnServer({ productId: productIdNum, quantity });
  };

  const addItems = (products: Product[]) => {
    const uniqueIds = new Set<number>();
    for (const p of products) {
      const n = toNumberId(p.id);
      if (n !== null && !uniqueIds.has(n)) {
        uniqueIds.add(n);
        addToServer({ productId: n, quantity: 1 });
      }
    }
  };

  const removeItem = (productId: string) => {
    const productIdNum = toNumberId(productId);
    if (productIdNum !== null) {
      deleteFromServer(productIdNum);
    }
  };

  const clearCart = () => {
    deleteAllCartItemsOnServer();
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const isItemInCart = (productId: string | number): boolean => {
    const idString = String(productId);
    return items.some((item) => item.id === idString);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        addItems,
        removeItem,
        updateItemQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
        updatingProductId,
        isItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
