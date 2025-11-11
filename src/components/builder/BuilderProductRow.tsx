import { useContext, useState } from "react";
import {
  MyItemsContext,
  type AnyProductResponse,
} from "@/Context/myItemsContext";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/global/cart/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";
import type { CpuResponse } from "@/api/product/cpus";
import type { MotherboardResponse } from "@/api/product/motherboards";
import type { RamKitResponse } from "@/api/product/ramkits";

interface BuilderProductRowProps {
  product: AnyProductResponse;
}

export function BuilderProductRow({ product }: BuilderProductRowProps) {
  const { setItems, setSocket, setRamType, items } = useContext(MyItemsContext);
  const [quantity, setQuantity] = useState(1);

  const categoryName = product.categoryName || "";
  const productId =
    typeof product.id === "string" ? parseInt(product.id, 10) : product.id;
  const imageUrl = (product as { imageUrl?: string }).imageUrl || product.image;
  const brandName = product.brandName || "";

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const totalPrice = product.price * quantity;

  const handleSelect = () => {
    setItems((prev: Record<string, AnyProductResponse>) => ({
      ...prev,
      [categoryName]: product,
    }));

    const cpuProduct = product as Partial<CpuResponse>;
    const mbProduct = product as Partial<MotherboardResponse>;
    const ramProduct = product as Partial<RamKitResponse>;

    if (
      categoryName.toUpperCase() === "CPU" ||
      cpuProduct.socket ||
      cpuProduct.supportedMemoryTypes
    ) {
      setSocket((prev) => ({ ...prev, pSocket: cpuProduct.socket ?? "all" }));
      if (cpuProduct.supportedMemoryTypes?.length === 1) {
        setRamType(() => {
          return cpuProduct.supportedMemoryTypes?.[0] ?? "all";
        });
      } else {
        setRamType("all");
      }
    }
    if (
      categoryName.toUpperCase() === "MOTHERBOARD" ||
      mbProduct.socket ||
      mbProduct.ramType
    ) {
      setSocket((prev) => ({ ...prev, mSocket: mbProduct.socket ?? "all" }));
      setRamType(mbProduct.ramType ?? "all");
    }
    if (
      categoryName.toUpperCase() === "RAMKIT" ||
      categoryName.toUpperCase() === "RAM" ||
      ramProduct.type
    ) {
      if (items.CPU == undefined && items.Motherboard == undefined) {
        setRamType(ramProduct.type ?? "all");
      }
    }
  };

  const isSelected = items[categoryName]?.id === product.id;

  return (
    <TableRow className={isSelected ? "bg-primary/5 border-primary/20" : ""}>
      <TableCell className="w-16 sm:w-20">
        <Link to={`/products/${productId}`} className="block">
          <img
            src={imageUrl}
            alt={product.name}
            className="size-12 sm:size-14 object-cover rounded-md border hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        </Link>
      </TableCell>
      <TableCell className="min-w-[200px]">
        <div className="space-y-1.5">
          <Link
            to={`/products/${productId}`}
            className="font-medium hover:underline block text-sm sm:text-base"
          >
            {product.name}
          </Link>
          <Badge variant="secondary" className="text-xs">
            {brandName}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <div className="flex items-center justify-end gap-3">
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
            <span className="text-sm font-medium min-w-[1.5rem] text-center">
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
          <div className="text-right min-w-[80px]">
            <span className="text-base font-semibold text-primary">
              {formatCurrency(totalPrice)}
            </span>
            {quantity > 1 && (
              <p className="text-xs text-muted-foreground">
                {formatCurrency(product.price)} each
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="sm:hidden">
        <div className="space-y-2">
          {/* Quantity controls and price */}
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
              <span className="text-xs font-medium min-w-[1.5rem] text-center">
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
              <span className="text-sm font-semibold text-primary">
                {formatCurrency(totalPrice)}
              </span>
              {quantity > 1 && (
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(product.price)} each
                </p>
              )}
            </div>
          </div>
          {/* Actions */}
          <div className="flex flex-col gap-1.5">
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={handleSelect}
              className="w-full text-xs"
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
            <AddToCartButton
              productId={productId}
              product={product as Product}
              quantity={quantity}
              className="w-full text-xs"
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <div className="flex flex-row gap-2 justify-end">
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={handleSelect}
            className="min-w-[100px]"
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
          <AddToCartButton
            productId={productId}
            product={product as Product}
            quantity={quantity}
            className="min-w-[100px]"
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
