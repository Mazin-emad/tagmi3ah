import type { Product } from "@/types";
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

export const ProductCard = ({ product }: { product: Product }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
          <Badge>{product.brandName}</Badge>
        </CardTitle>
        <CardDescription>
          <Link to={`/products/${product.id}`}>{product.description}</Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover rounded-lg"
          />
        </Link>

        <div className="flex justify-between items-center pt-4">
          <span className="text-lg font-bold">${product.price}</span>
          <div className="flex gap-2">
            <Button
              className="cursor-pointer"
              onClick={() => console.log("Add to Cart")}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
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
