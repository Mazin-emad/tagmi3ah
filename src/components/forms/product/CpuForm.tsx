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
import { useCreateCpu } from "@/hooks/product/useCpus";
import { useAllBrands } from "@/hooks/useBrands";
import { useAllCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import { useState } from "react";
import type { ApiError } from "@/api/types";

const cpuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  cores: z.number().min(1, "Cores is required"),
  threads: z.number().min(1, "Threads is required"),
  baseClockGHz: z.number().min(0.1, "Base clock is required"),
  boostClockGHz: z.number().min(0.1, "Boost clock is required"),
  socket: z.string().min(1, "Socket is required"),
  tdpW: z.number().min(1, "TDP is required"),
  image: z.any().refine((file) => file instanceof File && file.size > 0, "Image is required"),
});

type CpuFormData = z.infer<typeof cpuSchema>;

export default function CpuForm() {
  const { mutate: createCpu, isPending } = useCreateCpu();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<CpuFormData>({
    resolver: zodResolver(cpuSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      brandId: 0,
      categoryId: 0,
      cores: 0,
      threads: 0,
      baseClockGHz: 0,
      boostClockGHz: 0,
      socket: "",
      tdpW: 0,
    },
  });

  const onSubmit = (data: CpuFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    createCpu(
      {
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          stock: data.stock,
          brandId: data.brandId,
          categoryId: data.categoryId,
          cores: data.cores,
          threads: data.threads,
          baseClockGHz: data.baseClockGHz,
          boostClockGHz: data.boostClockGHz,
          socket: data.socket,
          tdpW: data.tdpW,
        },
        image: imageFile,
      },
      {
        onSuccess: () => {
          toast.success("CPU created successfully!");
          form.reset();
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          if (apiError?.fieldErrors) {
            Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof CpuFormData, { message });
            });
          }
          toast.error(apiError?.message || "Failed to create CPU");
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
        <CardTitle>Add New CPU</CardTitle>
        <CardDescription>Create a new central processing unit product</CardDescription>
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
                name="cores"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="cores">Cores</Label>
                    <Input
                      id="cores"
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
                name="threads"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="threads">Threads</Label>
                    <Input
                      id="threads"
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
                name="baseClockGHz"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="baseClockGHz">Base Clock (GHz)</Label>
                    <Input
                      id="baseClockGHz"
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
                name="boostClockGHz"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="boostClockGHz">Boost Clock (GHz)</Label>
                    <Input
                      id="boostClockGHz"
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
              {isPending ? "Creating..." : "Create CPU"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

