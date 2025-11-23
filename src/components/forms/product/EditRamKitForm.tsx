import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useUpdateRamKit } from "@/hooks/product/useRamKits";
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
  capacityGB: z.number().min(0).optional(),
  modules: z.number().min(0).optional(),
  speedMHz: z.number().min(0).optional(),
  type: z.string().optional(),
  casLatency: z.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditRamKitForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { mutate: updateRamKit, isPending } = useUpdateRamKit();
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
      capacityGB: (product as any).capacityGB ?? undefined,
      modules: (product as any).modules ?? undefined,
      speedMHz: (product as any).speedMHz ?? undefined,
      type: (product as any).type ?? undefined,
      casLatency: (product as any).casLatency ?? undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    const id = Number(product.id);
    updateRamKit(
      { id, data: {
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
      } },
      {
        onSuccess: () => {
          toast.success("RAM Kit updated successfully");
          onClose();
        },
        onError: (e: any) => toast.error(e?.message || "Failed to update RAM Kit"),
      }
    );
  };

  const brandOptions = brands.map((b) => ({ value: b.id.toString(), label: b.name }));
  const categoryOptions = categories.map((c) => ({ value: c.id.toString(), label: c.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit RAM Kit</CardTitle>
        <CardDescription>Update RAM Kit product</CardDescription>
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

              <FormField name="capacityGB" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="capacityGB">Capacity (GB)</Label>
                  <Input id="capacityGB" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="modules" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="modules">Modules</Label>
                  <Input id="modules" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="speedMHz" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="speedMHz">Speed (MHz)</Label>
                  <Input id="speedMHz" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="type" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="type">Type</Label>
                  <Input id="type" placeholder="e.g., DDR4, DDR5" {...field} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="casLatency" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="casLatency">CAS Latency</Label>
                  <Input id="casLatency" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
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
