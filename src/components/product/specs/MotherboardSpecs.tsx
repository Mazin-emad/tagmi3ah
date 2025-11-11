import type { MotherboardResponse } from "@/api/product/motherboards";

export type SpecItem = { label: string; value: string };

export function buildMotherboardSpecs(mb: MotherboardResponse): SpecItem[] {
	const specs: SpecItem[] = [];
	if (mb.socket) specs.push({ label: "Socket", value: mb.socket });
	if (mb.chipset) specs.push({ label: "Chipset", value: mb.chipset });
	if (mb.formFactor) specs.push({ label: "Form Factor", value: mb.formFactor });
	if (mb.ramType) specs.push({ label: "RAM Type", value: mb.ramType });
	if (mb.ramSlots != null) specs.push({ label: "RAM Slots", value: String(mb.ramSlots) });
	if (mb.maxMemorySpeedMHz != null) specs.push({ label: "Max RAM Speed", value: `${mb.maxMemorySpeedMHz} MHz` });
	if (mb.pcieVersion) specs.push({ label: "PCIe", value: mb.pcieVersion });
	if (mb.m2Slots != null) specs.push({ label: "M.2 Slots", value: String(mb.m2Slots) });
	if (mb.wifi != null) specs.push({ label: "Wi‑Fi", value: mb.wifi ? "Yes" : "No" });
	return specs;
}


