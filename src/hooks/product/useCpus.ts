import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cpusApi, type CpuRequest } from "@/api/product/cpus";

export function useCpus() {
  return useQuery({ queryKey: ["cpus"], queryFn: () => cpusApi.list() });
}

export function useCreateCpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: CpuRequest; image?: File }) =>
      cpusApi.create(data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cpus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateCpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
      image,
    }: {
      id: number;
      data: Partial<CpuRequest>;
      image?: File;
    }) => cpusApi.update(id, data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cpus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteCpu() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cpusApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cpus"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
