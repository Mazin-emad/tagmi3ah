import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import GpuForm from "./product/GpuForm";
import CpuForm from "./product/CpuForm";
import PsuForm from "./product/PsuForm";
import MotherboardForm from "./product/MotherboardForm";
import RamKitForm from "./product/RamKitForm";
import PcCaseForm from "./product/PcCaseForm";

type ProductType = "gpu" | "cpu" | "psu" | "motherboard" | "ramKit" | "pcCase";

const productTypeOptions = [
  { value: "gpu", label: "GPU" },
  { value: "cpu", label: "CPU" },
  { value: "psu", label: "PSU" },
  { value: "motherboard", label: "Motherboard" },
  { value: "ramKit", label: "RAM Kit" },
  { value: "pcCase", label: "PC Case" },
];

export default function ProductForm() {
  const [productType, setProductType] = useState<ProductType>("gpu");

  const renderForm = () => {
    switch (productType) {
      case "gpu":
        return <GpuForm />;
      case "cpu":
        return <CpuForm />;
      case "psu":
        return <PsuForm />;
      case "motherboard":
        return <MotherboardForm />;
      case "ramKit":
        return <RamKitForm />;
      case "pcCase":
        return <PcCaseForm />;
      default:
        return <GpuForm />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg border">
        <div>
          <h3 className="text-lg font-semibold">Product Type</h3>
          <p className="text-sm text-muted-foreground">
            Select the type of product you want to create
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Label htmlFor="product-type" className="sr-only">
            Product Type
          </Label>
          <Select
            id="product-type"
            value={productType}
            options={productTypeOptions}
            onChange={(e) => setProductType(e.target.value as ProductType)}
          />
        </div>
      </div>
      {renderForm()}
    </div>
  );
}
