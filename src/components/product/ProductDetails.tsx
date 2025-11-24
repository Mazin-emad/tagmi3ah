import { useState, cloneElement } from "react";
import type { ReactElement } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

type SpecItem = { label: string; value: string };

type ProductDetailsProps = {
  title: string;
  brand: string;
  price: string;
  description: string;
  image: string;
  specs: SpecItem[];
  stock?: number;
  children?: React.ReactNode; // For AddToCartButton with quantity
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
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    const maxQuantity = stock !== undefined ? stock : Infinity;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const maxQuantity = stock !== undefined ? stock : Infinity;
  const isOutOfStock = stock !== undefined && stock === 0;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
      {/* Title and Price at the top in a row */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex-1 min-w-0 break-words">
            {title}
          </h1>
          <span className="text-3xl md:text-4xl font-bold text-primary shrink-0">
            {price}
          </span>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Main Content: Image and Details Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        {/* Product Image - Left Side (smaller on md+) */}
        <div className="md:col-span-4 lg:col-span-3">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-muted/40">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details - Right Side */}
        <div className="md:col-span-8 lg:col-span-9 flex flex-col">
          {/* Brand and Stock Info */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Badge className="text-sm">{brand}</Badge>
            {stock !== undefined && (
              <span
                className={`text-sm font-medium ${
                  stock > 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2 mb-6">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description || "No description available."}
            </p>
          </div>

          {/* Specifications */}
          {specs.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {specs.map((item, idx) => (
                  <div
                    key={`${item.label}-${idx}`}
                    className="flex flex-col gap-1 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors"
                  >
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls and Add to Cart - At the bottom */}
          <div className="mt-auto pt-6 border-t space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  type="button"
                >
                  <MinusIcon className="h-5 w-5" />
                </Button>
                <span className="text-lg font-semibold min-w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={handleIncrease}
                  disabled={quantity >= maxQuantity || isOutOfStock}
                  type="button"
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </div>
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
