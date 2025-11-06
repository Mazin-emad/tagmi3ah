import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "@/hooks";
import { toast } from "sonner";
import { useState } from "react";
import type { ApiError } from "@/api/types";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  image: z.instanceof(File).optional().or(z.string().optional()),
});

type ProductFormData = z.infer<typeof FormSchema>;

export default function ProductForm() {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "",
      brand: "",
      stock: 0,
      image: undefined,
    },
  });

  const onSubmit = (data: ProductFormData) => {
    createProduct(
      {
        name: data.name,
        price: data.price,
        description: data.description,
        category: data.category,
        brand: data.brand,
        stock: data.stock,
        image: imageFile || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Product created successfully!");
          form.reset();
          setImageFile(null);
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          const fieldErrors = apiError?.fieldErrors;
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              if (
                [
                  "name",
                  "price",
                  "description",
                  "category",
                  "brand",
                  "stock",
                  "image",
                ].includes(field)
              ) {
                form.setError(field as keyof ProductFormData, { message });
              }
            });
          }
          toast.error(apiError?.message || "Failed to create product. Please try again.");
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      form.setValue("image", file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>
          Add a new product to the database. Click Add when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2"
          >
            <div className="grid gap-3">
              <Label htmlFor="product-name">Name</Label>
              <Input id="product-name" {...form.register("name")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-price">Price</Label>
              <Input
                id="product-price"
                type="number"
                {...form.register("price", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-description">Description</Label>
              <Input
                id="product-description"
                {...form.register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-category">Category</Label>
              <Input id="product-category" {...form.register("category")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-brand">Brand</Label>
              <Input id="product-brand" {...form.register("brand")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-stock">Stock</Label>
              <Input
                id="product-stock"
                type="number"
                {...form.register("stock", { valueAsNumber: true })}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="product-image">Image</Label>
              <Input
                id="product-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Creating..." : "Add Product"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

