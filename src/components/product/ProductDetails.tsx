import { cloneElement } from "react";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductHeader } from "./ProductHeader";
import { ProductImage } from "./ProductImage";
import { StockBadge } from "./StockBadge";
import { ProductDescription } from "./ProductDescription";
import { ProductSpecsGrid } from "./ProductSpecsGrid";
import { QuantitySelector } from "./QuantitySelector";
import { useQuantity } from "@/hooks/useQuantity";

type SpecItem = { label: string; value: string };

type ProductDetailsProps = {
  title: string;
  brand: string;
  price: string;
  description: string;
  image: string;
  specs: SpecItem[];
  stock?: number;
  children?: React.ReactNode;
};

export function ProductDetails({
  title,
  brand,
  price,
  description,
  image,
  specs,
  stock,
  children,
}: ProductDetailsProps) {
  const { quantity, increase, decrease } = useQuantity({
    initialQuantity: 1,
    minQuantity: 1,
    maxQuantity: stock,
  });

  const isOutOfStock = stock !== undefined && stock === 0;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      <ProductHeader title={title} price={price} />
      <Separator className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        <div className="md:col-span-4 lg:col-span-3">
          <ProductImage src={image} alt={title} loading="eager" />
        </div>

        <div className="md:col-span-8 lg:col-span-9 flex flex-col">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge className="text-sm">{brand}</Badge>
            {stock !== undefined && <StockBadge stock={stock} />}
          </div>

          <ProductDescription description={description} className="mb-6" />

          <ProductSpecsGrid specs={specs} className="mb-6" />

          <div className="mt-auto pt-6 border-t space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-medium">Quantity:</label>
              <QuantitySelector
                quantity={quantity}
                onIncrease={increase}
                onDecrease={decrease}
                maxQuantity={stock}
                disabled={isOutOfStock}
                size="md"
              />
            </div>
            {children && (
              <div className="flex items-center gap-4">
                {cloneElement(children as ReactElement<{ quantity?: number }>, {
                  quantity,
                })}
              </div>
            )}
            {isOutOfStock && (
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                This product is currently out of stock.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
