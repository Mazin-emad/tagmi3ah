import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ramKitsApi, type RamKitRequest } from "@/api/product/ramkits";

export function useRamKits() {
  return useQuery({ queryKey: ["ramkits"], queryFn: () => ramKitsApi.list() });
}

export function useCreateRamKit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: RamKitRequest; image?: File }) =>
      ramKitsApi.create(data, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ramkits"] }),
  });
}

export function useUpdateRamKit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id: number; data: Partial<RamKitRequest>; image?: File }) =>
      ramKitsApi.update(id, data, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ramkits"] }),
  });
}

export function useDeleteRamKit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ramKitsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ramkits"] }),
  });
}


