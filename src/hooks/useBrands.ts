import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { brandsApi } from "@/api/brands";
import { queryKeys } from "@/api/queryKeys";
import type { Brand, PageRequest } from "@/api/types";

export function useBrandsPaged(params: Required<PageRequest>) {
  const { page, size } = params;
  return useQuery({
    queryKey: queryKeys.brands.paged(page, size),
    queryFn: () => brandsApi.list({ page, size }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAllBrands(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.brands.all,
    queryFn: async () => {
      // Fetch first large page to approximate all
      const res = await brandsApi.list({ page: 0, size: 10 });
      return res.content;
    },
    enabled,
  });
}

export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<Brand, "name">) => brandsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useUpdateBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      brandsApi.update(id, { name }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.byId(id) });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}

export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => brandsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.all });
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
}
