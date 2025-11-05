import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { metadataApi } from "@/api/metadata";
import { queryKeys } from "@/api/queryKeys";
import type { UpdateMetadataRequest } from "@/api/types";

/**
 * Hook to get metadata (categories and brands)
 *
 * @example
 * ```tsx
 * const { data: metadata, isLoading } = useMetadata();
 * ```
 */
export function useMetadata() {
  return useQuery({
    queryKey: queryKeys.metadata.all,
    queryFn: () => metadataApi.get(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to update metadata (categories and brands) - admin only
 * Invalidates metadata on success
 *
 * @example
 * ```tsx
 * const { mutate: updateMetadata, isPending } = useUpdateMetadata();
 * updateMetadata(
 *   { categories: ["CPU", "GPU"], brands: ["AMD", "Intel"] },
 *   { onSuccess: () => toast.success("Metadata updated!") }
 * );
 * ```
 */
export function useUpdateMetadata() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMetadataRequest) => metadataApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.metadata.all });
    },
  });
}

