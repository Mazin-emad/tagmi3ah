import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useUpdatePcCase } from "@/hooks/product/usePcCases";
import { useAllBrands } from "@/hooks/useBrands";
import { toast } from "sonner";
import type { Product } from "@/api/types";

type ProductWithExtendedFields = Product & {
  brandId?: number;
  categoryId?: number;
  formFactor?: string;
  maxGpuLengthMm?: number;
  maxCpuCoolerHeightMm?: number;
  psuFormFactor?: string;
  brand?: string;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  formFactor: z.string().optional(),
  maxGpuLengthMm: z.number().min(0).optional(),
  maxCpuCoolerHeightMm: z.number().min(0).optional(),
  psuFormFactor: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditPcCaseForm({
  product,
  onClose,
}: {
  product: ProductWithExtendedFields;
  onClose: () => void;
}) {
  const { mutate: updatePcCase, isPending } = useUpdatePcCase();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      brandId: product.brandId ?? undefined,
      categoryId: product.categoryId ?? undefined,
      formFactor: product.formFactor ?? undefined,
      maxGpuLengthMm: product.maxGpuLengthMm ?? undefined,
      maxCpuCoolerHeightMm: product.maxCpuCoolerHeightMm ?? undefined,
      psuFormFactor: product.psuFormFactor ?? undefined,
    },
  });

  useEffect(() => {
    const current = form.getValues("brandId");
    if ((current === undefined || current === null) && brands.length > 0) {
      const idFromProduct = product.brandId;
      if (typeof idFromProduct === "number" && idFromProduct > 0) {
        form.setValue("brandId", idFromProduct, { shouldDirty: false });
        return;
      }
      const name = (product.brandName || product.brand || "")
        .toString()
        .trim()
        .toLowerCase();
      if (name) {
        const found = brands.find((b) => b.name.trim().toLowerCase() === name);
        if (found) {
          form.setValue("brandId", found.id, { shouldDirty: false });
        }
      }
    }
  }, [brands, form, product]);

  useEffect(() => {
    const current = form.getValues("categoryId");
    if (current === undefined || current === null) {
      const idFromProduct = product.categoryId;
      if (typeof idFromProduct === "number" && idFromProduct > 0) {
        form.setValue("categoryId", idFromProduct, { shouldDirty: false });
      }
    }
  }, [form, product]);

  const onSubmit = (data: FormData) => {
    const id = Number(product.id);
    if (!data.brandId || data.brandId < 1) {
      form.setError("brandId", { message: "Brand is required" });
      toast.error("Brand is required");
      return;
    }
    if (!data.categoryId || data.categoryId < 1) {
      form.setError("categoryId", { message: "Category is required" });
      toast.error("Category is required");
      return;
    }
    updatePcCase(
      {
        id,
        data: {
          name: data.name,
          price: data.price,
          description: data.description,
          stock: data.stock,
          brandId: data.brandId,
          categoryId: data.categoryId,
          formFactor: data.formFactor,
          maxGpuLengthMm: data.maxGpuLengthMm,
          maxCpuCoolerHeightMm: data.maxCpuCoolerHeightMm,
          psuFormFactor: data.psuFormFactor,
        },
      },
      {
        onSuccess: () => {
          toast.success("PC Case updated successfully");
          onClose();
        },
        onError: (e: unknown) => {
          const error = e as {
            fieldErrors?: Record<string, string>;
            message?: string;
          };
          if (error?.fieldErrors) {
            Object.entries(error.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof FormData, {
                message: String(message),
              });
            });
          }
          toast.error(error?.message || "Failed to update PC Case");
        },
      }
    );
  };

  const brandOptions = brands.map((b) => ({
    value: b.id.toString(),
    label: b.name,
  }));

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="price"
                control={form.control}
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
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="stock"
                control={form.control}
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
                name="brandId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="brandId">Brand</Label>
                    <Select
                      id="brandId"
                      value={field.value?.toString() || ""}
                      placeholder="Select a brand"
                      options={brandOptions}
                      disabled={brandsLoading}
                      onChange={(e) => {
                        const v = (e.target as HTMLSelectElement).value;
                        field.onChange(v === "" ? undefined : parseInt(v, 10));
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="formFactor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="formFactor">Form Factor</Label>
                    <Input
                      id="formFactor"
                      placeholder="e.g., ATX, mATX"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? undefined : e.target.value
                        )
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="maxGpuLengthMm"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="maxGpuLengthMm">Max GPU Length (mm)</Label>
                    <Input
                      id="maxGpuLengthMm"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : parseInt(v, 10));
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="maxCpuCoolerHeightMm"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="maxCpuCoolerHeightMm">
                      Max CPU Cooler Height (mm)
                    </Label>
                    <Input
                      id="maxCpuCoolerHeightMm"
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : parseInt(v, 10));
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="psuFormFactor"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="psuFormFactor">PSU Form Factor</Label>
                    <Input
                      id="psuFormFactor"
                      placeholder="e.g., ATX, SFX"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? undefined : e.target.value
                        )
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
