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
          <Badge className="absolute top-2 right-2 text-xs shrink-0">{product.brandName}</Badge>
        </Link>

        <div className="flex-1 flex flex-col justify-between space-y-2">
          {/* Quantity controls and price on same row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleDecrease}
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-3.5 w-3.5" />
              </Button>
              <span className="text-xs font-medium min-w-6 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={handleIncrease}
              >
                <PlusIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
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

          {/* Actions below */}
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
};
