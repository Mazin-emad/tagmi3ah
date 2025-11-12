import type { Product } from "@/types";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { MyItemsContext } from "@/Context/myItemsContext";
import AddToCartButton from "@/components/global/cart/AddToCartButton";

export function BuilderProductCard({ product }: { product: Product }) {
  const {
    setItems,
    setSocket,
    setRamType: setramtype,
    items,
  } = useContext(MyItemsContext);

  const handleSelect = () => {
    setItems((prev: Record<string, Product>) => ({
      ...prev,
      [product.categoryName]: product,
    }));
    // console.log("hereeeeeeee",product)
    if (product.category === "CPU") {
      setSocket((prev) => ({ ...prev, pSocket: product.socket ?? "all" }));
      if (product.supportedMemoryTypes?.length == 1) {
        //  console.log("supportedMemoryTypes",product.supportedMemoryTypes)
        setramtype(() => {
          return product.supportedMemoryTypes?.[0] ?? "all";
        });
      } else {
        setramtype("all");
      }
    }
    if (product.category === "Motherboard") {
      setSocket((prev) => ({ ...prev, mSocket: product.socket ?? "all" }));
      setramtype(product.ramType ?? "all");
    }
    if (product.category === "RAM") {
      if (items.CPU == undefined && items.Motherboard == undefined) {
        setramtype(product.type ?? "all");
        // console.log(product.type)
        // console.log(ramtype);
        // console.log("hereeeeeeee",items)
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
          <Badge>{product.brand}</Badge>
        </CardTitle>
        <CardDescription>
          <Link to={`/products/${product.id}`}>{product.description}</Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
            loading="lazy"
          />
        </Link>
        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-bold">${product.price}</span>
          <div className="flex gap-2">
            <AddToCartButton productId={product.id} product={product} />
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleSelect}
            >
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
