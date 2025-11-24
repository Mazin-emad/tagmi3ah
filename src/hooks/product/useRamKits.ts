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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ramkits"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateRamKit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id: number; data: Partial<RamKitRequest>; image?: File }) =>
      ramKitsApi.update(id, data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ramkits"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteRamKit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ramKitsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ramkits"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetRamKitById(id?: number) {
  return useQuery({
    queryKey: ["ramkits", id],
    queryFn: () => ramKitsApi.getById(id!),
    enabled: !!id && Number.isFinite(id),
  });
}


