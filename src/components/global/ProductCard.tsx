import type { Product } from "@/api/types";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import AddToCartButton from "./cart/AddToCartButton";
import { QuantitySelector } from "../product/QuantitySelector";
import { useQuantity } from "@/hooks/useQuantity";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { quantity, increase, decrease } = useQuantity({
    initialQuantity: 1,
    minQuantity: 1,
  });

  const totalPrice = product.price * quantity;
  const productId =
    typeof product.id === "string" ? parseInt(product.id, 10) : product.id;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-sm min-h-0">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-primary transition-colors break-words hyphens-auto"
            title={product.name}
          >
            {product.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="-mt-1 flex-1 flex flex-col">
        <Link to={`/products/${product.id}`} className="block mb-2 relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-4/3 object-cover rounded-md"
          />
          <Badge className="absolute top-2 right-2 text-xs shrink-0">
            {product.brandName}
          </Badge>
        </Link>

        <div className="flex-1 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <QuantitySelector
              quantity={quantity}
              onIncrease={increase}
              onDecrease={decrease}
              size="sm"
            />
            <div className="text-right">
              <span className="text-base font-bold">
                {formatCurrency(totalPrice)}
              </span>
              {quantity > 1 && (
                <p className="text-[10px] text-muted-foreground">
                  {formatCurrency(product.price)} each
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-1.5">
            <AddToCartButton
              productId={productId}
              product={product}
              quantity={quantity}
              className="flex-1 text-xs h-8"
            />
            <Button
              variant="outline"
              className="flex-1 text-xs h-8 px-2"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
