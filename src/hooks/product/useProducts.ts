import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsAPI } from "@/api/product/product";
import type { Product } from "@/api/types";

export function useProducts() {
  return useQuery({ queryKey: ["cpus"], queryFn: () => productsAPI.list() });
}

export function useGetProductById(id?: number) {
  return useQuery({
    queryKey: ["product", id],
    enabled: typeof id === "number" && Number.isFinite(id),
    queryFn: () => productsAPI.getById(id as number),
    staleTime: 60_000,
  });
}

export function useCreateProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: Product; image?: File }) =>
      productsAPI.create(data, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: number;
      data: Partial<Product>;
      image?: File;
    }) => productsAPI.update(id, data, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsAPI.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
