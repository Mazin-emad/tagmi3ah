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
import { useAllCategories } from "@/hooks/useCategories";
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
  const { data: categories = [] } = useAllCategories();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      stock: product.stock || 0,
      brandId: undefined,
      categoryId: undefined,
      formFactor: undefined,
      maxGpuLengthMm: undefined,
      maxCpuCoolerHeightMm: undefined,
      psuFormFactor: undefined,
    },
  });

  useEffect(() => {
    const extendedProduct = product as ProductWithExtendedFields;

    // Try to get categoryId from product or look it up
    let categoryId: number | undefined = extendedProduct.categoryId;
    if ((!categoryId || categoryId < 1) && categories.length > 0) {
      const categoryName = product.categoryName || product.category || "";
      if (categoryName) {
        const found = categories.find(
          (c) =>
            c.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
        );
        if (found) {
          categoryId = found.id;
        }
      }
    }

    form.reset({
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      stock: product.stock || 0,
      brandId: extendedProduct.brandId ?? undefined,
      categoryId: categoryId,
      formFactor: extendedProduct.formFactor ?? undefined,
      maxGpuLengthMm: extendedProduct.maxGpuLengthMm ?? undefined,
      maxCpuCoolerHeightMm: extendedProduct.maxCpuCoolerHeightMm ?? undefined,
      psuFormFactor: extendedProduct.psuFormFactor ?? undefined,
    });
  }, [product, form, categories]);

  useEffect(() => {
    if (brands.length === 0) return;

    const extendedProduct = product as ProductWithExtendedFields;
    const currentBrandId = form.getValues("brandId");

    if (!currentBrandId || currentBrandId < 1) {
      if (
        typeof extendedProduct.brandId === "number" &&
        extendedProduct.brandId > 0
      ) {
        form.setValue("brandId", extendedProduct.brandId, {
          shouldDirty: false,
        });
        return;
      }

      const brandName = (product.brandName || product.brand || "")
        .toString()
        .trim()
        .toLowerCase();
      if (brandName) {
        const found = brands.find(
          (b) => b.name.trim().toLowerCase() === brandName
        );
        if (found) {
          form.setValue("brandId", found.id, { shouldDirty: false });
        }
      }
    }
  }, [brands, form, product]);

  useEffect(() => {
    if (categories.length === 0) return;

    const extendedProduct = product as ProductWithExtendedFields;
    const currentCategoryId = form.getValues("categoryId");

    if (!currentCategoryId || currentCategoryId < 1) {
      // First try to get categoryId directly from product
      if (
        typeof extendedProduct.categoryId === "number" &&
        extendedProduct.categoryId > 0
      ) {
        form.setValue("categoryId", extendedProduct.categoryId, {
          shouldDirty: false,
        });
        return;
      }

      // If not found, look up by categoryName
      const categoryName = product.categoryName || product.category || "";
      if (categoryName) {
        const found = categories.find(
          (c) =>
            c.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
        );
        if (found) {
          form.setValue("categoryId", found.id, { shouldDirty: false });
        }
      }
    }
  }, [categories, form, product]);

  const onSubmit = (data: FormData) => {
    const id = Number(product.id);
    if (isNaN(id) || id < 1) {
      toast.error("Invalid product ID");
      return;
    }
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
