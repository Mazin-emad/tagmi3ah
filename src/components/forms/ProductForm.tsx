import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useAllCategories } from "@/hooks/useCategories";
import GpuForm from "./product/GpuForm";
import CpuForm from "./product/CpuForm";
import PsuForm from "./product/PsuForm";
import MotherboardForm from "./product/MotherboardForm";
import RamKitForm from "./product/RamKitForm";
import PcCaseForm from "./product/PcCaseForm";
import GenericProductForm from "./product/GenericProductForm";

const PRODUCT_TYPE_TO_FORM_MAP: Record<string, string> = {
  CPU: "cpu",
  GPU: "gpu",
  Motherboard: "motherboard",
  RAM: "ramKit",
  PSU: "psu",
  "PC Case": "pcCase",
};

const PRODUCT_TYPE_OPTIONS = [
  { value: "", label: "Select a product type" },
  { value: "CPU", label: "CPU" },
  { value: "GPU", label: "GPU" },
  { value: "Motherboard", label: "Motherboard" },
  { value: "RAM", label: "RAM" },
  { value: "PSU", label: "PSU" },
  { value: "PC Case", label: "PC Case" },
];

export default function ProductForm() {
  const { data: categories = [] } = useAllCategories();
  const [selectedProductType, setSelectedProductType] = useState<string | null>(
    null
  );

  const selectedCategory = useMemo(() => {
    if (!selectedProductType) return null;
    return categories.find((cat) => cat.name === selectedProductType);
  }, [categories, selectedProductType]);

  const renderForm = () => {
    if (!selectedProductType) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          Please select a product type to continue
        </div>
      );
    }

    if (!selectedCategory) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          Category not found for {selectedProductType}. Using generic form.
        </div>
      );
    }

    const formType = PRODUCT_TYPE_TO_FORM_MAP[selectedProductType];

    switch (formType) {
      case "cpu":
        return <CpuForm categoryId={selectedCategory.id} />;
      case "gpu":
        return <GpuForm categoryId={selectedCategory.id} />;
      case "psu":
        return <PsuForm categoryId={selectedCategory.id} />;
      case "motherboard":
        return <MotherboardForm categoryId={selectedCategory.id} />;
      case "ramKit":
        return <RamKitForm categoryId={selectedCategory.id} />;
      case "pcCase":
        return <PcCaseForm categoryId={selectedCategory.id} />;
      default:
        return <GenericProductForm categoryName={selectedCategory.name} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg border">
        <div>
          <h3 className="text-lg font-semibold">Product Type</h3>
          <p className="text-sm text-muted-foreground">
            Select the product type you want to create
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Label htmlFor="productType" className="sr-only">
            Product Type
          </Label>
          <Select
            id="productType"
            value={selectedProductType || ""}
            options={PRODUCT_TYPE_OPTIONS}
            onChange={(e) => setSelectedProductType(e.target.value || null)}
          />
        </div>
      </div>
      {renderForm()}
    </div>
  );
}
