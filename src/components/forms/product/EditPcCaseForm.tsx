import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(0).optional(),
  categoryId: z.number().min(0).optional(),
  formFactor: z.string().optional(),
  maxGpuLengthMm: z.number().min(0).optional(),
  maxCpuCoolerHeightMm: z.number().min(0).optional(),
  psuFormFactor: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditPcCaseForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { mutate: updatePcCase, isPending } = useUpdatePcCase();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      brandId: (product as any).brandId ?? undefined,
      categoryId: (product as any).categoryId ?? undefined,
      formFactor: (product as any).formFactor ?? undefined,
      maxGpuLengthMm: (product as any).maxGpuLengthMm ?? undefined,
      maxCpuCoolerHeightMm: (product as any).maxCpuCoolerHeightMm ?? undefined,
      psuFormFactor: (product as any).psuFormFactor ?? undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    const id = Number(product.id);
    updatePcCase(
      { id, data: {
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
      } },
      {
        onSuccess: () => {
          toast.success("PC Case updated successfully");
          onClose();
        },
        onError: (e: any) => toast.error(e?.message || "Failed to update PC Case"),
      }
    );
  };

  const brandOptions = brands.map((b) => ({ value: b.id.toString(), label: b.name }));
  const categoryOptions = categories.map((c) => ({ value: c.id.toString(), label: c.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit PC Case</CardTitle>
        <CardDescription>Update PC Case product</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...field} />
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="price" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="description" control={form.control} render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...field} />
                  <FormMessage />
                </FormItem>
              )} />
              <FormField name="stock" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="brandId" control={form.control} render={({ field }) => (
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
              )} />

              <FormField name="categoryId" control={form.control} render={({ field }) => (
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
              )} />

              <FormField name="formFactor" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="formFactor">Form Factor</Label>
                  <Input id="formFactor" placeholder="e.g., ATX, mATX" {...field} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="maxGpuLengthMm" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="maxGpuLengthMm">Max GPU Length (mm)</Label>
                  <Input id="maxGpuLengthMm" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="maxCpuCoolerHeightMm" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="maxCpuCoolerHeightMm">Max CPU Cooler Height (mm)</Label>
                  <Input id="maxCpuCoolerHeightMm" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="psuFormFactor" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="psuFormFactor">PSU Form Factor</Label>
                  <Input id="psuFormFactor" placeholder="e.g., ATX, SFX" {...field} />
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={isPending}>Save Changes</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
