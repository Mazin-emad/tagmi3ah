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
import { useCreateProduct } from "@/hooks/useProducts";
import { useAllBrands } from "@/hooks/useBrands";
import { toast } from "sonner";
import { useState } from "react";
import type { ApiError } from "@/api/types";

const genericProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  brandId: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  image: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      "Image is required"
    ),
});

type GenericProductFormData = z.infer<typeof genericProductSchema>;

interface GenericProductFormProps {
  categoryName: string;
}

export default function GenericProductForm({
  categoryName,
}: GenericProductFormProps) {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { data: brands = [], isLoading: brandsLoading } = useAllBrands();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<GenericProductFormData>({
    resolver: zodResolver(genericProductSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      stock: 0,
      brandId: "",
      category: categoryName,
    },
  });

  const onSubmit = (data: GenericProductFormData) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }

    createProduct(
      {
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        brand: data.brandId,
        stock: data.stock,
        image: imageFile,
      },
      {
        onSuccess: () => {
          toast.success(`${categoryName} created successfully!`);
          form.reset({
            name: "",
            price: 0,
            description: "",
            stock: 0,
            brandId: "",
            category: categoryName,
          });
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          if (apiError?.fieldErrors) {
            Object.entries(apiError.fieldErrors).forEach(([field, message]) => {
              form.setError(field as keyof GenericProductFormData, {
                message,
              });
            });
          }
          toast.error(apiError?.message || `Failed to create ${categoryName}`);
        },
      }
    );
  };

  const brandOptions = brands.map((brand) => ({
    value: brand.name,
    label: brand.name,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New {categoryName}</CardTitle>
        <CardDescription>
          Create a new {categoryName.toLowerCase()} product
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="Enter product description"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="brand">Brand *</Label>
                    <Select
                      id="brand"
                      value={field.value}
                      options={brandOptions}
                      onChange={(value) => field.onChange(value)}
                      disabled={brandsLoading}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="stock">Stock *</Label>
                    <Input
                      id="stock"
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <Label htmlFor="image">Product Image *</Label>
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
                  {imageFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {imageFile.name}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : `Create ${categoryName}`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
