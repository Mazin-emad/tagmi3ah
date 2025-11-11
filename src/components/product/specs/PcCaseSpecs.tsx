import type { PcCaseResponse } from "@/api/product/pccases";

export type SpecItem = { label: string; value: string };

export function buildPcCaseSpecs(pc: PcCaseResponse): SpecItem[] {
	const specs: SpecItem[] = [];
	if (pc.formFactor) specs.push({ label: "Form Factor", value: pc.formFactor });
	if (pc.maxGpuLengthMm != null) specs.push({ label: "Max GPU Length", value: `${pc.maxGpuLengthMm} mm` });
	if (pc.maxCpuCoolerHeightMm != null) specs.push({ label: "Max Cooler Height", value: `${pc.maxCpuCoolerHeightMm} mm` });
	if (pc.psuFormFactor) specs.push({ label: "PSU Form Factor", value: pc.psuFormFactor });
	return specs;
}


