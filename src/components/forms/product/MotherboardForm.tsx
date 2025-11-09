import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useCreateMotherboard } from "@/hooks/product/useMotherboards";
import { useAllBrands } from "@/hooks/useBrands";
import { useAllCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import { useState } from "react";
import type { ApiError } from "@/api/types";

const motherboardSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  socket: z.string().min(1, "Socket is required"),
  chipset: z.string().min(1, "Chipset is required"),
  formFactor: z.string().min(1, "Form factor is required"),
  ramType: z.string().min(1, "RAM type is required"),
  ramSlots: z.number().min(1, "RAM slots is required"),
  maxMemorySpeedMHz: z.number().min(1, "Max memory speed is required"),
  pcieVersion: z.string().min(1, "PCIe version is required"),
  m2Slots: z.number().min(0, "M.2 slots cannot be negative"),
  wifi: z.boolean(),
  image: z.any().refine((file) => file instanceof File && file.size > 0, "Image is required"),
});

type MotherboardFormData = z.infer<typeof motherboardSchema>;

export default function MotherboardForm() {
  const { mutate: createMotherboard, isPending } = useCreateMotherboard();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<MotherboardFormData>({
    resolver: zodResolver(motherboardSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      brandId: 0,
      categoryId: 0,
      socket: "",
      chipset: "",
      formFactor: "",
      ramType: "",
      ramSlots: 0,
      maxMemorySpeedMHz: 0,
      pcieVersion: "",
      m2Slots: 0,
      wifi: false,
    },
  });

  const onSubmit = (data: MotherboardFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    createMotherboard(
      {
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          stock: data.stock,
          brandId: data.brandId,
          categoryId: data.categoryId,
          socket: data.socket,
          chipset: data.chipset,
          formFactor: data.formFactor,
          ramType: data.ramType,
          ramSlots: data.ramSlots,
          maxMemorySpeedMHz: data.maxMemorySpeedMHz,
          pcieVersion: data.pcieVersion,
          m2Slots: data.m2Slots,
          wifi: data.wifi,
        },
        image: imageFile,
      },
      {
        onSuccess: () => {
          toast.success("Motherboard created successfully!");
          form.reset();
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          if (apiError?.fieldErrors) {
            Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof MotherboardFormData, { message });
            });
          }
          toast.error(apiError?.message || "Failed to create motherboard");
        },
      }
    );
  };

  const brandOptions = brands.map((brand) => ({
    value: brand.id.toString(),
    label: brand.name,
  }));

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Motherboard</CardTitle>
        <CardDescription>Create a new motherboard product</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="brandId">Brand</Label>
                    <Select
                      id="brandId"
                      value={field.value?.toString() || ""}
                      placeholder="Select a brand"
                      options={brandOptions}
                      disabled={brandsLoading}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="categoryId">Category</Label>
                    <Select
                      id="categoryId"
                      value={field.value?.toString() || ""}
                      placeholder="Select a category"
                      options={categoryOptions}
                      disabled={categoriesLoading}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="socket"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="socket">Socket</Label>
                    <Input id="socket" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chipset"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="chipset">Chipset</Label>
                    <Input id="chipset" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formFactor"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="formFactor">Form Factor</Label>
                    <Input id="formFactor" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ramType"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="ramType">RAM Type</Label>
                    <Input id="ramType" placeholder="e.g., DDR4, DDR5" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ramSlots"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="ramSlots">RAM Slots</Label>
                    <Input
                      id="ramSlots"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxMemorySpeedMHz"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="maxMemorySpeedMHz">Max Memory Speed (MHz)</Label>
                    <Input
                      id="maxMemorySpeedMHz"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pcieVersion"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="pcieVersion">PCIe Version</Label>
                    <Input id="pcieVersion" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="m2Slots"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="m2Slots">M.2 Slots</Label>
                    <Input
                      id="m2Slots"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wifi"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <Checkbox
                      id="wifi"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="wifi" className="cursor-pointer">
                      WiFi Enabled
                    </Label>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem className="sm:col-span-2">
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImageFile(file);
                          form.setValue("image", file);
                        }
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Motherboard"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

