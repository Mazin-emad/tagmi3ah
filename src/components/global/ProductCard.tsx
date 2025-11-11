import { useState } from "react";
import type { Product } from "@/api/types";
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import AddToCartButton from "./cart/AddToCartButton";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";

export const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const totalPrice = product.price * quantity;
  const productId =
    typeof product.id === "string" ? parseInt(product.id, 10) : product.id;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
          <Badge>{product.brandName}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </Link>

        <div className="pt-4 space-y-3">
          {/* Quantity controls and price on same row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[2rem] text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={handleIncrease}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">
                {formatCurrency(totalPrice)}
              </span>
              {quantity > 1 && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(product.price)} each
                </p>
              )}
            </div>
          </div>

          {/* Actions below */}
          <div className="flex gap-2">
            <AddToCartButton
              productId={productId}
              product={product}
              quantity={quantity}
              className="flex-1"
            />
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate(`/products/${product.id}`)}
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
