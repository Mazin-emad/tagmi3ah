import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/Context/cartContextBase";
import type { Product } from "@/types";
import { toast } from "sonner";

type AddToCartButtonProps = {
  productId: number | string;
  product?: Product;
  quantity?: number;
  className?: string;
  label?: string;
};

export default function AddToCartButton({
  productId,
  product,
  quantity = 1,
  className,
  label = "Add to Cart",
}: AddToCartButtonProps) {
  const { addItem, isItemInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const isInCart = isItemInCart(productId);
  const isOutOfStock = product?.stock !== undefined && product.stock === 0;
  const isDisabled = isAdding || isInCart || !product || isOutOfStock;

  const handleAdd = async () => {
    if (!product) {
      toast.error("Product information is required");
      return;
    }

    const numericId =
      typeof productId === "string" ? Number(productId) : productId;
    if (!Number.isFinite(numericId)) {
      toast.error("Invalid product id");
      return;
    }

    if (isInCart) {
      toast.info("Product is already in your cart");
      return;
    }

    try {
      setIsAdding(true);

      // Add to cart (this will handle server sync automatically)
      addItem(product, quantity);

      toast.success("Added to cart");
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? "Failed to add to cart";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button onClick={handleAdd} disabled={isDisabled} className={className}>
      {isAdding
        ? "Adding..."
        : isOutOfStock
        ? "Out of Stock"
        : isInCart
        ? "Already in Cart"
        : label}
    </Button>
  );
}
