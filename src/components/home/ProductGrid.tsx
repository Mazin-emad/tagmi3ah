import { ProductCard } from "@/components/global/ProductCard";
import type { Product } from "@/api/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        products.length < 4
          ? "grid-cols-[repeat(auto-fit,minmax(280px,280px))]"
          : "grid-cols-[repeat(auto-fit,minmax(260px,1fr))]",
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

