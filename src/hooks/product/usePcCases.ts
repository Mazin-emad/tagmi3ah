import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pcCasesApi, type PcCaseRequest } from "@/api/product/pccases";

export function usePcCases() {
  return useQuery({ queryKey: ["pccases"], queryFn: () => pcCasesApi.list() });
}

export function useCreatePcCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: PcCaseRequest; image?: File }) =>
      pcCasesApi.create(data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pccases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdatePcCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id: number; data: Partial<PcCaseRequest>; image?: File }) =>
      pcCasesApi.update(id, data, image),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pccases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeletePcCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => pcCasesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pccases"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useGetPcCaseById(id?: number) {
  return useQuery({
    queryKey: ["pccases", id],
    queryFn: () => pcCasesApi.getById(id!),
    enabled: !!id && Number.isFinite(id),
  });
}


