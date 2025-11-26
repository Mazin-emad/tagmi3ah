import type { Product } from "@/api/types";

export type ProductCategory =
  | "CPU"
  | "GPU"
  | "MOTHERBOARD"
  | "RAMKIT"
  | "RAM"
  | "PSU"
  | "PCCASE"
  | "PC CASE";

export function detectProductCategory(
  product: Product
): ProductCategory | null {
  const categoryName = product.categoryName?.toUpperCase();

  if (categoryName === "CPU" || "cores" in product || "threads" in product) {
    return "CPU";
  }
  if (categoryName === "GPU" || "vramGB" in product) {
    return "GPU";
  }
  if (categoryName === "MOTHERBOARD" || "chipset" in product) {
    return "MOTHERBOARD";
  }
  if (
    categoryName === "RAMKIT" ||
    categoryName === "RAM" ||
    "capacityGB" in product
  ) {
    return "RAMKIT";
  }
  if (categoryName === "PSU" || "wattage" in product) {
    return "PSU";
  }
  if (
    categoryName === "PCCASE" ||
    categoryName === "PC CASE" ||
    "psuFormFactor" in product
  ) {
    return "PCCASE";
  }

  return null;
}

export function normalizeProductData<T extends Product>(product: T) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description ?? "",
    brand: product.brandName ?? product.brand ?? "",
    imageUrl: product.imageUrl ?? "",
    categoryName: product.categoryName,
    stock: product.stock,
  };
}
