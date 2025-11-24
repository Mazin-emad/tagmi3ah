import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { gpusApi, type GpuRequest, type GpuResponse } from "@/api/product/gpus";

export function useGpus() {
  return useQuery({ queryKey: ["gpus"], queryFn: () => gpusApi.list() });
}

export function useCreateGpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: GpuRequest; image?: File }) =>
      gpusApi.create(data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gpus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateGpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id: number; data: Partial<GpuRequest>; image?: File }) =>
      gpusApi.update(id, data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gpus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteGpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gpusApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gpus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}


