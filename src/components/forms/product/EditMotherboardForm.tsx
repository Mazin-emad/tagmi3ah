import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { useUpdateMotherboard } from "@/hooks/product/useMotherboards";
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
  socket: z.string().optional(),
  chipset: z.string().optional(),
  formFactor: z.string().optional(),
  ramType: z.string().optional(),
  ramSlots: z.number().min(0).optional(),
  maxMemorySpeedMHz: z.number().min(0).optional(),
  pcieVersion: z.string().optional(),
  m2Slots: z.number().min(0).optional(),
  wifi: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditMotherboardForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const { mutate: updateMotherboard, isPending } = useUpdateMotherboard();
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
      socket: (product as any).socket ?? undefined,
      chipset: (product as any).chipset ?? undefined,
      formFactor: (product as any).formFactor ?? undefined,
      ramType: (product as any).ramType ?? undefined,
      ramSlots: (product as any).ramSlots ?? undefined,
      maxMemorySpeedMHz: (product as any).maxMemorySpeedMHz ?? undefined,
      pcieVersion: (product as any).pcieVersion ?? undefined,
      m2Slots: (product as any).m2Slots ?? undefined,
      wifi: (product as any).wifi ?? undefined,
    },
  });

  const onSubmit = (data: FormData) => {
    const id = Number(product.id);
    updateMotherboard(
      { id, data: {
        name: data.name,
        price: data.price,
        description: data.description,
        stock: data.stock,
        brandId: data.brandId,
        categoryId: data.categoryId,
        socket: data.socket,
        chipset: data.chipset,
        formFactor: data.formFactor,
        ramType: data.ramType,
        ramSlots: data.ramSlots,
        maxMemorySpeedMHz: data.maxMemorySpeedMHz,
        pcieVersion: data.pcieVersion,
        m2Slots: data.m2Slots,
        wifi: data.wifi,
      } },
      {
        onSuccess: () => {
          toast.success("Motherboard updated successfully");
          onClose();
        },
        onError: (e: any) => toast.error(e?.message || "Failed to update motherboard"),
      }
    );
  };

  const brandOptions = brands.map((brand) => ({ value: brand.id.toString(), label: brand.name }));
  const categoryOptions = categories.map((category) => ({ value: category.id.toString(), label: category.name }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Motherboard</CardTitle>
        <CardDescription>Update motherboard product</CardDescription>
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

              <FormField name="socket" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="socket">Socket</Label>
                  <Input id="socket" {...field} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="chipset" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="chipset">Chipset</Label>
                  <Input id="chipset" {...field} />
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

              <FormField name="ramType" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="ramType">RAM Type</Label>
                  <Input id="ramType" {...field} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="ramSlots" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="ramSlots">RAM Slots</Label>
                  <Input id="ramSlots" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="maxMemorySpeedMHz" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="maxMemorySpeedMHz">Max Memory Speed (MHz)</Label>
                  <Input id="maxMemorySpeedMHz" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="pcieVersion" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="pcieVersion">PCIe Version</Label>
                  <Input id="pcieVersion" {...field} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="m2Slots" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="m2Slots">M.2 Slots</Label>
                  <Input id="m2Slots" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="wifi" control={form.control} render={({ field }) => (
                <FormItem>
                  <Label htmlFor="wifi">Wi-Fi</Label>
                  <Input id="wifi" type="checkbox" checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} />
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
