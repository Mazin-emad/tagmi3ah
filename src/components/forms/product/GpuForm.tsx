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
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useCreateGpu } from "@/hooks/product/useGpus";
import { useAllBrands } from "@/hooks/useBrands";
import { useAllCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import { useState } from "react";
import type { ApiError } from "@/api/types";

const gpuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  vramGB: z.number().min(1, "VRAM is required"),
  tdpW: z.number().min(1, "TDP is required"),
  recommendedPSUWatt: z.number().min(1, "Recommended PSU wattage is required"),
  performanceTier: z.string().min(1, "Performance tier is required"),
  lengthMm: z.number().min(1, "Length is required"),
  image: z.any().refine((file) => file instanceof File && file.size > 0, "Image is required"),
});

type GpuFormData = z.infer<typeof gpuSchema>;

export default function GpuForm() {
  const { mutate: createGpu, isPending } = useCreateGpu();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<GpuFormData>({
    resolver: zodResolver(gpuSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      brandId: 0,
      categoryId: 0,
      vramGB: 0,
      tdpW: 0,
      recommendedPSUWatt: 0,
      performanceTier: "",
      lengthMm: 0,
    },
  });

  const onSubmit = (data: GpuFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    createGpu(
      {
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          stock: data.stock,
          brandId: data.brandId,
          categoryId: data.categoryId,
          vramGB: data.vramGB,
          tdpW: data.tdpW,
          recommendedPSUWatt: data.recommendedPSUWatt,
          performanceTier: data.performanceTier,
          lengthMm: data.lengthMm,
        },
        image: imageFile,
      },
      {
        onSuccess: () => {
          toast.success("GPU created successfully!");
          form.reset();
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          if (apiError?.fieldErrors) {
            Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof GpuFormData, { message });
            });
          }
          toast.error(apiError?.message || "Failed to create GPU");
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
        <CardTitle>Add New GPU</CardTitle>
        <CardDescription>Create a new graphics processing unit product</CardDescription>
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
                name="vramGB"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="vramGB">VRAM (GB)</Label>
                    <Input
                      id="vramGB"
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
                name="tdpW"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="tdpW">TDP (W)</Label>
                    <Input
                      id="tdpW"
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
                name="recommendedPSUWatt"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="recommendedPSUWatt">Recommended PSU (W)</Label>
                    <Input
                      id="recommendedPSUWatt"
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
                name="performanceTier"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="performanceTier">Performance Tier</Label>
                    <Input id="performanceTier" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lengthMm"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="lengthMm">Length (mm)</Label>
                    <Input
                      id="lengthMm"
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
              {isPending ? "Creating..." : "Create GPU"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

