import type { CpuResponse } from "@/api/product/cpus";

export type SpecItem = { label: string; value: string };

export function buildCpuSpecs(cpu: CpuResponse): SpecItem[] {
	const specs: SpecItem[] = [];
	if (cpu.socket) specs.push({ label: "Socket", value: cpu.socket });
	if (cpu.cores != null) specs.push({ label: "Cores", value: String(cpu.cores) });
	if (cpu.threads != null) specs.push({ label: "Threads", value: String(cpu.threads) });
	if (cpu.baseClockGHz != null) specs.push({ label: "Base Clock", value: `${cpu.baseClockGHz} GHz` });
	if (cpu.boostClockGHz != null) specs.push({ label: "Boost Clock", value: `${cpu.boostClockGHz} GHz` });
	if (cpu.tdpW != null) specs.push({ label: "TDP", value: `${cpu.tdpW} W` });
	return specs;
}


