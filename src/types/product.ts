/**
 * Unified Product type
 * Consolidates Product definitions from api/types.ts and types/index.ts
 */
export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  categoryName: string;
  brandName: string;
  stock: number;
  // Optional fields for extended product information
  category?: string; // Short category code (e.g., "CPU", "Motherboard", "RAM")
  brand?: string; // Alternative brand field
  socket?: string;
  ramType?: string;
  type?: string; // Product type (e.g., for RAM kits)
  supportedMemoryTypes?: string[];
}
