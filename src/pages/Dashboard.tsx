import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import AddNewProduct from "@/components/global/dashboard/AddNewProduct";
import { useUpdateMetadata, useMetadata } from "@/hooks";
import { useEffect } from "react";

const FormSchema = z.object({
  categories: z.string(),
  brands: z.string(),
});

const Dashboard = () => {
  const { data: metadata } = useMetadata();
  const { mutate: updateMetadata, isPending } = useUpdateMetadata();

  const form = useForm<z.infer<typeof FormSchema>>({
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
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
        onError: (error) => {
          toast.error(
            error?.message || "Failed to update metadata. Please try again."
          );
        },
      }
    );
  };
  return (
    <main>
      <section className="grid max-w-screen-xl py-4 px-4 mx-auto gap-4 lg:gap-8 xl:gap-2 lg:py-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Admin Dashboard
        </h1>
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="product">
            <TabsList>
              <TabsTrigger value="product">Add New Product</TabsTrigger>
              <TabsTrigger value="metadata">Update Metadata</TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <AddNewProduct />
            </TabsContent>
            <TabsContent value="metadata">
              <Card>
                <CardHeader>
                  <CardTitle>Update Metadata</CardTitle>
                  <CardDescription>
                    Update the metadata for the products. Click Save when logged
                    out.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="grid gap-6"
                    >
                      <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-categories">
                          Categories (comma-separated)
                        </Label>
                        <Input
                          id="tabs-demo-categories"
                          type="text"
                          placeholder="CPU, GPU, RAM, Storage..."
                          {...form.register("categories")}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-brands">
                          Brands (comma-separated)
                        </Label>
                        <Input
                          id="tabs-demo-brands"
                          type="text"
                          placeholder="AMD, Intel, NVIDIA, Corsair..."
                          {...form.register("brands")}
                        />
                      </div>
                      <div>
                        <Button type="submit" disabled={isPending}>
                          {isPending ? "Saving..." : "Save Metadata"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
