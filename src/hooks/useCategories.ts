import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "@/api/categories";
import { queryKeys } from "@/api/queryKeys";
import type { Category, PageRequest } from "@/api/types";

export function useCategoriesPaged(params: Required<PageRequest>) {
  const { page, size } = params;
  return useQuery({
    queryKey: queryKeys.categories.paged(page, size),
    queryFn: () => categoriesApi.list({ page, size }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useAllCategories(enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const res = await categoriesApi.list({ page: 0, size: 10 });
      return res.content;
    },
    enabled,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Pick<Category, "name">) =>
      categoriesApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      categoriesApi.update(id, { name }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.byId(id),
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
