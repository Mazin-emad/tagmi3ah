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
import { useCreatePsu } from "@/hooks/product/usePsus";
import { useAllBrands } from "@/hooks/useBrands";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import type { ApiError } from "@/api/types";

const psuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  wattage: z.number().min(1, "Wattage is required"),
  efficiency: z.string().min(1, "Efficiency is required"),
  modularity: z.string().min(1, "Modularity is required"),
  formFactor: z.string().min(1, "Form factor is required"),
  image: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      "Image is required"
    ),
});

type PsuFormData = z.infer<typeof psuSchema>;

interface PsuFormProps {
  categoryId: number;
}

export default function PsuForm({ categoryId }: PsuFormProps) {
  const { mutate: createPsu, isPending } = useCreatePsu();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<PsuFormData>({
    resolver: zodResolver(psuSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      brandId: 0,
      categoryId: categoryId,
      wattage: 0,
      efficiency: "",
      modularity: "",
      formFactor: "",
    },
  });

  useEffect(() => {
    form.setValue("categoryId", categoryId);
  }, [categoryId, form]);

  const onSubmit = (data: PsuFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    createPsu(
      {
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          stock: data.stock,
          brandId: data.brandId,
          categoryId: data.categoryId,
          wattage: data.wattage,
          efficiency: data.efficiency,
          modularity: data.modularity,
          formFactor: data.formFactor,
        },
        image: imageFile,
      },
      {
        onSuccess: () => {
          toast.success("PSU created successfully!");
          form.reset();
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          if (apiError?.fieldErrors) {
            Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof PsuFormData, { message });
            });
          }
          toast.error(apiError?.message || "Failed to create PSU");
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
        <CardTitle>Add New PSU</CardTitle>
        <CardDescription>
          Create a new power supply unit product
        </CardDescription>
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
                name="wattage"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="wattage">Wattage</Label>
                    <Input
                      id="wattage"
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
                name="efficiency"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="efficiency">Efficiency</Label>
                    <Input
                      id="efficiency"
                      placeholder="e.g., 80+ Gold"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modularity"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="modularity">Modularity</Label>
                    <Input
                      id="modularity"
                      placeholder="e.g., Semi"
                      {...field}
                    />
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
                    <Input id="formFactor" placeholder="e.g., ATX" {...field} />
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
              {isPending ? "Creating..." : "Create PSU"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
