export interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  description: string;
  category: string;
  brand?: string;
  brandName?: string;
  stock: number;
  socket?: string;
  ramType?: string;
  type?:string;
  supportedMemoryTypes?: string[];
}
