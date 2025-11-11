import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyCart,
  getAllCarts,
  addToCart,
  updateCartItem,
  deleteCartItem,
  type Cart,
  type CartItemRequest,
} from "@/api/cart";

const queryKeys = {
  cart: {
    me: ["cart", "me"] as const,
    all: ["carts"] as const,
  },
};

export function useGetMyCart() {
  return useQuery<Cart>({
    queryKey: queryKeys.cart.me,
    queryFn: getMyCart,
    staleTime: 60_000,
  });
}

export function useGetAllCarts() {
  return useQuery<Cart[]>({
    queryKey: queryKeys.cart.all,
    queryFn: getAllCarts,
    staleTime: 30_000,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CartItemRequest) => addToCart(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CartItemRequest) => updateCartItem(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
}

export function useDeleteCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => deleteCartItem(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart.me });
    },
  });
}
