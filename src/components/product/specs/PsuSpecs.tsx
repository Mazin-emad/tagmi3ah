import type { PsuResponse } from "@/api/product/psus";

export type SpecItem = { label: string; value: string };

export function buildPsuSpecs(psu: PsuResponse): SpecItem[] {
	const specs: SpecItem[] = [];
	if (psu.wattage != null) specs.push({ label: "Wattage", value: `${psu.wattage} W` });
	if (psu.efficiency) specs.push({ label: "Efficiency", value: psu.efficiency });
	if (psu.modularity) specs.push({ label: "Modularity", value: psu.modularity });
	if (psu.formFactor) specs.push({ label: "Form Factor", value: psu.formFactor });
	return specs;
}


