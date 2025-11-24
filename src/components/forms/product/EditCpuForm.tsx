import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.number().min(0).optional(),
  categoryId: z.number().min(0).optional(),
  cores: z.number().min(0).optional(),
  threads: z.number().min(0).optional(),
  baseClockGHz: z.number().min(0).optional(),
  boostClockGHz: z.number().min(0).optional(),
  socket: z.string().optional(),
  tdpW: z.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditCpuForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { mutate: updateCpu, isPending } = useUpdateCpu();
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
      cores: (product as any).cores ?? undefined,
      threads: (product as any).threads ?? undefined,
      baseClockGHz: (product as any).baseClockGHz ?? undefined,
      boostClockGHz: (product as any).boostClockGHz ?? undefined,
      socket: (product as any).socket ?? undefined,
      tdpW: (product as any).tdpW ?? undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    const id = Number(product.id);
    updateCpu(
      { id, data: {
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
      } },
      {
        onSuccess: () => {
          toast.success("CPU updated successfully");
          onClose();
        },
        onError: (e: any) => toast.error(e?.message || "Failed to update CPU"),
      }
    );
  };

  const brandOptions = brands.map((b) => ({ value: b.id.toString(), label: b.name }));
  const categoryOptions = categories.map((c) => ({ value: c.id.toString(), label: c.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit CPU</CardTitle>
        <CardDescription>Update CPU product</CardDescription>
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

              <FormField name="cores" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="cores">Cores</Label>
                  <Input id="cores" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="threads" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="threads">Threads</Label>
                  <Input id="threads" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="baseClockGHz" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="baseClockGHz">Base Clock (GHz)</Label>
                  <Input id="baseClockGHz" type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="boostClockGHz" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="boostClockGHz">Boost Clock (GHz)</Label>
                  <Input id="boostClockGHz" type="number" step="0.01" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="socket" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="socket">Socket</Label>
                  <Input id="socket" {...field} />
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
