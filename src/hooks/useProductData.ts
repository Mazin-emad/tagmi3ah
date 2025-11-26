import { useMemo } from "react";
import { useGetProductById } from "@/hooks/product/useProducts";
import { useGetCpuById } from "@/hooks/product/useCpus";
import { useGetGpuById } from "@/hooks/product/useGpus";
import { useGetMotherboardById } from "@/hooks/product/useMotherboards";
import { useGetRamKitById } from "@/hooks/product/useRamKits";
import { useGetPsuById } from "@/hooks/product/usePsus";
import { useGetPcCaseById } from "@/hooks/product/usePcCases";
import { detectProductCategory } from "@/lib/productUtils";

export function useProductData(productId: number | undefined) {
  const {
    data: basicProduct,
    isLoading: isLoadingBasic,
    isError: isErrorBasic,
  } = useGetProductById(productId);

  const categoryName = useMemo(() => {
    if (!basicProduct) return null;
    return detectProductCategory(basicProduct);
  }, [basicProduct]);

  const shouldFetchCpu = categoryName === "CPU" && !!basicProduct;
  const shouldFetchGpu = categoryName === "GPU" && !!basicProduct;
  const shouldFetchMb = categoryName === "MOTHERBOARD" && !!basicProduct;
  const shouldFetchRam =
    (categoryName === "RAMKIT" || categoryName === "RAM") && !!basicProduct;
  const shouldFetchPsu = categoryName === "PSU" && !!basicProduct;
  const shouldFetchCase =
    (categoryName === "PCCASE" || categoryName === "PC CASE") && !!basicProduct;

  const { data: cpuData, isLoading: isLoadingCpu, isError: isErrorCpu } =
    useGetCpuById(shouldFetchCpu ? productId : undefined);

  const { data: gpuData, isLoading: isLoadingGpu, isError: isErrorGpu } =
    useGetGpuById(shouldFetchGpu ? productId : undefined);

  const { data: mbData, isLoading: isLoadingMb, isError: isErrorMb } =
    useGetMotherboardById(shouldFetchMb ? productId : undefined);

  const { data: ramData, isLoading: isLoadingRam, isError: isErrorRam } =
    useGetRamKitById(shouldFetchRam ? productId : undefined);

  const { data: psuData, isLoading: isLoadingPsu, isError: isErrorPsu } =
    useGetPsuById(shouldFetchPsu ? productId : undefined);

  const { data: caseData, isLoading: isLoadingCase, isError: isErrorCase } =
    useGetPcCaseById(shouldFetchCase ? productId : undefined);

  const productData = useMemo(() => {
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

  return {
    productData,
    isLoading,
    isError,
    categoryName,
  };
}

