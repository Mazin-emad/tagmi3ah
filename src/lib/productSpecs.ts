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
import { detectProductCategory } from "./productUtils";

type SpecItem = { label: string; value: string };

export function buildProductSpecs(product: unknown): SpecItem[] {
  const category = detectProductCategory(product as Record<string, unknown>);

  switch (category) {
    case "CPU":
      return buildCpuSpecs(product as CpuResponse);
    case "GPU":
      return buildGpuSpecs(product as GpuResponse);
    case "MOTHERBOARD":
      return buildMotherboardSpecs(product as MotherboardResponse);
    case "RAMKIT":
    case "RAM":
      return buildRamKitSpecs(product as RamKitResponse);
    case "PSU":
      return buildPsuSpecs(product as PsuResponse);
    case "PCCASE":
    case "PC CASE":
      return buildPcCaseSpecs(product as PcCaseResponse);
    default:
      return [];
  }
}

