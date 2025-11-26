import { useParams } from "react-router-dom";
import { ProductDetails } from "@/components/product/ProductDetails";
import { useProductData } from "@/hooks/useProductData";
import { formatCurrency, getBrand, getImage } from "@/lib/utils";
import { buildProductSpecs } from "@/lib/productSpecs";
import { normalizeProductData } from "@/lib/productUtils";
import type { Product } from "@/api/types";
import AddToCartButton from "@/components/global/cart/AddToCartButton";

export default function ProductPage() {
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;

  const { productData, isLoading, isError } = useProductData(numericId);

  if (isLoading) {
    return (
      <ProductDetails
        title="Loading..."
        brand=""
        price="$0.00"
        description=""
        image="https://picsum.photos/200"
        specs={[]}
        stock={0}
      />
    );
  }

  if (isError || !productData) {
    return (
      <ProductDetails
        title="Product not found"
        brand=""
        price="$0.00"
        description=""
        image="https://picsum.photos/200"
        specs={[]}
        stock={0}
      />
    );
  }

  const normalized = normalizeProductData(productData);
  const specs = buildProductSpecs(productData);

  return (
    <ProductDetails
      title={normalized.name}
      brand={normalized.brand}
      price={formatCurrency(normalized.price)}
      description={normalized.description}
      image={normalized.image}
      specs={specs}
      stock={normalized.stock}
    >
      <AddToCartButton
        productId={Number(numericId)}
        product={productData as Product}
        className="w-full sm:w-auto text-base h-12 px-8"
      />
    </ProductDetails>
  );
}
