import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motherboardsApi, type MotherboardRequest } from "@/api/product/motherboards";

export function useMotherboards() {
  return useQuery({ queryKey: ["motherboards"], queryFn: () => motherboardsApi.list() });
}

export function useCreateMotherboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data, image }: { data: MotherboardRequest; image?: File }) =>
      motherboardsApi.create(data, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["motherboards"] }),
  });
}

export function useUpdateMotherboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, image }: { id: number; data: Partial<MotherboardRequest>; image?: File }) =>
      motherboardsApi.update(id, data, image),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["motherboards"] }),
  });
}

export function useDeleteMotherboard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => motherboardsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["motherboards"] }),
  });
}


