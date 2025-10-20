export interface Product {
  id: string;
  name: string;
  image?: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
  socket?: string;
  ramType?: string;
  supportedMemoryTypes?: string[];
}
