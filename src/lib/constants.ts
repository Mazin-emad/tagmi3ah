export const products = [
  {
    id: "1",
    name: "AMD Ryzen 9 5900X",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 100,
    description: "AMD Ryzen 9 5900X description",
    category: "CPU",
    brand: "AMD",
    stock: 5,
  },
  {
    id: "2",
    name: "Intel Core i9-12900K",
    image:
      "https://images.unsplash.com/photo-1591238372338-22d30c883a86?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 200,
    description: "Intel Core i9-12900K description",
    category: "CPU",
    brand: "Intel",
    stock: 77,
  },
  {
    id: "3",
    name: "Samsung 980 Pro",
    image: "https://images.pexels.com/photos/7859350/pexels-photo-7859350.jpeg",
    price: 300,
    description: "Samsung 980 Pro description",
    category: "SSD",
    brand: "Samsung",
    stock: 15,
  },
  {
    id: "4",
    name: "Corsair Vengeance RGB Pro",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
    price: 400,
    description: "Corsair Vengeance RGB Pro description",
    category: "CPU",
    brand: "AMD",
    stock: 10,
  },
  {
    id: "5",
    name: "Corsair Vengeance RGB Pro",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
    price: 500,
    description: "Corsair Vengeance RGB Pro description",
    category: "CPU",
    brand: "AMD",
    stock: 10,
  },
  {
    id: "6",
    name: "Corsair Vengeance RGB Pro",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
    price: 600,
    description: "Corsair Vengeance RGB Pro description",
    category: "CPU",
    brand: "AMD",
    stock: 10,
  },
  {
    id: "7",
    name: "Corsair Vengeance RGB Pro",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
    price: 700,
    description: "Corsair Vengeance RGB Pro description",
    category: "CPU",
    brand: "AMD",
    stock: 10,
  },
  {
    id: "8",
    name: "Corsair Vengeance RGB Pro",
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2Ftc3VuZ3xlbnwwfHwwfHx8MA%3D%3D",
    price: 800,
    description: "Corsair Vengeance RGB Pro description",
    category: "CPU",
    brand: "AMD",
    stock: 10,
  },
];

export const categories = [
  "CPU",
  "GPU",
  "Motherboard",
  "RAM",
  "Storage",
  "Cooling",
  "Power Supply",
  "Case",
  "Accessory",
];

export const brands = [
  "AMD",
  "Intel",
  "NVIDIA",
  "Corsair",
  "Kingston",
  "Samsung",
  "Seagate",
  "Western Digital",
  "Logitech",
  "Razer",
  "HyperX",
  "SteelSeries",
  "ASUS",
  "MSI",
  "Gigabyte",
  "ASRock",
  "G.Skill",
  "NZXT",
  "Lian Li",
  "Fractal Design",
  "Cooler Master",
  "Seasonic",
  "be quiet!",
];

export type Rating = 1 | 2 | 3 | 4 | 5;

type BaseItem = {
  id: string;
  name: string;
  brand: string;
  category: string;
  stock: number;
  description: string;
  price: number;
  rate: Rating;
};

export type CPU = BaseItem & {
  socket: string;
  cores: number;
  threads: number;
  baseClockGHz?: number;
  boostClockGHz?: number;
  tdpW: number;
  supportedMemoryTypes: ("DDR4" | "DDR5")[];
  maxMemorySpeedMHz: number;
  igpu?: string | null;
  generation?: string;
};

export type Motherboard = BaseItem & {
  socket: string;
  chipset: string;
  formFactor: "ATX" | "Micro-ATX" | "Mini-ITX";
  ramType: "DDR4" | "DDR5";
  ramSlots: number;
  maxMemorySpeedMHz: number;
  pcieVersion?: string;
  m2Slots?: number;
  wifi?: boolean;
};

export type GPU = BaseItem & {
  vramGB: number;
  tdpW: number;
  recommendedPSUWatt: number;
  performanceTier: "entry" | "mid" | "high" | "enthusiast";
  lengthMm?: number;
};

export type RAMKit = BaseItem & {
  type: "DDR4" | "DDR5";
  capacityGB: number;
  modules: number;
  speedMHz: number;
  casLatency: number;
  ecc?: boolean;
};

export type PCCase = BaseItem & {
  formFactorSupport: ("ATX" | "Micro-ATX" | "Mini-ITX")[];
  maxGpuLengthMm: number;
  maxCpuCoolerHeightMm: number;
  psuFormFactor: "ATX" | "SFX" | "SFX-L";
};

export type PSU = BaseItem & {
  wattage: number;
  efficiency: "80+ Bronze" | "80+ Silver" | "80+ Gold" | "80+ Platinum" | "80+ Titanium";
  modularity: "Non-Modular" | "Semi-Modular" | "Fully Modular";
  formFactor: "ATX" | "SFX";
};

export const CPUs: CPU[] = [
  { id: "cpu-am4-3600", name: "Ryzen 5 3600", brand: "AMD", category: "CPU", stock: 15, price: 199.99, description: "6-core, 12-thread desktop processor with a base clock of 3.6GHz and boost up to 4.2GHz. Socket AM4.", socket: "AM4", cores: 6, threads: 12, baseClockGHz: 3.6, boostClockGHz: 4.2, tdpW: 65, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: null, generation: "Zen 2", rate: 4 },
  { id: "cpu-am4-3700x", name: "Ryzen 7 3700X", brand: "AMD", category: "CPU", stock: 12, price: 299.99, description: "8-core, 16-thread desktop processor with a base clock of 3.6GHz and boost up to 4.4GHz. Socket AM4.", socket: "AM4", cores: 8, threads: 16, baseClockGHz: 3.6, boostClockGHz: 4.4, tdpW: 65, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: null, generation: "Zen 2", rate: 4 },
  { id: "cpu-am4-5800x3d", name: "Ryzen 7 5800X3D", brand: "AMD", category: "CPU", stock: 8, price: 449.99, description: "8-core, 16-thread desktop processor with 3D V-Cache technology, base clock of 3.4GHz and boost up to 4.5GHz. Socket AM4.", socket: "AM4", cores: 8, threads: 16, baseClockGHz: 3.4, boostClockGHz: 4.5, tdpW: 105, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: null, generation: "Zen 3", rate: 5 },
  { id: "cpu-am4-5900x", name: "Ryzen 9 5900X", brand: "AMD", category: "CPU", stock: 10, price: 449.99, description: "12-core, 24-thread desktop processor with a base clock of 3.7GHz and boost up to 4.8GHz. Socket AM4.", socket: "AM4", cores: 12, threads: 24, baseClockGHz: 3.7, boostClockGHz: 4.8, tdpW: 105, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: null, generation: "Zen 3", rate: 5 },
  { id: "cpu-am4-5950x", name: "Ryzen 9 5950X", brand: "AMD", category: "CPU", stock: 6, price: 549.99, description: "16-core, 32-thread desktop processor with a base clock of 3.4GHz and boost up to 4.9GHz. Socket AM4.", socket: "AM4", cores: 16, threads: 32, baseClockGHz: 3.4, boostClockGHz: 4.9, tdpW: 105, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: null, generation: "Zen 3", rate: 5 },
  { id: "cpu-am4-5600x", name: "Ryzen 5 5600X", brand: "AMD", category: "CPU", stock: 20, price: 229.99, description: "6-core, 12-thread desktop processor with a base clock of 3.7GHz and boost up to 4.6GHz. Includes Wraith Stealth cooler. Socket AM4.", socket: "AM4", cores: 6, threads: 12, baseClockGHz: 3.7, boostClockGHz: 4.6, tdpW: 65, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: null, generation: "Zen 3", rate: 5 },
  
  { id: "cpu-am5-7600", name: "Ryzen 5 7600", brand: "AMD", category: "CPU", stock: 15, price: 229.99, description: "6-core, 12-thread desktop processor with Radeon Graphics, base clock of 3.8GHz and boost up to 5.1GHz. Socket AM5.", socket: "AM5", cores: 6, threads: 12, baseClockGHz: 3.8, boostClockGHz: 5.1, tdpW: 65, supportedMemoryTypes: ["DDR5"], maxMemorySpeedMHz: 5200, igpu: "Radeon Graphics", generation: "Zen 4", rate: 5 },
  { id: "cpu-am5-7700x", name: "Ryzen 7 7700X", brand: "AMD", category: "CPU", stock: 10, price: 349.99, description: "8-core, 16-thread desktop processor with Radeon Graphics, base clock of 4.5GHz and boost up to 5.4GHz. Socket AM5.", socket: "AM5", cores: 8, threads: 16, baseClockGHz: 4.5, boostClockGHz: 5.4, tdpW: 105, supportedMemoryTypes: ["DDR5"], maxMemorySpeedMHz: 5200, igpu: "Radeon Graphics", generation: "Zen 4", rate: 5 },
  { id: "cpu-am5-7800x3d", name: "Ryzen 7 7800X3D", brand: "AMD", category: "CPU", stock: 8, price: 449.99, description: "8-core, 16-thread desktop processor with 3D V-Cache technology and Radeon Graphics, base clock of 4.2GHz and boost up to 5.0GHz. Socket AM5.", socket: "AM5", cores: 8, threads: 16, baseClockGHz: 4.2, boostClockGHz: 5.0, tdpW: 120, supportedMemoryTypes: ["DDR5"], maxMemorySpeedMHz: 5200, igpu: "Radeon Graphics", generation: "Zen 4", rate: 5 },
  { id: "cpu-am5-7900", name: "Ryzen 9 7900", brand: "AMD", category: "CPU", stock: 7, price: 429.99, description: "12-core, 24-thread desktop processor with Radeon Graphics, base clock of 3.7GHz and boost up to 5.4GHz. Socket AM5.", socket: "AM5", cores: 12, threads: 24, baseClockGHz: 3.7, boostClockGHz: 5.4, tdpW: 65, supportedMemoryTypes: ["DDR5"], maxMemorySpeedMHz: 5200, igpu: "Radeon Graphics", generation: "Zen 4", rate: 5 },
  { id: "cpu-am5-7950x", name: "Ryzen 9 7950X", brand: "AMD", category: "CPU", stock: 5, price: 699.99, description: "16-core, 32-thread desktop processor with Radeon Graphics, base clock of 4.5GHz and boost up to 5.7GHz. Socket AM5.", socket: "AM5", cores: 16, threads: 32, baseClockGHz: 4.5, boostClockGHz: 5.7, tdpW: 170, supportedMemoryTypes: ["DDR5"], maxMemorySpeedMHz: 5200, igpu: "Radeon Graphics", generation: "Zen 4", rate: 5 },
  { id: "cpu-am5-7950x3d", name: "Ryzen 9 7950X3D", brand: "AMD", category: "CPU", stock: 4, price: 799.99, description: "16-core, 32-thread desktop processor with 3D V-Cache technology and Radeon Graphics, base clock of 4.2GHz and boost up to 5.7GHz. Socket AM5.", socket: "AM5", cores: 16, threads: 32, baseClockGHz: 4.2, boostClockGHz: 5.7, tdpW: 120, supportedMemoryTypes: ["DDR5"], maxMemorySpeedMHz: 5200, igpu: "Radeon Graphics", generation: "Zen 4", rate: 5 },
  
  { id: "cpu-intel-8400", name: "Core i5-8400", brand: "Intel", category: "CPU", stock: 10, price: 199.99, description: "6-core, 6-thread desktop processor with Intel UHD Graphics 630, base clock of 2.8GHz and boost up to 4.0GHz. Socket LGA1151.", socket: "LGA1151", cores: 6, threads: 6, baseClockGHz: 2.8, boostClockGHz: 4.0, tdpW: 65, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 2666, igpu: "UHD 630", generation: "8th Gen Coffee Lake", rate: 4 },
  { id: "cpu-intel-8700k", name: "Core i7-8700K", brand: "Intel", category: "CPU", stock: 8, price: 299.99, description: "6-core, 12-thread desktop processor with Intel UHD Graphics 630, base clock of 3.7GHz and boost up to 4.7GHz. Unlocked multiplier. Socket LGA1151.", socket: "LGA1151", cores: 6, threads: 12, baseClockGHz: 3.7, boostClockGHz: 4.7, tdpW: 95, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 2666, igpu: "UHD 630", generation: "8th Gen Coffee Lake", rate: 4 },
  { id: "cpu-intel-9600k", name: "Core i5-9600K", brand: "Intel", category: "CPU", stock: 12, price: 229.99, description: "6-core, 6-thread desktop processor with Intel UHD Graphics 630, base clock of 3.7GHz and boost up to 4.6GHz. Unlocked multiplier. Socket LGA1151.", socket: "LGA1151", cores: 6, threads: 6, baseClockGHz: 3.7, boostClockGHz: 4.6, tdpW: 95, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 2666, igpu: "UHD 630", generation: "9th Gen Coffee Lake Refresh", rate: 4 },
  { id: "cpu-intel-9900k", name: "Core i9-9900K", brand: "Intel", category: "CPU", stock: 6, price: 299.99, description: "8-core, 16-thread desktop processor with Intel UHD Graphics 630, base clock of 3.6GHz and boost up to 5.0GHz. Unlocked multiplier. Socket LGA1151.", socket: "LGA1151", cores: 8, threads: 16, baseClockGHz: 3.6, boostClockGHz: 5.0, tdpW: 95, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 2666, igpu: "UHD 630", generation: "9th Gen Coffee Lake Refresh", rate: 5 },
  
  { id: "cpu-intel-10400", name: "Core i5-10400", brand: "Intel", category: "CPU", stock: 15, price: 229.99, description: "6-core, 12-thread desktop processor with Intel UHD Graphics 630, base clock of 2.9GHz and boost up to 4.3GHz. Socket LGA1200.", socket: "LGA1200", cores: 6, threads: 12, baseClockGHz: 2.9, boostClockGHz: 4.3, tdpW: 65, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 2666, igpu: "UHD 630", generation: "10th Gen Comet Lake", rate: 4 },
  { id: "cpu-intel-10700k", name: "Core i7-10700K", brand: "Intel", category: "CPU", stock: 8, price: 349.99, description: "8-core, 16-thread desktop processor with Intel UHD Graphics 630, base clock of 3.8GHz and boost up to 5.1GHz. Unlocked multiplier. Socket LGA1200.", socket: "LGA1200", cores: 8, threads: 16, baseClockGHz: 3.8, boostClockGHz: 5.1, tdpW: 125, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 2933, igpu: "UHD 630", generation: "10th Gen Comet Lake", rate: 5 },
  { id: "cpu-intel-11600k", name: "Core i5-11600K", brand: "Intel", category: "CPU", stock: 10, price: 229.99, description: "6-core, 12-thread desktop processor with Intel UHD Graphics 750, base clock of 3.9GHz and boost up to 4.9GHz. Unlocked multiplier. Socket LGA1200.", socket: "LGA1200", cores: 6, threads: 12, baseClockGHz: 3.9, boostClockGHz: 4.9, tdpW: 125, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: "UHD 750", generation: "11th Gen Rocket Lake", rate: 4 },
  { id: "cpu-intel-11700k", name: "Core i7-11700K", brand: "Intel", category: "CPU", stock: 7, price: 299.99, description: "8-core, 16-thread desktop processor with Intel UHD Graphics 750, base clock of 3.6GHz and boost up to 5.0GHz. Unlocked multiplier. Socket LGA1200.", socket: "LGA1200", cores: 8, threads: 16, baseClockGHz: 3.6, boostClockGHz: 5.0, tdpW: 125, supportedMemoryTypes: ["DDR4"], maxMemorySpeedMHz: 3200, igpu: "UHD 750", generation: "11th Gen Rocket Lake", rate: 4 },
  
  { id: "cpu-intel-12400f", name: "Core i5-12400F", brand: "Intel", category: "CPU", stock: 12, price: 229.99, description: "6-core, 12-thread desktop processor without integrated graphics, base clock of 2.5GHz and boost up to 4.4GHz. Socket LGA1700.", socket: "LGA1700", cores: 6, threads: 12, baseClockGHz: 2.5, boostClockGHz: 4.4, tdpW: 65, supportedMemoryTypes: ["DDR4", "DDR5"], maxMemorySpeedMHz: 4800, igpu: null, generation: "12th Gen Alder Lake", rate: 5 },
  { id: "cpu-intel-12600k", name: "Core i5-12600K", brand: "Intel", category: "CPU", stock: 10, price: 349.99, description: "10-core, 16-thread desktop processor with Intel UHD Graphics 770, base clock of 3.7GHz and boost up to 4.9GHz. Unlocked multiplier. Socket LGA1700.", socket: "LGA1700", cores: 10, threads: 16, baseClockGHz: 3.7, boostClockGHz: 4.9, tdpW: 125, supportedMemoryTypes: ["DDR4", "DDR5"], maxMemorySpeedMHz: 4800, igpu: "UHD 770", generation: "12th Gen Alder Lake", rate: 5 },
  { id: "cpu-intel-13600k", name: "Core i5-13600K", brand: "Intel", category: "CPU", stock: 8, price: 299.99, description: "14-core, 20-thread desktop processor with Intel UHD Graphics 770, base clock of 3.5GHz and boost up to 5.1GHz. Unlocked multiplier. Socket LGA1700.", socket: "LGA1700", cores: 14, threads: 20, baseClockGHz: 3.5, boostClockGHz: 5.1, tdpW: 125, supportedMemoryTypes: ["DDR4", "DDR5"], maxMemorySpeedMHz: 5600, igpu: "UHD 770", generation: "13th Gen Raptor Lake", rate: 5 },
  { id: "cpu-intel-13700k", name: "Core i7-13700K", brand: "Intel", category: "CPU", stock: 6, price: 299.99, description: "16-core, 24-thread desktop processor with Intel UHD Graphics 770, base clock of 3.4GHz and boost up to 5.4GHz. Unlocked multiplier. Socket LGA1700.", socket: "LGA1700", cores: 16, threads: 24, baseClockGHz: 3.4, boostClockGHz: 5.4, tdpW: 125, supportedMemoryTypes: ["DDR4", "DDR5"], maxMemorySpeedMHz: 5600, igpu: "UHD 770", generation: "13th Gen Raptor Lake", rate: 5 },
  { id: "cpu-intel-14700k", name: "Core i7-14700K", brand: "Intel", category: "CPU", stock: 5, price: 299.99, description: "20-core, 28-thread desktop processor with Intel UHD Graphics 770, base clock of 3.4GHz and boost up to 5.6GHz. Unlocked multiplier. Socket LGA1700.", socket: "LGA1700", cores: 20, threads: 28, baseClockGHz: 3.4, boostClockGHz: 5.6, tdpW: 125, supportedMemoryTypes: ["DDR4", "DDR5"], maxMemorySpeedMHz: 5600, igpu: "UHD 770", generation: "14th Gen Raptor Lake Refresh", rate: 5 },
  { id: "cpu-intel-14900k", name: "Core i9-14900K", brand: "Intel", category: "CPU", stock: 4, price: 299.99, description: "24-core, 32-thread desktop processor with Intel UHD Graphics 770, base clock of 3.2GHz and boost up to 6.0GHz. Unlocked multiplier. Socket LGA1700.", socket: "LGA1700", cores: 24, threads: 32, baseClockGHz: 3.2, boostClockGHz: 6.0, tdpW: 125, supportedMemoryTypes: ["DDR4", "DDR5"], maxMemorySpeedMHz: 5600, igpu: "UHD 770", generation: "14th Gen Raptor Lake Refresh", rate: 5 },
];

export const Motherboards: Motherboard[] = [
  { 
    id: "mb-am4-b450-plus", 
    name: "ASUS TUF Gaming B450-PLUS", 
    brand: "ASUS", 
    category: "Motherboard", 
    stock: 8, 
    price: 129.99,
    description: "ATX motherboard with AMD B450 chipset, supports AMD Ryzen processors, 4x DDR4 RAM slots up to 4400MHz, PCIe 3.0, 2x M.2 slots, USB 3.1 Gen2, and TUF components for enhanced durability.", 
    socket: "AM4", 
    chipset: "B450", 
    formFactor: "ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 4400, 
    pcieVersion: "PCIe 3.0", 
    m2Slots: 2, 
    wifi: false, 
    rate: 4 
  },
  { 
    id: "mb-am4-b550-tomahawk", 
    name: "MSI MAG B550 TOMAHAWK", 
    brand: "MSI", 
    category: "Motherboard", 
    stock: 6, 
    price: 189.99,
    description: "ATX motherboard with AMD B550 chipset, supports 3rd Gen AMD Ryzen processors, 4x DDR4 RAM slots up to 4866MHz, PCIe 4.0, 2x M.2 slots, 2.5G LAN, and premium thermal solution.", 
    socket: "AM4", 
    chipset: "B550", 
    formFactor: "ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 4866, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 2, 
    wifi: false, 
    rate: 5 
  },
  { 
    id: "mb-am4-x570-elite", 
    name: "Gigabyte X570 AORUS ELITE", 
    brand: "Gigabyte", 
    category: "Motherboard", 
    stock: 5, 
    price: 249.99,
    description: "ATX motherboard with AMD X570 chipset, supports 3rd Gen AMD Ryzen processors, 4x DDR4 RAM slots up to 5100MHz, PCIe 4.0, 2x M.2 slots, Intel Gigabit LAN, and advanced thermal design.", 
    socket: "AM4", 
    chipset: "X570", 
    formFactor: "ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 5100, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 2, 
    wifi: false, 
    rate: 5 
  },
  
  { 
    id: "mb-am5-a620m-plus", 
    name: "ASUS TUF Gaming A620M-PLUS WIFI", 
    brand: "ASUS", 
    category: "Motherboard", 
    stock: 7, 
    price: 149.99,
    description: "Micro-ATX motherboard with AMD A620 chipset, supports AMD Ryzen 7000 series processors, 2x DDR5 RAM slots up to 6400MHz, PCIe 4.0, 2x M.2 slots, WiFi 6, and military-grade components for durability.", 
    socket: "AM5", 
    chipset: "A620", 
    formFactor: "Micro-ATX", 
    ramType: "DDR5", 
    ramSlots: 2, 
    maxMemorySpeedMHz: 6400, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 2, 
    wifi: true, 
    rate: 4 
  },
  { 
    id: "mb-am5-b650-p", 
    name: "MSI PRO B650-P WIFI", 
    brand: "MSI", 
    category: "Motherboard", 
    stock: 5, 
    price: 219.99,
    description: "ATX motherboard with AMD B650 chipset, supports AMD Ryzen 7000 series processors, 4x DDR5 RAM slots up to 6600MHz, PCIe 4.0, 3x M.2 slots, WiFi 6E, 2.5G LAN, and premium power delivery.", 
    socket: "AM5", 
    chipset: "B650", 
    formFactor: "ATX", 
    ramType: "DDR5", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 6600, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 3, 
    wifi: true, 
    rate: 5 
  },
  { 
    id: "mb-am5-x670-elite", 
    name: "Gigabyte X670 AORUS ELITE AX", 
    brand: "Gigabyte", 
    category: "Motherboard", 
    stock: 4, 
    price: 299.99,
    description: "ATX motherboard with AMD X670 chipset, supports AMD Ryzen 7000 series processors, 4x DDR5 RAM slots up to 6600MHz, PCIe 5.0, 3x M.2 slots, WiFi 6E, 2.5G LAN, and advanced thermal design.", 
    socket: "AM5", 
    chipset: "X670", 
    formFactor: "ATX", 
    ramType: "DDR5", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 6600, 
    pcieVersion: "PCIe 5.0", 
    m2Slots: 3, 
    wifi: true, 
    rate: 5 
  },
  
  { 
    id: "mb-lga1151-b360m-a", 
    name: "ASUS PRIME B360M-A", 
    brand: "ASUS", 
    category: "Motherboard", 
    stock: 6, 
    price: 119.99,
    description: "Micro-ATX motherboard with Intel B360 chipset, supports 8th/9th Gen Intel Core processors, 4x DDR4 RAM slots up to 2666MHz, PCIe 3.0, 1x M.2 slot, and comprehensive cooling options.", 
    socket: "LGA1151", 
    chipset: "B360", 
    formFactor: "Micro-ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 2666, 
    pcieVersion: "PCIe 3.0", 
    m2Slots: 1, 
    wifi: false, 
    rate: 4 
  },
  { 
    id: "mb-lga1151-z390-a-pro", 
    name: "MSI Z390-A PRO", 
    brand: "MSI", 
    category: "Motherboard", 
    stock: 5, 
    price: 179.99,
    description: "ATX motherboard with Intel Z390 chipset, supports 8th/9th Gen Intel Core processors, 4x DDR4 RAM slots up to 4400MHz, PCIe 3.0, 2x M.2 slots, and extended heatsink design.", 
    socket: "LGA1151", 
    chipset: "Z390", 
    formFactor: "ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 4400, 
    pcieVersion: "PCIe 3.0", 
    m2Slots: 2, 
    wifi: false, 
    rate: 4 
  },
  
  { 
    id: "mb-lga1200-b460m-plus", 
    name: "ASUS TUF Gaming B460M-PLUS", 
    brand: "ASUS", 
    category: "Motherboard", 
    stock: 7, 
    price: 139.99,
    description: "Micro-ATX motherboard with Intel B460 chipset, supports 10th Gen Intel Core processors, 4x DDR4 RAM slots up to 2933MHz, PCIe 3.0, 2x M.2 slots, and military-grade TUF components.", 
    socket: "LGA1200", 
    chipset: "B460", 
    formFactor: "Micro-ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 2933, 
    pcieVersion: "PCIe 3.0", 
    m2Slots: 2, 
    wifi: false, 
    rate: 4 
  },
  { 
    id: "mb-lga1200-z590-a-pro", 
    name: "MSI Z590-A PRO", 
    brand: "MSI", 
    category: "Motherboard", 
    stock: 4, 
    price: 229.99,
    description: "ATX motherboard with Intel Z590 chipset, supports 10th/11th Gen Intel Core processors, 4x DDR4 RAM slots up to 5333MHz, PCIe 4.0, 3x M.2 slots, and extended heatsink design.", 
    socket: "LGA1200", 
    chipset: "Z590", 
    formFactor: "ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 5333, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 3, 
    wifi: false, 
    rate: 5 
  },
  
  { 
    id: "mb-lga1700-b660-plus-d4", 
    name: "ASUS PRIME B660-PLUS D4", 
    brand: "ASUS", 
    category: "Motherboard", 
    stock: 6, 
    price: 179.99,
    description: "ATX motherboard with Intel B660 chipset, supports 12th/13th Gen Intel Core processors, 4x DDR4 RAM slots up to 5333MHz, PCIe 4.0, 2x M.2 slots, and comprehensive cooling options.", 
    socket: "LGA1700", 
    chipset: "B660", 
    formFactor: "ATX", 
    ramType: "DDR4", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 5333, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 2, 
    wifi: false, 
    rate: 4 
  },
  { 
    id: "mb-lga1700-b760m-ds3h-ax", 
    name: "Gigabyte B760M DS3H AX", 
    brand: "Gigabyte", 
    category: "Motherboard", 
    stock: 5, 
    price: 159.99,
    description: "Micro-ATX motherboard with Intel B760 chipset, supports 12th/13th Gen Intel Core processors, 4x DDR5 RAM slots up to 6800MHz, PCIe 4.0, 2x M.2 slots, WiFi 6, and 2.5G LAN.", 
    socket: "LGA1700", 
    chipset: "B760", 
    formFactor: "Micro-ATX", 
    ramType: "DDR5", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 6800, 
    pcieVersion: "PCIe 4.0", 
    m2Slots: 2, 
    wifi: true, 
    rate: 5 
  },
  { 
    id: "mb-lga1700-z790-tomahawk", 
    name: "MSI MAG Z790 TOMAHAWK WIFI", 
    brand: "MSI", 
    category: "Motherboard", 
    stock: 3, 
    price: 299.99,
    description: "ATX motherboard with Intel Z790 chipset, supports 12th/13th Gen Intel Core processors, 4x DDR5 RAM slots up to 7800MHz, PCIe 5.0, 4x M.2 slots, WiFi 6E, and premium thermal design.", 
    socket: "LGA1700", 
    chipset: "Z790", 
    formFactor: "ATX", 
    ramType: "DDR5", 
    ramSlots: 4, 
    maxMemorySpeedMHz: 7800, 
    pcieVersion: "PCIe 5.0", 
    m2Slots: 4, 
    wifi: true, 
    rate: 5 
  },
];

export const GPUs: GPU[] = [
  { id: "gpu-rtx-3060", name: "GeForce RTX 3060", brand: "NVIDIA", category: "GPU", stock: 20, price: 329.99, vramGB: 12, tdpW: 170, recommendedPSUWatt: 550, performanceTier: "mid", lengthMm: 242, rate: 4, description: "Popular mid-range GPU with 12GB GDDR6 VRAM, 3840 CUDA cores, and ray tracing support. Suitable for 1080p and 1440p gaming." },
  { id: "gpu-rtx-3060ti", name: "GeForce RTX 3060 Ti", brand: "NVIDIA", category: "GPU", stock: 15, price: 399.99, vramGB: 8, tdpW: 200, recommendedPSUWatt: 600, performanceTier: "mid", lengthMm: 242, rate: 4, description: "High-performance GPU with 8GB GDDR6 VRAM, 4864 CUDA cores, and advanced ray tracing capabilities. Ideal for 1440p and 4K gaming." },
  { id: "gpu-rtx-3070", name: "GeForce RTX 3070", brand: "NVIDIA", category: "GPU", stock: 10, price: 499.99, vramGB: 8, tdpW: 220, recommendedPSUWatt: 650, performanceTier: "high", lengthMm: 242, rate: 5, description: "High-end GPU with 8GB GDDR6 VRAM, 5888 CUDA cores, and advanced ray tracing capabilities. Suitable for 4K gaming and content creation." },
  { id: "gpu-rtx-3080", name: "GeForce RTX 3080", brand: "NVIDIA", category: "GPU", stock: 8, price: 699.99, vramGB: 10, tdpW: 320, recommendedPSUWatt: 750, performanceTier: "high", lengthMm: 285, rate: 5, description: "High-performance gaming GPU with 10GB GDDR6X VRAM, 8704 CUDA cores, and ray tracing support. Perfect for 4K gaming and content creation." },
  { id: "gpu-rtx-4070", name: "GeForce RTX 4070", brand: "NVIDIA", category: "GPU", stock: 10, price: 599.99, vramGB: 12, tdpW: 200, recommendedPSUWatt: 600, performanceTier: "high", lengthMm: 244, rate: 5, description: "Power-efficient GPU with 12GB GDDR6X VRAM, perfect for 1440p and 4K gaming. Features AMD Infinity Cache and ray tracing support." },
  { id: "gpu-rtx-4070ti", name: "GeForce RTX 4070 Ti", brand: "NVIDIA", category: "GPU", stock: 7, price: 799.99, vramGB: 12, tdpW: 285, recommendedPSUWatt: 700, performanceTier: "high", lengthMm: 285, rate: 5, description: "High-end gaming GPU with 12GB GDDR6X VRAM, designed for 4K gaming. Features advanced ray tracing capabilities and DLSS 3.0 support." },
  { id: "gpu-rtx-4080", name: "GeForce RTX 4080", brand: "NVIDIA", category: "GPU", stock: 5, price: 1199.99, vramGB: 16, tdpW: 320, recommendedPSUWatt: 750, performanceTier: "enthusiast", lengthMm: 304, rate: 5, description: "Premium gaming GPU with 16GB GDDR6X VRAM, featuring the latest Ada Lovelace architecture. Designed for 4K gaming and professional content creation." },
  { id: "gpu-rtx-4090", name: "GeForce RTX 4090", brand: "NVIDIA", category: "GPU", stock: 3, price: 1599.99, vramGB: 24, tdpW: 450, recommendedPSUWatt: 850, performanceTier: "enthusiast", lengthMm: 336, rate: 5, description: "Flagship gaming GPU with 24GB GDDR6X VRAM, designed for 8K gaming and professional workloads. Features advanced cooling and the latest Ada Lovelace architecture." },
  { id: "gpu-rx-6600", name: "Radeon RX 6600", brand: "AMD", category: "GPU", stock: 15, price: 249.99, vramGB: 8, tdpW: 132, recommendedPSUWatt: 500, performanceTier: "entry", lengthMm: 190, rate: 4, description: "Budget-friendly 1080p gaming GPU with 8GB GDDR6 VRAM and RDNA 2 architecture. Great for esports and modern games at 1080p." },
  { id: "gpu-rx-6700xt", name: "Radeon RX 6700 XT", brand: "AMD", category: "GPU", stock: 12, price: 349.99, vramGB: 12, tdpW: 230, recommendedPSUWatt: 650, performanceTier: "mid", lengthMm: 267, rate: 4, description: "Mid-range gaming GPU with 12GB GDDR6 VRAM, perfect for 1440p gaming. Features AMD Infinity Cache and ray tracing support." },
  { id: "gpu-rx-6800xt", name: "Radeon RX 6800 XT", brand: "AMD", category: "GPU", stock: 8, price: 649.99, vramGB: 16, tdpW: 300, recommendedPSUWatt: 750, performanceTier: "high", lengthMm: 267, rate: 5, description: "High-performance gaming GPU with 16GB GDDR6 VRAM, designed for 4K gaming. Features RDNA 2 architecture and hardware-accelerated ray tracing." },
  { id: "gpu-rx-7900xtx", name: "Radeon RX 7900 XTX", brand: "AMD", category: "GPU", stock: 4, price: 999.99, vramGB: 24, tdpW: 355, recommendedPSUWatt: 800, performanceTier: "enthusiast", lengthMm: 287, rate: 5, description: "AMD's flagship GPU with 24GB GDDR6 VRAM, designed for 4K gaming and professional workloads. Features advanced cooling and RDNA 3 architecture." },
];

export const ramKits: RAMKit[] = [
  { id: "ram-ddr4-16-3200-cl16", name: "Vengeance LPX 16GB (2x8) 3200 CL16", brand: "Corsair", category: "RAM", stock: 20, price: 69.99, type: "DDR4", capacityGB: 16, modules: 2, speedMHz: 3200, casLatency: 16, ecc: false, rate: 4, description: "Popular DDR4 RAM kit with 16GB capacity, 3200MHz speed, and 16-18-18-36 timings. Suitable for gaming and general use." },
  { id: "ram-ddr4-32-3600-cl16", name: "Trident Z Neo 32GB (2x16) 3600 CL16", brand: "G.Skill", category: "RAM", stock: 15, price: 149.99, type: "DDR4", capacityGB: 32, modules: 2, speedMHz: 3600, casLatency: 16, ecc: false, rate: 5, description: "High-performance DDR4 RAM kit with 32GB capacity, 3600MHz speed, and 16-18-18-36 timings. Ideal for gaming, content creation, and heavy workloads." },
  { id: "ram-ddr4-16-3600-cl18", name: "FURY Beast 16GB (2x8) 3600 CL18", brand: "Kingston", category: "RAM", stock: 20, price: 74.99, type: "DDR4", capacityGB: 16, modules: 2, speedMHz: 3600, casLatency: 18, ecc: false, rate: 4, description: "Budget-friendly DDR4 RAM kit with 16GB capacity, 3600MHz speed, and 18-20-20-40 timings. Great for general use and entry-level gaming." },
  { id: "ram-ddr4-32-3200-cl16", name: "Vengeance 32GB (2x16) 3200 CL16", brand: "Corsair", category: "RAM", stock: 15, price: 129.99, type: "DDR4", capacityGB: 32, modules: 2, speedMHz: 3200, casLatency: 16, ecc: false, rate: 4, description: "High-capacity DDR4 RAM kit with 32GB capacity, 3200MHz speed, and 16-18-18-36 timings. Suitable for heavy workloads, gaming, and content creation." },
  { id: "ram-ddr5-32-5600-cl36", name: "FURY Beast 32GB (2x16) 5600 CL36", brand: "Kingston", category: "RAM", stock: 10, price: 179.99, type: "DDR5", capacityGB: 32, modules: 2, speedMHz: 5600, casLatency: 36, ecc: false, rate: 5, description: "High-performance DDR5 RAM kit with 32GB capacity, 5600MHz speed, and 36-36-36-72 timings. Ideal for gaming, content creation, and heavy workloads." },
  { id: "ram-ddr5-32-6000-cl36", name: "Vengeance 32GB (2x16) 6000 CL36", brand: "Corsair", category: "RAM", stock: 10, price: 199.99, type: "DDR5", capacityGB: 32, modules: 2, speedMHz: 6000, casLatency: 36, ecc: false, rate: 5, description: "High-end DDR5 RAM kit with 32GB capacity, 6000MHz speed, and 36-36-36-72 timings. Suitable for extreme gaming, content creation, and professional workloads." },
  { id: "ram-ddr5-48-6000-cl30", name: "Trident Z5 48GB (2x24) 6000 CL30", brand: "G.Skill", category: "RAM", stock: 5, price: 299.99, type: "DDR5", capacityGB: 48, modules: 2, speedMHz: 6000, casLatency: 30, ecc: false, rate: 5, description: "High-capacity DDR5 RAM kit with 48GB capacity, 6000MHz speed, and 30-30-30-60 timings. Ideal for extreme gaming, content creation, and professional workloads." },
  { id: "ram-ddr5-64-5600-cl40-1", name: "Vengeance 64GB (2x32) 5600 CL40", brand: "Corsair", category: "RAM", stock: 5, price: 349.99, type: "DDR5", capacityGB: 64, modules: 2, speedMHz: 5600, casLatency: 40, ecc: false, rate: 4, description: "High-capacity DDR5 RAM kit with 64GB capacity, 5600MHz speed, and 40-40-40-80 timings. Suitable for heavy workloads, gaming, and content creation." },
  { id: "ram-ddr5-64-5600-cl40-2", name: "Vengeance 64GB (2x32) 5600 CL40", brand: "Corsair", category: "RAM", stock: 5, price: 349.99, type: "DDR5", capacityGB: 64, modules: 2, speedMHz: 5600, casLatency: 40, ecc: false, rate: 4, description: "High-capacity DDR5 RAM kit with 64GB capacity, 5600MHz speed, and 40-40-40-80 timings. Suitable for heavy workloads, gaming, and content creation." },
];

export const pcCases: PCCase[] = [
  { 
    id: "case-nzxt-h510", 
    name: "NZXT H510", 
    brand: "NZXT", 
    category: "Case", 
    stock: 8, 
    price: 89.99, 
    description: "Compact mid-tower ATX case with a minimalist design, tempered glass side panel, and excellent cable management. Features a front I/O USB 3.1 Gen 2 Type-C port and support for radiators up to 280mm.", 
    formFactorSupport: ["ATX", "Micro-ATX", "Mini-ITX"], 
    maxGpuLengthMm: 381, 
    maxCpuCoolerHeightMm: 165, 
    psuFormFactor: "ATX", 
    rate: 4 
  },
  { 
    id: "case-nzxt-h7-flow", 
    name: "NZXT H7 Flow", 
    brand: "NZXT", 
    category: "Case", 
    stock: 6, 
    price: 129.99, 
    description: "Premium mid-tower ATX case with a mesh front panel for optimal airflow. Features a tempered glass side panel, USB 3.2 Gen 2 Type-C, and support for up to 360mm radiators. Includes three 120mm fans pre-installed.", 
    formFactorSupport: ["ATX", "Micro-ATX", "Mini-ITX"], 
    maxGpuLengthMm: 400, 
    maxCpuCoolerHeightMm: 185, 
    psuFormFactor: "ATX", 
    rate: 5 
  },
  { 
    id: "case-lianli-lancool2", 
    name: "Lian Li Lancool II Mesh", 
    brand: "Lian Li", 
    category: "Case", 
    stock: 7, 
    price: 119.99, 
    description: "High-airflow mid-tower ATX case with a mesh front panel. Features three 120mm PWM fans, USB 3.1 Type-C, and excellent cable management. Supports radiators up to 360mm and includes a removable dust filter.", 
    formFactorSupport: ["ATX", "Micro-ATX", "Mini-ITX"], 
    maxGpuLengthMm: 384, 
    maxCpuCoolerHeightMm: 176, 
    psuFormFactor: "ATX", 
    rate: 5 
  },
  { 
    id: "case-lianli-lancool216", 
    name: "Lian Li Lancool 216", 
    brand: "Lian Li", 
    category: "Case", 
    stock: 5, 
    price: 109.99, 
    description: "Mid-tower ATX case with excellent airflow and two 160mm PWM fans pre-installed. Features a mesh front panel, USB 3.1 Type-C, and support for radiators up to 360mm. Includes a removable dust filter and tool-free drive installation.", 
    formFactorSupport: ["ATX", "Micro-ATX", "Mini-ITX"], 
    maxGpuLengthMm: 392, 
    maxCpuCoolerHeightMm: 180, 
    psuFormFactor: "ATX", 
    rate: 5 
  },
  { 
    id: "case-fractal-meshify-c", 
    name: "Fractal Design Meshify C", 
    brand: "Fractal Design", 
    category: "Case", 
    stock: 10, 
    price: 99.99, 
    description: "Compact mid-tower ATX case with a high-airflow mesh front panel. Features a tempered glass side panel, two 120mm fans, and support for radiators up to 360mm. Includes a removable dust filter and cable management options.", 
    formFactorSupport: ["ATX", "Micro-ATX", "Mini-ITX"], 
    maxGpuLengthMm: 315, 
    maxCpuCoolerHeightMm: 170, 
    psuFormFactor: "ATX", 
    rate: 4 
  },
  { 
    id: "case-coolermaster-td500", 
    name: "Cooler Master TD500 Mesh", 
    brand: "Cooler Master", 
    category: "Case", 
    stock: 8, 
    price: 119.99, 
    description: "Mid-tower ATX case with a mesh front panel and three 120mm ARGB fans pre-installed. Features a tempered glass side panel, USB 3.0 ports, and support for radiators up to 360mm. Includes a PSU shroud and cable management options.", 
    formFactorSupport: ["ATX", "Micro-ATX", "Mini-ITX"], 
    maxGpuLengthMm: 410, 
    maxCpuCoolerHeightMm: 165, 
    psuFormFactor: "ATX", 
    rate: 5 
  },
];

export const PowerSupply: PSU[] = [
  { 
    id: "psu-rm550x", 
    name: "Corsair RM550x (2021)", 
    brand: "Corsair", 
    category: "Power Supply", 
    stock: 15, 
    price: 99.99, 
    description: "550W 80+ Gold fully modular power supply with 135mm magnetic levitation fan for quiet operation. Features 100% Japanese 105°C capacitors and a 10-year warranty.", 
    wattage: 550, 
    efficiency: "80+ Gold", 
    modularity: "Fully Modular", 
    formFactor: "ATX", 
    rate: 5 
  },
  { 
    id: "psu-rm750x", 
    name: "Corsair RM750x (2021)", 
    brand: "Corsair", 
    category: "Power Supply", 
    stock: 12, 
    price: 129.99, 
    description: "750W 80+ Gold fully modular power supply with 135mm magnetic levitation fan. Features 100% Japanese 105°C capacitors, Zero RPM fan mode, and a 10-year warranty.", 
    wattage: 750, 
    efficiency: "80+ Gold", 
    modularity: "Fully Modular", 
    formFactor: "ATX", 
    rate: 5 
  },
  { 
    id: "psu-focus-gx-650", 
    name: "Seasonic FOCUS GX-650", 
    brand: "Seasonic", 
    category: "Power Supply", 
    stock: 10, 
    price: 119.99, 
    description: "650W 80+ Gold fully modular power supply with 120mm fluid dynamic bearing fan. Features Japanese capacitors, hybrid silent fan control, and a 10-year warranty.", 
    wattage: 650, 
    efficiency: "80+ Gold", 
    modularity: "Fully Modular", 
    formFactor: "ATX", 
    rate: 5 
  },
  { id: "psu-focus-px-850", name: "Seasonic FOCUS PX-850", brand: "Seasonic", category: "Power Supply", stock: 8, price: 189.99, description: "Premium 850W fully modular power supply with 80+ Platinum efficiency. Features a 140mm fluid dynamic bearing fan, hybrid silent fan control, and a 10-year warranty. Perfect for high-end gaming PCs and workstations.", wattage: 850, efficiency: "80+ Platinum", modularity: "Fully Modular", formFactor: "ATX", rate: 5 },
  { id: "psu-bq-straight-750", name: "be quiet! Straight Power 11 750W", brand: "be quiet!", category: "Power Supply", stock: 10, price: 139.99, description: "High-quality 750W semi-modular power supply with 80+ Gold efficiency. Features a silent 135mm be quiet! fan, modular cabling, and a 5-year warranty. Ideal for gaming PCs and workstations.", wattage: 750, efficiency: "80+ Gold", modularity: "Semi-Modular", formFactor: "ATX", rate: 4 },
  { id: "psu-cm-v1000", name: "Cooler Master V1000", brand: "Cooler Master", category: "Power Supply", stock: 6, price: 229.99, description: "High-performance 1000W fully modular power supply with 80+ Gold efficiency. Features a 135mm FDB fan, fully modular design, and a 10-year warranty. Perfect for high-end gaming rigs and workstations.", wattage: 1000, efficiency: "80+ Gold", modularity: "Fully Modular", formFactor: "ATX", rate: 4 },
];
