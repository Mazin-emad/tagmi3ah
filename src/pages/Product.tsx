import { useMemo } from "react";
import { ProductDetails } from "@/components/product/ProductDetails";
import { useParams } from "react-router-dom";
import { useGetProductById } from "@/hooks/product/useProducts";
import { useGetCpuById } from "@/hooks/product/useCpus";
import { useGetGpuById } from "@/hooks/product/useGpus";
import { useGetMotherboardById } from "@/hooks/product/useMotherboards";
import { useGetRamKitById } from "@/hooks/product/useRamKits";
import { useGetPsuById } from "@/hooks/product/usePsus";
import { useGetPcCaseById } from "@/hooks/product/usePcCases";
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
import type { Product } from "@/api/types";
import AddToCartButton from "@/components/global/cart/AddToCartButton";

const ProductPage = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : undefined;

  // First, get basic product info to determine category
  const {
    data: basicProduct,
    isLoading: isLoadingBasic,
    isError: isErrorBasic,
  } = useGetProductById(numericId);

  // Determine product category from basic product
  const categoryName = useMemo(() => {
    if (!basicProduct) return null;
    const base = basicProduct as { categoryName?: string };
    return base.categoryName?.toUpperCase() || null;
  }, [basicProduct]);

  // Fetch full details from specific endpoint based on category
  const {
    data: cpuData,
    isLoading: isLoadingCpu,
    isError: isErrorCpu,
  } = useGetCpuById(
    categoryName === "CPU" && !!basicProduct ? numericId : undefined
  );

  const {
    data: gpuData,
    isLoading: isLoadingGpu,
    isError: isErrorGpu,
  } = useGetGpuById(
    categoryName === "GPU" && !!basicProduct ? numericId : undefined
  );

  const {
    data: mbData,
    isLoading: isLoadingMb,
    isError: isErrorMb,
  } = useGetMotherboardById(
    categoryName === "MOTHERBOARD" && !!basicProduct ? numericId : undefined
  );

  const {
    data: ramData,
    isLoading: isLoadingRam,
    isError: isErrorRam,
  } = useGetRamKitById(
    (categoryName === "RAMKIT" || categoryName === "RAM") && !!basicProduct
      ? numericId
      : undefined
  );

  const {
    data: psuData,
    isLoading: isLoadingPsu,
    isError: isErrorPsu,
  } = useGetPsuById(
    categoryName === "PSU" && !!basicProduct ? numericId : undefined
  );

  const {
    data: caseData,
    isLoading: isLoadingCase,
    isError: isErrorCase,
  } = useGetPcCaseById(
    (categoryName === "PCCASE" || categoryName === "PC CASE") && !!basicProduct
      ? numericId
      : undefined
  );

  // Determine which data to use (specific endpoint response or fallback to basic product)
  const data = useMemo(() => {
    if (cpuData) return cpuData;
    if (gpuData) return gpuData;
    if (mbData) return mbData;
    if (ramData) return ramData;
    if (psuData) return psuData;
    if (caseData) return caseData;
    return basicProduct;
  }, [cpuData, gpuData, mbData, ramData, psuData, caseData, basicProduct]);

  const isLoading =
    isLoadingBasic ||
    isLoadingCpu ||
    isLoadingGpu ||
    isLoadingMb ||
    isLoadingRam ||
    isLoadingPsu ||
    isLoadingCase;
  const isError =
    isErrorBasic ||
    isErrorCpu ||
    isErrorGpu ||
    isErrorMb ||
    isErrorRam ||
    isErrorPsu ||
    isErrorCase;

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

  if (isError || !data) {
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
    stock?: number;
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
  const brand = getBrand(base);
  const image = getImage(base);
  const price = formatCurrency(base.price);
  const description = base.description ?? "";

  // Build specs based on type (excluding Type and Category)
  const specs: { label: string; value: string }[] = [];
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
    <ProductDetails
      title={title}
      brand={brand}
      price={price}
      description={description}
      image={image}
      specs={specs}
      stock={base.stock}
    >
      <AddToCartButton
        productId={Number(numericId)}
        product={base as unknown as Product}
        className="w-full sm:w-auto text-base h-12 px-8"
      />
    </ProductDetails>
  );
};

export default ProductPage;
