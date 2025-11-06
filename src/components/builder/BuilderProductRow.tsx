import type { Product } from "@/types";
import { useContext } from "react";
import { MyItemsContext } from "@/Context/myItemsContext";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface BuilderProductRowProps {
  product: Product;
}

export function BuilderProductRow({ product }: BuilderProductRowProps) {
  const { setItems, setSocket, setRamType, items } = useContext(MyItemsContext);

  const handleSelect = () => {
    setItems((prev: Record<string, Product>) => ({
      ...prev,
      [product.category]: product,
    }));

    if (product.category === "CPU") {
      setSocket((prev) => ({ ...prev, pSocket: product.socket ?? "all" }));
      if (product.supportedMemoryTypes?.length == 1) {
        setRamType(() => {
          return product.supportedMemoryTypes?.[0] ?? "all";
        });
      } else {
        setRamType("all");
      }
    }
    if (product.category === "Motherboard") {
      setSocket((prev) => ({ ...prev, mSocket: product.socket ?? "all" }));
      setRamType(product.ramType ?? "all");
    }
    if (product.category === "RAM") {
      if (items.CPU == undefined && items.Motherboard == undefined) {
        setRamType(product.type ?? "all");
      }
    }
  };

  const isSelected = items[product.category]?.id === product.id;

  return (
    <TableRow
      className={isSelected ? "bg-primary/5 border-primary/20" : ""}
    >
      <TableCell className="w-16 sm:w-20">
        <Link to={`/products/${product.id}`} className="block">
          <img
            src={product.image}
            alt={product.name}
            className="size-12 sm:size-14 object-cover rounded-md border hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        </Link>
      </TableCell>
      <TableCell className="min-w-[200px]">
        <div className="space-y-1.5">
          <Link
            to={`/products/${product.id}`}
            className="font-medium hover:underline block text-sm sm:text-base"
          >
            {product.name}
          </Link>
          <Badge variant="secondary" className="text-xs">
            {product.brand}
          </Badge>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <span className="text-base font-semibold text-primary">
          ${product.price.toFixed(2)}
        </span>
      </TableCell>
      <TableCell className="sm:hidden">
        <div className="space-y-2">
          <div className="text-right">
            <span className="text-sm font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              onClick={handleSelect}
              className="w-full text-xs"
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log("Add to Cart")}
              className="w-full text-xs"
            >
              Add to Cart
            </Button>
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log("Add to Cart")}
            className="min-w-[100px]"
          >
            Add to Cart
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

