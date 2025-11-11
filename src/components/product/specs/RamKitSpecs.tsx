import type { RamKitResponse } from "@/api/product/ramkits";

export type SpecItem = { label: string; value: string };

export function buildRamKitSpecs(ram: RamKitResponse): SpecItem[] {
	const specs: SpecItem[] = [];
	if (ram.capacityGB != null) specs.push({ label: "Capacity", value: `${ram.capacityGB} GB` });
	if (ram.modules != null) specs.push({ label: "Modules", value: String(ram.modules) });
	if (ram.speedMHz != null) specs.push({ label: "Speed", value: `${ram.speedMHz} MHz` });
	if (ram.type) specs.push({ label: "Type", value: ram.type });
	if (ram.casLatency != null) specs.push({ label: "CAS Latency", value: String(ram.casLatency) });
	return specs;
}


