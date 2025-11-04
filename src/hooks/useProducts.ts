import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/api/products";
import { queryKeys } from "@/api/queryKeys";
import type { CreateProductRequest } from "@/api/types";
import type { ApiError } from "@/api/types";

/**
 * Hook to get all products
 *
 * @example
 * ```tsx
 * const { data: products, isLoading } = useProducts();
 * ```
 */
export function useProducts() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => productsApi.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get product by ID
 *
 * @example
 * ```tsx
 * const { data: product, isLoading } = useProduct(productId);
 * ```
 */
export function useProduct(id: string) {
  return useQuery({
    queryKey: [...queryKeys.products.all, id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new product (admin only)
 * Invalidates products list on success
 *
 * @example
 * ```tsx
 * const { mutate: createProduct, isPending } = useCreateProduct();
 * createProduct(
 *   { name: "Product", price: 100, ... },
 *   {
 *     onSuccess: () => toast.success("Product created!"),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * ```
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.create(data),
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

/**
 * Hook to update a product (admin only)
 * Invalidates products list and specific product on success
 *
 * @example
 * ```tsx
 * const { mutate: updateProduct, isPending } = useUpdateProduct();
 * updateProduct(
 *   { id: "123", name: "Updated Name" },
 *   { onSuccess: () => toast.success("Updated!") }
 * );
 * ```
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: Partial<CreateProductRequest> & { id: string }) =>
      productsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.products.all, variables.id],
      });
    },
  });
}

/**
 * Hook to delete a product (admin only)
 * Invalidates products list on success
 *
 * @example
 * ```tsx
 * const { mutate: deleteProduct, isPending } = useDeleteProduct();
 * deleteProduct("123", { onSuccess: () => toast.success("Deleted!") });
 * ```
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}

