import { useState, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateBrand, useUpdateBrand } from "@/hooks/useBrands";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";

const FormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  type: z.enum(["brand", "category"]),
  id: z.number().optional(),
});

type FormData = z.infer<typeof FormSchema>;

export default function BrandsCategoriesForm() {
  const [mode, setMode] = useState<"create" | "update">("create");
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", type: "brand" },
  });

  const isUpdating = useMemo(() => mode === "update", [mode]);

  const onSubmit = (data: FormData) => {
    if (data.type === "brand") {
      if (isUpdating && data.id != null) {
        updateBrand.mutate(
          { id: data.id, name: data.name },
          {
            onSuccess: () => {
              toast.success("Brand updated");
              form.reset({ name: "", type: data.type });
              setMode("create");
            },
            onError: (error: Error) => {
              toast.error(error?.message || "Failed to update brand");
            },
          }
        );
      } else {
        createBrand.mutate(
          { name: data.name },
          {
            onSuccess: () => {
              toast.success("Brand created");
              form.reset({ name: "", type: data.type });
            },
            onError: (error: Error) => {
              toast.error(error?.message || "Failed to create brand");
            },
          }
        );
      }
    } else {
      if (isUpdating && data.id != null) {
        updateCategory.mutate(
          { id: data.id, name: data.name },
          {
            onSuccess: () => {
              toast.success("Category updated");
              form.reset({ name: "", type: data.type });
              setMode("create");
            },
            onError: (error: Error) => {
              toast.error(error?.message || "Failed to update category");
            },
          }
        );
      } else {
        createCategory.mutate(
          { name: data.name },
          {
            onSuccess: () => {
              toast.success("Category created");
              form.reset({ name: "", type: data.type });
            },
            onError: (error: Error) => {
              toast.error(error?.message || "Failed to create category");
            },
          }
        );
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brands & Categories</CardTitle>
        <CardDescription>Add or update a brand or category</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              className="border rounded-md px-3 py-2 text-sm"
              {...form.register("type")}
              onChange={(e) => {
                form.register("type").onChange(e);
                // Reset mode when switching type
                setMode("create");
                form.setValue("id", undefined);
                form.setValue("name", "");
              }}
            >
              <option value="brand">Brand</option>
              <option value="category">Category</option>
            </select>
          </div>
          {isUpdating && (
            <div className="grid gap-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                type="number"
                placeholder="e.g. 1"
                {...form.register("id", { valueAsNumber: true })}
              />
            </div>
          )}
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="sm:col-span-2 flex items-center gap-2">
            <Button type="submit" className="w-full sm:w-auto">
              {isUpdating ? "Update" : "Create"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setMode(mode === "create" ? "update" : "create");
              }}
            >
              Switch to {mode === "create" ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
