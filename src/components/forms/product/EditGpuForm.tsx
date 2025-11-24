import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useAllBrands } from "@/hooks/useBrands";
import { useAllCategories } from "@/hooks/useCategories";
import { useUpdateGpu } from "@/hooks/product/useGpus";
import { toast } from "sonner";
import type { Product } from "@/api/types";

const editGpuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(0).optional(),
  categoryId: z.number().min(0).optional(),
  vramGB: z.number().min(0).optional(),
  tdpW: z.number().min(0).optional(),
  recommendedPSUWatt: z.number().min(0).optional(),
  performanceTier: z.string().optional(),
  lengthMm: z.number().min(0).optional(),
  image: z.any().optional(),
});

type EditGpuFormData = z.infer<typeof editGpuSchema>;

export default function EditGpuForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { mutate: updateGpu, isPending } = useUpdateGpu();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const { data: categories = [], isLoading: categoriesLoading } = useAllCategories();
  const form = useForm<EditGpuFormData>({
    resolver: zodResolver(editGpuSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      brandId: (product as any).brandId ?? undefined,
      categoryId: (product as any).categoryId ?? undefined,
      vramGB: (product as any).vramGB ?? undefined,
      tdpW: (product as any).tdpW ?? undefined,
      recommendedPSUWatt: (product as any).recommendedPSUWatt ?? undefined,
      performanceTier: (product as any).performanceTier ?? undefined,
      lengthMm: (product as any).lengthMm ?? undefined,
    },
  });

  const onSubmit = (data: EditGpuFormData) => {
    const id = Number(product.id);
    updateGpu(
      { id, data: {
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
      }},
      {
        onSuccess: () => {
          toast.success("GPU updated successfully");
          onClose();
        },
        onError: (e: any) => {
          toast.error(e?.message || "Failed to update GPU");
        }
      }
    );
  };

  const brandOptions = brands.map((b) => ({ value: b.id.toString(), label: b.name }));
  const categoryOptions = categories.map((c) => ({ value: c.id.toString(), label: c.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit GPU</CardTitle>
        <CardDescription>Update GPU product</CardDescription>
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

              <FormField name="vramGB" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="vramGB">VRAM (GB)</Label>
                  <Input id="vramGB" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="tdpW" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="tdpW">TDP (W)</Label>
                  <Input id="tdpW" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="recommendedPSUWatt" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="recommendedPSUWatt">Recommended PSU (W)</Label>
                  <Input id="recommendedPSUWatt" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="performanceTier" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="performanceTier">Performance Tier</Label>
                  <Input id="performanceTier" {...field} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="lengthMm" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="lengthMm">Length (mm)</Label>
                  <Input id="lengthMm" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
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
