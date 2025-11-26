import { useMemo } from "react";
import { useProducts } from "@/hooks";
import type { Product } from "@/api/types";

export function useProductsData() {
  const {
    data: allProductsData,
    isLoading,
    error,
    refetch,
  } = useProducts({ page: 0, size: 1000000000 });

  const allProducts = useMemo(() => {
    if (!allProductsData) return [];
    if (Array.isArray(allProductsData)) {
      return allProductsData;
    }
    return allProductsData.content ?? [];
  }, [allProductsData]);

  return {
    products: allProducts as Product[],
    isLoading,
    error,
    refetch,
  };
}

