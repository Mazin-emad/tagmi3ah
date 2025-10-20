import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";

const FormSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  brand: z.string().min(1),
  stock: z.number().min(1),
  image: z.string().optional() || z.instanceof(File).optional(),
});

const AddNewProduct = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
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
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
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
            className="grid gap-6 grid-cols-2"
          >
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-name">Name</Label>
              <Input id="tabs-demo-name" {...form.register("name")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Price</Label>
              <Input id="tabs-demo-username" {...form.register("price")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Description</Label>
              <Input
                id="tabs-demo-username"
                {...form.register("description")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Category</Label>
              <Input id="tabs-demo-username" {...form.register("category")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Brand</Label>
              <Input id="tabs-demo-username" {...form.register("brand")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Stock</Label>
              <Input id="tabs-demo-username" {...form.register("stock")} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tabs-demo-username">Image</Label>
              <Input
                id="tabs-demo-username"
                type="file"
                accept="image/*"
                {...form.register("image")}
              />
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit">Add Product</Button>
      </CardFooter>
    </Card>
  );
};

export default AddNewProduct;
