import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "@/api/types";

export function useProductFilters(products: Product[]) {
  const [searchParams] = useSearchParams();

  const categoryFilter = searchParams.get("category") || "";
  const brandFilter = searchParams.get("brand");
  const brandsArray = useMemo(() => {
    return brandFilter ? brandFilter.split(",").filter(Boolean) : [];
  }, [brandFilter]);
  const searchFilter = searchParams.get("search") || "";

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (categoryFilter) {
      filtered = filtered.filter(
        (product) =>
          product.categoryName?.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    if (brandsArray.length > 0) {
      filtered = filtered.filter((product) =>
        brandsArray.some(
          (brandName) =>
            product.brandName?.toLowerCase() === brandName.toLowerCase() ||
            product.brand?.toLowerCase() === brandName.toLowerCase()
        )
      );
    }

    if (searchFilter.trim()) {
      const searchLower = searchFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [products, categoryFilter, brandsArray, searchFilter]);

  return {
    filteredProducts,
    categoryFilter,
    brandsArray,
    searchFilter,
  };
}

