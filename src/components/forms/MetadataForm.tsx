import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useUpdateMetadata, useMetadata } from "@/hooks";
import { useEffect } from "react";
import type { ApiError } from "@/api/types";

const FormSchema = z.object({
  categories: z.string(),
  brands: z.string(),
});

type MetadataFormData = z.infer<typeof FormSchema>;

export default function MetadataForm() {
  const { data: metadata } = useMetadata();
  const { mutate: updateMetadata, isPending } = useUpdateMetadata();

  const form = useForm<MetadataFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      brands: "",
      categories: "",
    },
  });

  // Update form when metadata is loaded
  useEffect(() => {
    if (metadata) {
      form.setValue(
        "categories",
        metadata.categories?.join(", ") || ""
      );
      form.setValue("brands", metadata.brands?.join(", ") || "");
    }
  }, [metadata, form]);

  const onSubmit = (data: MetadataFormData) => {
    // Parse comma-separated strings into arrays
    const categoriesArray = data.categories
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat.length > 0);
    const brandsArray = data.brands
      .split(",")
      .map((brand) => brand.trim())
      .filter((brand) => brand.length > 0);

    updateMetadata(
      {
        categories: categoriesArray.length > 0 ? categoriesArray : undefined,
        brands: brandsArray.length > 0 ? brandsArray : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Metadata updated successfully!");
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          const fieldErrors = apiError?.fieldErrors;
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              if (["categories", "brands"].includes(field)) {
                form.setError(field as keyof MetadataFormData, { message });
              }
            });
          }
          toast.error(apiError?.message || "Failed to update metadata. Please try again.");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Metadata</CardTitle>
        <CardDescription>
          Update the metadata for the products. Click Save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="metadata-categories">
                Categories (comma-separated)
              </Label>
              <Input
                id="metadata-categories"
                type="text"
                placeholder="CPU, GPU, RAM, Storage..."
                {...form.register("categories")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="metadata-brands">
                Brands (comma-separated)
              </Label>
              <Input
                id="metadata-brands"
                type="text"
                placeholder="AMD, Intel, NVIDIA, Corsair..."
                {...form.register("brands")}
              />
            </div>
            <div>
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Saving..." : "Save Metadata"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

