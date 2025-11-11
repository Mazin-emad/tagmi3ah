import type { GpuResponse } from "@/api/product/gpus";

export type SpecItem = { label: string; value: string };

export function buildGpuSpecs(gpu: GpuResponse): SpecItem[] {
	const specs: SpecItem[] = [];
	if (gpu.vramGB != null) specs.push({ label: "VRAM", value: `${gpu.vramGB} GB` });
	if (gpu.tdpW != null) specs.push({ label: "TDP", value: `${gpu.tdpW} W` });
	if (gpu.recommendedPSUWatt != null) specs.push({ label: "Recommended PSU", value: `${gpu.recommendedPSUWatt} W` });
	if (gpu.performanceTier) specs.push({ label: "Tier", value: gpu.performanceTier });
	if (gpu.lengthMm != null) specs.push({ label: "Length", value: `${gpu.lengthMm} mm` });
	return specs;
}


