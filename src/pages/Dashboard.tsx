import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AddNewProduct from "@/components/global/dashboard/AddNewProduct";

const FormSchema = z.object({
  brands: z.array(z.string()),
  categories: z.array(z.string()),
});

const Dashboard = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      brands: [],
      categories: [],
    },
  });
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
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
                        <Label htmlFor="tabs-demo-current">Categories</Label>
                        <Input id="tabs-demo-current" type="text" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-new">Brands</Label>
                        <Input id="tabs-demo-new" type="text" />
                      </div>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Save Metadata</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
