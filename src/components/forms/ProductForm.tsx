import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useCreateGpu,
} from "@/hooks/product/useGpus";
import { useCreatePsu } from "@/hooks/product/usePsus";
import { useCreateMotherboard } from "@/hooks/product/useMotherboards";
import { useCreateRamKit } from "@/hooks/product/useRamKits";
import { useCreatePcCase } from "@/hooks/product/usePcCases";
import { useCreateCpu } from "@/hooks/product/useCpus";
import { toast } from "sonner";
import { useState } from "react";
import type { ApiError } from "@/api/types";

const FormSchema = z.object({
  productType: z.enum(["gpu", "psu", "motherboard", "ramKit", "pcCase", "cpu"]),
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  brandName: z.string().min(1, "Brand is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  // Optional, specific fields
  vramGB: z.number().optional(),
  tdpW: z.number().optional(),
  recommendedPSUWatt: z.number().optional(),
  performanceTier: z.string().optional(),
  lengthMm: z.number().optional(),

  wattage: z.number().optional(),
  efficiency: z.string().optional(),
  modularity: z.string().optional(),
  formFactor: z.string().optional(),

  socket: z.string().optional(),
  chipset: z.string().optional(),
  ramType: z.string().optional(),
  ramSlots: z.number().optional(),
  maxMemorySpeedMHz: z.number().optional(),
  pcieVersion: z.string().optional(),
  m2Slots: z.number().optional(),
  wifi: z.boolean().optional(),

  capacityGB: z.number().optional(),
  modules: z.number().optional(),
  speedMHz: z.number().optional(),
  type: z.string().optional(),
  casLatency: z.number().optional(),

  maxGpuLengthMm: z.number().optional(),
  maxCpuCoolerHeightMm: z.number().optional(),
  psuFormFactor: z.string().optional(),

  cores: z.number().optional(),
  threads: z.number().optional(),
  baseClockGHz: z.number().optional(),
  boostClockGHz: z.number().optional(),

  image: z.instanceof(File).optional().or(z.string().optional()),
});

type ProductFormData = z.infer<typeof FormSchema>;

export default function ProductForm() {
  const { mutate: createGpu, isPending: creatingGpu } = useCreateGpu();
  const { mutate: createPsu, isPending: creatingPsu } = useCreatePsu();
  const { mutate: createMotherboard, isPending: creatingMb } = useCreateMotherboard();
  const { mutate: createRamKit, isPending: creatingRam } = useCreateRamKit();
  const { mutate: createPcCase, isPending: creatingCase } = useCreatePcCase();
  const { mutate: createCpu, isPending: creatingCpu } = useCreateCpu();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      productType: "gpu",
      name: "",
      price: 0,
      description: "",
      brandName: "",
      stock: 0,
      image: undefined,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    const common = {
      name: data.name,
      price: data.price,
      description: data.description,
      stock: data.stock,
      brandName: data.brandName,
    } as Record<string, any>;

    const onSuccess = () => {
      toast.success("Product created successfully!");
      form.reset({ productType: data.productType, name: "", price: 0, description: "", brandName: "", stock: 0 });
      setImageFile(null);
    };
    const onError = (error: unknown) => {
      const apiError = error as ApiError;
      if (apiError?.fieldErrors) {
        Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof ProductFormData, { message });
        });
      }
      toast.error(apiError?.message || "Failed to create product.");
    };

    switch (data.productType) {
      case "gpu":
        createGpu({ data: { ...common, vramGB: data.vramGB ?? 0, tdpW: data.tdpW ?? 0, recommendedPSUWatt: data.recommendedPSUWatt ?? 0, performanceTier: data.performanceTier ?? "", lengthMm: data.lengthMm ?? 0 }, image: imageFile || undefined }, { onSuccess, onError });
        break;
      case "psu":
        createPsu({ data: { ...common, wattage: data.wattage ?? 0, efficiency: data.efficiency ?? "", modularity: data.modularity ?? "", formFactor: data.formFactor ?? "" }, image: imageFile || undefined }, { onSuccess, onError });
        break;
      case "motherboard":
        createMotherboard({ data: { ...common, socket: data.socket ?? "", chipset: data.chipset ?? "", formFactor: data.formFactor ?? "", ramType: data.ramType ?? "", ramSlots: data.ramSlots ?? 0, maxMemorySpeedMHz: data.maxMemorySpeedMHz ?? 0, pcieVersion: data.pcieVersion ?? "", m2Slots: data.m2Slots ?? 0, wifi: data.wifi ?? false }, image: imageFile || undefined }, { onSuccess, onError });
        break;
      case "ramKit":
        createRamKit({ data: { ...common, capacityGB: data.capacityGB ?? 0, modules: data.modules ?? 0, speedMHz: data.speedMHz ?? 0, type: data.type ?? "", casLatency: data.casLatency ?? 0 }, image: imageFile || undefined }, { onSuccess, onError });
        break;
      case "pcCase":
        createPcCase({ data: { ...common, formFactor: data.formFactor ?? "", maxGpuLengthMm: data.maxGpuLengthMm ?? 0, maxCpuCoolerHeightMm: data.maxCpuCoolerHeightMm ?? 0, psuFormFactor: data.psuFormFactor ?? "" }, image: imageFile || undefined }, { onSuccess, onError });
        break;
      case "cpu":
        createCpu({ data: { ...common, cores: data.cores ?? 0, threads: data.threads ?? 0, baseClockGHz: data.baseClockGHz ?? 0, boostClockGHz: data.boostClockGHz ?? 0, socket: data.socket ?? "", tdpW: data.tdpW ?? 0 }, image: imageFile || undefined }, { onSuccess, onError });
        break;
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      form.setValue("image", file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Add a new product to the database. Click Add when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2"
          >
            <div className="grid gap-3">
              <Label htmlFor="product-type">Product Type</Label>
              <select id="product-type" className="border rounded-md px-3 py-2" {...form.register("productType")}> 
                <option value="gpu">GPU</option>
                <option value="psu">PSU</option>
                <option value="motherboard">Motherboard</option>
                <option value="ramKit">RAM Kit</option>
                <option value="pcCase">PC Case</option>
                <option value="cpu">CPU</option>
              </select>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-name">Name</Label>
              <Input id="product-name" {...form.register("name")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-description">Description</Label>
              <Input
                id="product-description"
                {...form.register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-brand">Brand</Label>
              <Input id="product-brand" {...form.register("brandName")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                {...form.register("stock", { valueAsNumber: true })}
              />
            </div>
            {/* GPU specific */}
            {form.watch("productType") === "gpu" && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="vramGB">VRAM (GB)</Label>
                  <Input id="vramGB" type="number" {...form.register("vramGB", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tdpW">TDP (W)</Label>
                  <Input id="tdpW" type="number" {...form.register("tdpW", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="recommendedPSUWatt">Recommended PSU (W)</Label>
                  <Input id="recommendedPSUWatt" type="number" {...form.register("recommendedPSUWatt", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="performanceTier">Performance Tier</Label>
                  <Input id="performanceTier" {...form.register("performanceTier")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lengthMm">Length (mm)</Label>
                  <Input id="lengthMm" type="number" {...form.register("lengthMm", { valueAsNumber: true })} />
                </div>
              </>
            )}
            {/* PSU specific */}
            {form.watch("productType") === "psu" && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="wattage">Wattage</Label>
                  <Input id="wattage" type="number" {...form.register("wattage", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="efficiency">Efficiency</Label>
                  <Input id="efficiency" {...form.register("efficiency")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="modularity">Modularity</Label>
                  <Input id="modularity" {...form.register("modularity")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="formFactor">Form Factor</Label>
                  <Input id="formFactor" {...form.register("formFactor")} />
                </div>
              </>
            )}
            {/* Motherboard specific */}
            {form.watch("productType") === "motherboard" && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="socket">Socket</Label>
                  <Input id="socket" {...form.register("socket")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="chipset">Chipset</Label>
                  <Input id="chipset" {...form.register("chipset")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="mb-formFactor">Form Factor</Label>
                  <Input id="mb-formFactor" {...form.register("formFactor")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="ramType">RAM Type</Label>
                  <Input id="ramType" {...form.register("ramType")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="ramSlots">RAM Slots</Label>
                  <Input id="ramSlots" type="number" {...form.register("ramSlots", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maxMemorySpeedMHz">Max Memory Speed (MHz)</Label>
                  <Input id="maxMemorySpeedMHz" type="number" {...form.register("maxMemorySpeedMHz", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="pcieVersion">PCIe Version</Label>
                  <Input id="pcieVersion" {...form.register("pcieVersion")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="m2Slots">M.2 Slots</Label>
                  <Input id="m2Slots" type="number" {...form.register("m2Slots", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="wifi">WiFi</Label>
                  <input id="wifi" type="checkbox" {...form.register("wifi")} />
                </div>
              </>
            )}
            {/* RAM Kit */}
            {form.watch("productType") === "ramKit" && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="capacityGB">Capacity (GB)</Label>
                  <Input id="capacityGB" type="number" {...form.register("capacityGB", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="modules">Modules</Label>
                  <Input id="modules" type="number" {...form.register("modules", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="speedMHz">Speed (MHz)</Label>
                  <Input id="speedMHz" type="number" {...form.register("speedMHz", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" {...form.register("type")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="casLatency">CAS Latency</Label>
                  <Input id="casLatency" type="number" {...form.register("casLatency", { valueAsNumber: true })} />
                </div>
              </>
            )}
            {/* PC Case */}
            {form.watch("productType") === "pcCase" && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="case-formFactor">Form Factor</Label>
                  <Input id="case-formFactor" {...form.register("formFactor")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maxGpuLengthMm">Max GPU Length (mm)</Label>
                  <Input id="maxGpuLengthMm" type="number" {...form.register("maxGpuLengthMm", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="maxCpuCoolerHeightMm">Max CPU Cooler Height (mm)</Label>
                  <Input id="maxCpuCoolerHeightMm" type="number" {...form.register("maxCpuCoolerHeightMm", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="psuFormFactor">PSU Form Factor</Label>
                  <Input id="psuFormFactor" {...form.register("psuFormFactor")} />
                </div>
              </>
            )}
            {/* CPU */}
            {form.watch("productType") === "cpu" && (
              <>
                <div className="grid gap-3">
                  <Label htmlFor="cores">Cores</Label>
                  <Input id="cores" type="number" {...form.register("cores", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="threads">Threads</Label>
                  <Input id="threads" type="number" {...form.register("threads", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="baseClockGHz">Base Clock (GHz)</Label>
                  <Input id="baseClockGHz" type="number" step="0.01" {...form.register("baseClockGHz", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="boostClockGHz">Boost Clock (GHz)</Label>
                  <Input id="boostClockGHz" type="number" step="0.01" {...form.register("boostClockGHz", { valueAsNumber: true })} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="cpu-socket">Socket</Label>
                  <Input id="cpu-socket" {...form.register("socket")} />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="cpu-tdpW">TDP (W)</Label>
                  <Input id="cpu-tdpW" type="number" {...form.register("tdpW", { valueAsNumber: true })} />
                </div>
              </>
            )}
            <div className="grid gap-3">
              <Label htmlFor="product-image">Image</Label>
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={creatingGpu || creatingPsu || creatingMb || creatingRam || creatingCase || creatingCpu} className="w-full sm:w-auto">
                {(creatingGpu || creatingPsu || creatingMb || creatingRam || creatingCase || creatingCpu) ? "Creating..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

