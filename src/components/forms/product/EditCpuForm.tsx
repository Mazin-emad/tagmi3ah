import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useUpdateCpu } from "@/hooks/product/useCpus";
import { Select } from "@/components/ui/select";
import { useAllBrands } from "@/hooks/useBrands";
import { useAllCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import type { Product } from "@/api/types";

type ProductWithExtendedFields = Product & {
  brandId?: number;
  categoryId?: number;
  cores?: number;
  threads?: number;
  baseClockGHz?: number;
  boostClockGHz?: number;
  socket?: string;
  tdpW?: number;
  brand?: string;
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(1, "Brand is required"),
  categoryId: z.number().min(1, "Category is required"),
  cores: z.number().min(0).optional(),
  threads: z.number().min(0).optional(),
  baseClockGHz: z.number().min(0).optional(),
  boostClockGHz: z.number().min(0).optional(),
  socket: z.string().optional(),
  tdpW: z.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditCpuForm({
  product,
  onClose,
}: {
  product: ProductWithExtendedFields;
  onClose: () => void;
}) {
  const { mutate: updateCpu, isPending } = useUpdateCpu();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name || "",
      price: product.price || 0,
      description: product.description || "",
      stock: product.stock || 0,
      brandId: undefined,
      categoryId: undefined,
      cores: undefined,
      threads: undefined,
      baseClockGHz: undefined,
      boostClockGHz: undefined,
      socket: undefined,
      tdpW: undefined,
    },
  });

  useEffect(() => {
    const extendedProduct = product as ProductWithExtendedFields;
    
    // Try to get categoryId from product or look it up
    let categoryId = extendedProduct.categoryId;
    if ((!categoryId || categoryId < 1) && categories.length > 0) {
      const categoryName = product.categoryName || product.category || "";
      if (categoryName) {
        const found = categories.find(
          (c) => c.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
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
      categoryId: categoryId ?? undefined,
      cores: extendedProduct.cores ?? undefined,
      threads: extendedProduct.threads ?? undefined,
      baseClockGHz: extendedProduct.baseClockGHz ?? undefined,
      boostClockGHz: extendedProduct.boostClockGHz ?? undefined,
      socket: extendedProduct.socket ?? undefined,
      tdpW: extendedProduct.tdpW ?? undefined,
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
          (c) => c.name.trim().toLowerCase() === categoryName.trim().toLowerCase()
        );
        if (found) {
          form.setValue("categoryId", found.id, { shouldDirty: false });
        }
      }
    }
  }, [categories, form, product]);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted with data:", data);
    console.log("Product ID:", product.id);
    
    const id = Number(product.id);
    if (isNaN(id) || id < 1) {
      toast.error("Invalid product ID");
      console.error("Invalid product ID:", product.id);
      return;
    }
    if (!data.brandId || data.brandId < 1) {
      form.setError("brandId", { message: "Brand is required" });
      toast.error("Brand is required");
      console.error("Brand ID missing:", data.brandId);
      return;
    }
    if (!data.categoryId || data.categoryId < 1) {
      form.setError("categoryId", { message: "Category is required" });
      toast.error("Category is required");
      console.error("Category ID missing:", data.categoryId);
      return;
    }
    
    console.log("Calling updateCpu with:", { id, data });
    updateCpu(
      {
        id,
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
      },
      {
        onSuccess: () => {
          console.log("CPU updated successfully");
          toast.success("CPU updated successfully");
          onClose();
        },
        onError: (e: unknown) => {
          console.error("Error updating CPU:", e);
          const error = e as {
            fieldErrors?: Record<string, string>;
            message?: string;
            response?: {
              data?: {
                message?: string;
                fieldErrors?: Record<string, string>;
              };
            };
          };
          const errorMessage = 
            error?.message || 
            error?.response?.data?.message || 
            "Failed to update CPU";
          const fieldErrors = error?.fieldErrors || error?.response?.data?.fieldErrors;
          
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof FormData, {
                message: String(message),
              });
            });
          }
          toast.error(errorMessage);
        },
      }
    );
  };

  const onError = (errors: unknown) => {
    console.error("Form validation errors:", errors);
    const errorObj = errors as Record<string, { message?: string }>;
    const errorMessages = Object.entries(errorObj)
      .map(([field, error]) => `${field}: ${error?.message || "Invalid"}`)
      .join(", ");
    toast.error(`Form validation failed: ${errorMessages}`);
  };

  useEffect(() => {
    console.log("Form state changed:", {
      values: form.getValues(),
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
    });
  }, [form.formState.errors, form.formState.isValid, form.formState.isDirty]);

  const brandOptions = brands.map((b) => ({
    value: b.id.toString(),
    label: b.name,
  }));

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-4">
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
                name="cores"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="cores">Cores</Label>
                    <Input
                      id="cores"
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
                name="threads"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="threads">Threads</Label>
                    <Input
                      id="threads"
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
                name="baseClockGHz"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="baseClockGHz">Base Clock (GHz)</Label>
                    <Input
                      id="baseClockGHz"
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : parseFloat(v));
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="boostClockGHz"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="boostClockGHz">Boost Clock (GHz)</Label>
                    <Input
                      id="boostClockGHz"
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        field.onChange(v === "" ? undefined : parseFloat(v));
                      }}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="socket"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="socket">Socket</Label>
                    <Input
                      id="socket"
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
                name="tdpW"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="tdpW">TDP (W)</Label>
                    <Input
                      id="tdpW"
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
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending || brandsLoading}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
            {Object.keys(form.formState.errors).length > 0 && (
              <div className="text-sm text-destructive mt-2 p-2 bg-destructive/10 rounded">
                <p className="font-semibold">Form Errors:</p>
                <ul className="list-disc list-inside">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field}>
                      {field}: {error?.message as string}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
