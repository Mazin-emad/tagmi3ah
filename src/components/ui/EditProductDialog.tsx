import { useMemo } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Product } from "@/api/types";
import EditGpuForm from "@/components/forms/product/EditGpuForm";
import EditCpuForm from "@/components/forms/product/EditCpuForm";
import EditPsuForm from "@/components/forms/product/EditPsuForm";
import EditMotherboardForm from "@/components/forms/product/EditMotherboardForm";
import EditRamKitForm from "@/components/forms/product/EditRamKitForm";
import EditPcCaseForm from "@/components/forms/product/EditPcCaseForm";
import { useGetCpuById } from "@/hooks/product/useCpus";
import { useGetGpuById } from "@/hooks/product/useGpus";
import { useGetMotherboardById } from "@/hooks/product/useMotherboards";
import { useGetRamKitById } from "@/hooks/product/useRamKits";
import { useGetPsuById } from "@/hooks/product/usePsus";
import { useGetPcCaseById } from "@/hooks/product/usePcCases";
import { Skeleton } from "@/components/ui/skeleton";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function EditProductDialog({
  open,
  onOpenChange,
  product,
}: EditProductDialogProps) {
  const handleClose = () => onOpenChange(false);

  const productId = useMemo(() => {
    if (!product?.id) return undefined;
    const id = Number(product.id);
    return isNaN(id) ? undefined : id;
  }, [product]);

  const categoryName = useMemo(() => {
    if (!product) return null;
    const cat = (product.categoryName || product.category || product.type || "")
      .toString()
      .trim()
      .toUpperCase();
    return cat;
  }, [product]);

  const normalizedCategory = useMemo(() => {
    if (!categoryName) return null;
    const cat = categoryName.toUpperCase();
    if (cat === "CPU") return "CPU";
    if (cat === "GPU") return "GPU";
    if (cat === "MOTHERBOARD") return "MOTHERBOARD";
    if (cat === "RAM" || cat === "RAMKIT") return "RAM";
    if (cat === "PSU") return "PSU";
    if (cat === "PC CASE" || cat === "PCCASE") return "PC CASE";
    return null;
  }, [categoryName]);

  const shouldFetchCpu = normalizedCategory === "CPU" && !!productId;
  const shouldFetchGpu = normalizedCategory === "GPU" && !!productId;
  const shouldFetchMb = normalizedCategory === "MOTHERBOARD" && !!productId;
  const shouldFetchRam = normalizedCategory === "RAM" && !!productId;
  const shouldFetchPsu = normalizedCategory === "PSU" && !!productId;
  const shouldFetchCase = normalizedCategory === "PC CASE" && !!productId;

  const { data: cpuData, isLoading: isLoadingCpu } = useGetCpuById(
    shouldFetchCpu ? productId : undefined
  );
  const { data: gpuData, isLoading: isLoadingGpu } = useGetGpuById(
    shouldFetchGpu ? productId : undefined
  );
  const { data: mbData, isLoading: isLoadingMb } = useGetMotherboardById(
    shouldFetchMb ? productId : undefined
  );
  const { data: ramData, isLoading: isLoadingRam } = useGetRamKitById(
    shouldFetchRam ? productId : undefined
  );
  const { data: psuData, isLoading: isLoadingPsu } = useGetPsuById(
    shouldFetchPsu ? productId : undefined
  );
  const { data: caseData, isLoading: isLoadingCase } = useGetPcCaseById(
    shouldFetchCase ? productId : undefined
  );

  const fullProductData = useMemo(() => {
    if (cpuData) return cpuData;
    if (gpuData) return gpuData;
    if (mbData) return mbData;
    if (ramData) return ramData;
    if (psuData) return psuData;
    if (caseData) return caseData;
    return product;
  }, [cpuData, gpuData, mbData, ramData, psuData, caseData, product]);

  const isLoading =
    isLoadingCpu ||
    isLoadingGpu ||
    isLoadingMb ||
    isLoadingRam ||
    isLoadingPsu ||
    isLoadingCase;

  const renderForm = () => {
    if (!fullProductData) return null;

    const cat = categoryName?.toLowerCase() || "";
    if (cat.includes("gpu") || cat.includes("graphics")) {
      return <EditGpuForm product={fullProductData} onClose={handleClose} />;
    }
    if (cat.includes("cpu")) {
      return <EditCpuForm product={fullProductData} onClose={handleClose} />;
    }
    if (cat.includes("psu") || cat.includes("power")) {
      return <EditPsuForm product={fullProductData} onClose={handleClose} />;
    }
    if (cat.includes("motherboard")) {
      return (
        <EditMotherboardForm product={fullProductData} onClose={handleClose} />
      );
    }
    if (cat.includes("ram") || cat.includes("memory")) {
      return <EditRamKitForm product={fullProductData} onClose={handleClose} />;
    }
    if (cat.includes("case")) {
      return <EditPcCaseForm product={fullProductData} onClose={handleClose} />;
    }
    return (
      <div className="text-sm text-muted-foreground">
        Editing for this product type is not implemented yet.
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {isLoading ? (
          <div className="py-2 space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="py-2">{renderForm()}</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
