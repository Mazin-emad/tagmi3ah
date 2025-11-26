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
import { useCreateRamKit } from "@/hooks/product/useRamKits";
import { useAllBrands } from "@/hooks/useBrands";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { ApiError } from "@/api/types";

const ramKitSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  capacityGB: z.number().min(1, "Capacity is required"),
  modules: z.number().min(1, "Modules is required"),
  speedMHz: z.number().min(1, "Speed is required"),
  type: z.string().min(1, "Type is required"),
  casLatency: z.number().min(1, "CAS latency is required"),
  image: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      "Image is required"
    ),
});

type RamKitFormData = z.infer<typeof ramKitSchema>;

interface RamKitFormProps {
  categoryId: number;
}

export default function RamKitForm({ categoryId }: RamKitFormProps) {
  const { mutate: createRamKit, isPending } = useCreateRamKit();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<RamKitFormData>({
    resolver: zodResolver(ramKitSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      brandId: 0,
      categoryId: categoryId,
      capacityGB: 0,
      modules: 0,
      speedMHz: 0,
      type: "",
      casLatency: 0,
    },
  });

  useEffect(() => {
    form.setValue("categoryId", categoryId);
  }, [categoryId, form]);

  const onSubmit = (data: RamKitFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    createRamKit(
      {
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          stock: data.stock,
          brandId: data.brandId,
          categoryId: data.categoryId,
          capacityGB: data.capacityGB,
          modules: data.modules,
          speedMHz: data.speedMHz,
          type: data.type,
          casLatency: data.casLatency,
        },
        image: imageFile,
      },
      {
        onSuccess: () => {
          toast.success("RAM Kit created successfully!");
          form.reset();
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          if (apiError?.fieldErrors) {
            Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof RamKitFormData, { message });
            });
          }
          toast.error(apiError?.message || "Failed to create RAM Kit");
        },
      }
    );
  };

  const brandOptions = brands.map((brand) => ({
    value: brand.id.toString(),
    label: brand.name,
  }));
  brandOptions.unshift({ value: "", label: "Select a brand" });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New RAM Kit</CardTitle>
        <CardDescription>Create a new RAM kit product</CardDescription>
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
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacityGB"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="capacityGB">Capacity (GB)</Label>
                    <Input
                      id="capacityGB"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modules"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="modules">Modules</Label>
                    <Input
                      id="modules"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speedMHz"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="speedMHz">Speed (MHz)</Label>
                    <Input
                      id="speedMHz"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="type">Type</Label>
                    <Input
                      id="type"
                      placeholder="e.g., DDR4, DDR5"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="casLatency"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="casLatency">CAS Latency</Label>
                    <Input
                      id="casLatency"
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
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
              {isPending ? "Creating..." : "Create RAM Kit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
