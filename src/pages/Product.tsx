import { ProductDetails } from "@/components/product/ProductDetails";
import { useParams } from "react-router-dom";
import { useGetProductById } from "@/hooks/product/useProducts";
import { formatCurrency, getBrand, getImage } from "@/lib/utils";
import { buildCpuSpecs } from "@/components/product/specs/CpuSpecs";
import { buildGpuSpecs } from "@/components/product/specs/GpuSpecs";
import { buildMotherboardSpecs } from "@/components/product/specs/MotherboardSpecs";
import { buildRamKitSpecs } from "@/components/product/specs/RamKitSpecs";
import { buildPsuSpecs } from "@/components/product/specs/PsuSpecs";
import { buildPcCaseSpecs } from "@/components/product/specs/PcCaseSpecs";
import type { CpuResponse } from "@/api/product/cpus";
import type { GpuResponse } from "@/api/product/gpus";
import type { MotherboardResponse } from "@/api/product/motherboards";
import type { RamKitResponse } from "@/api/product/ramkits";
import type { PsuResponse } from "@/api/product/psus";
import type { PcCaseResponse } from "@/api/product/pccases";
import type { Product } from "@/types";
import AddToCartButton from "@/components/global/cart/AddToCartButton";

const Product = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;
  const { data, isLoading, isError } = useGetProductById(numericId);

  if (isLoading) {
    return (
      <ProductDetails
        title="Loading..."
        brand=""
        price="$0.00"
        description=""
        image="https://via.placeholder.com/600"
        specs={[]}
      />
    );
  }

  if (isError || !data) {
    return (
      <ProductDetails
        title="Product not found"
        brand=""
        price="$0.00"
        description=""
        image="https://via.placeholder.com/600"
        specs={[]}
      />
    );
  }

  type BaseProduct = {
    id: number | string;
    name: string;
    price: number;
    description?: string;
    brandName?: string;
    brand?: string;
    imageUrl?: string;
    image?: string;
    categoryName?: string;
  } & Record<string, unknown>;

  const isCPU = (p: BaseProduct) =>
    p.categoryName?.toUpperCase() === "CPU" || "cores" in p || "threads" in p;
  const isGPU = (p: BaseProduct) =>
    p.categoryName?.toUpperCase() === "GPU" || "vramGB" in p;
  const isMB = (p: BaseProduct) =>
    p.categoryName?.toUpperCase() === "MOTHERBOARD" || "chipset" in p;
  const isRAM = (p: BaseProduct) =>
    p.categoryName?.toUpperCase() === "RAMKIT" ||
    p.categoryName?.toUpperCase() === "RAM" ||
    "capacityGB" in p;
  const isPSU = (p: BaseProduct) =>
    p.categoryName?.toUpperCase() === "PSU" || "wattage" in p;
  const isCASE = (p: BaseProduct) =>
    p.categoryName?.toUpperCase() === "PCCASE" ||
    p.categoryName?.toUpperCase() === "PC CASE" ||
    "psuFormFactor" in p;

  // Normalize common fields
  const base = data as BaseProduct;
  const title = base.name;
  const hasCategoryName = (
    p: BaseProduct
  ): p is BaseProduct & { categoryName: string } =>
    "categoryName" in (p as object);

  const brand = getBrand(base);
  const image = getImage(base);
  const price = formatCurrency(base.price);
  const description = base.description ?? "";

  // Build specs based on type
  const specs: { label: string; value: string }[] = [];
  const typeLabel =
    (base.categoryName?.toUpperCase() === "PC CASE"
      ? "PCCASE"
      : base.categoryName) ?? "PRODUCT";
  specs.push({ label: "Type", value: typeLabel });
  if (hasCategoryName(base))
    specs.push({ label: "Category", value: base.categoryName });
  if (isCPU(base)) specs.push(...buildCpuSpecs(base as unknown as CpuResponse));
  else if (isGPU(base))
    specs.push(...buildGpuSpecs(base as unknown as GpuResponse));
  else if (isMB(base))
    specs.push(
      ...buildMotherboardSpecs(base as unknown as MotherboardResponse)
    );
  else if (isRAM(base))
    specs.push(...buildRamKitSpecs(base as unknown as RamKitResponse));
  else if (isPSU(base))
    specs.push(...buildPsuSpecs(base as unknown as PsuResponse));
  else if (isCASE(base))
    specs.push(...buildPcCaseSpecs(base as unknown as PcCaseResponse));

  return (
    <div className="space-y-4">
      <ProductDetails
        title={title}
        brand={brand}
        price={price}
        description={description}
        image={image}
        specs={specs}
      />
      <div className="max-w-7xl mx-auto px-4 -mt-4">
        <AddToCartButton
          productId={Number(numericId)}
          product={base as Product}
          className="w-full sm:w-auto"
        />
      </div>
    </div>
  );
};

export default Product;
