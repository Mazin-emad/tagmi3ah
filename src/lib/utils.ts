import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatting
export function formatCurrency(amount?: number, currency: string = "USD"): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "$0.00"
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount)
  } catch {
    return `$${amount.toFixed(2)}`
  }
}

// Product helpers shared by product pages
type WithBrand = { brand?: string }
type WithBrandName = { brandName?: string }
type WithImage = { image?: string }
type WithImageUrl = { imageUrl?: string }
type WithCategoryName = { categoryName?: string }

export function getBrand<T extends WithBrand | WithBrandName>(data: T): string {
  return (data as WithBrandName).brandName ?? (data as WithBrand).brand ?? ""
}

export function getImage<T extends WithImage | WithImageUrl>(data: T, fallback = "https://via.placeholder.com/600"): string {
  return (data as WithImageUrl).imageUrl ?? (data as WithImage).image ?? fallback
}

export function getCategoryName<T extends WithCategoryName>(data: T): string | undefined {
  return (data as WithCategoryName).categoryName
}
