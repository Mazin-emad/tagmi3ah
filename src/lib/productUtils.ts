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

interface BaseProduct {
  id: number | string;
  name: string;
  price: number;
  description?: string;
  brandName?: string;
  brand?: string;
  imageUrl?: string;
  image?: string;
  categoryName?: string;
  stock?: number;
  [key: string]: unknown;
}

export function detectProductCategory(product: BaseProduct): ProductCategory | null {
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

export function normalizeProductData<T extends BaseProduct>(product: T) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    description: product.description ?? "",
    brand: product.brandName ?? product.brand ?? "",
    image: product.imageUrl ?? product.image ?? "",
    categoryName: product.categoryName,
    stock: product.stock,
  };
}

