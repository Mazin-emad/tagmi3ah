import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { psusApi, type PsuRequest } from "@/api/product/psus";

export function usePsus() {
  return useQuery({ queryKey: ["psus"], queryFn: () => psusApi.list() });
}

export function useCreatePsu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: PsuRequest; image?: File }) =>
      psusApi.create(data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["psus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdatePsu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id: number; data: Partial<PsuRequest>; image?: File }) =>
      psusApi.update(id, data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["psus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeletePsu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => psusApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["psus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}


