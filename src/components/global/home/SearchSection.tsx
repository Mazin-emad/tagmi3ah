import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useBrandsPaged } from "@/hooks/useBrands";
import { useCategoriesPaged } from "@/hooks/useCategories";
const FormSchema = z.object({
  category: z.string().optional(),
  brand: z.array(z.string()).optional(),
  search: z.string().optional(),
});

const SearchSection = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: "",
      brand: [],
      search: "",
    },
  });

  const { data: categories } = useCategoriesPaged({ page: 0, size: 10 });
  const { data: brands } = useBrandsPaged({ page: 0, size: 10 });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <section>
      <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Products You'll Love
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" {...form.register("category")}>
                    All Products
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>All Products</DropdownMenuItem>
                    {categories?.content.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        {...form.register("category")}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                type="text"
                placeholder="Search"
                {...form.register("search")}
              />
              <Button
                variant="default"
                className="cursor-pointer"
                type="submit"
              >
                Search
              </Button>
            </div>
            <div className="flex justify-center pt-4">
              <FormField
                control={form.control}
                name="brand"
                render={() => (
                  <FormItem className="flex flex-row items-center flex-wrap gap-3">
                    {brands?.content.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="brand"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-center gap-1"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValues,
                                        item.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter(
                                          (value) => value !== item.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                <Badge variant="outline">{item.name}</Badge>
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default SearchSection;

{
  /* <Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
<FormField
  control={form.control}
  name="items"
  render={() => (
    <FormItem>
      <div className="mb-4">
        <FormLabel className="text-base">Sidebar</FormLabel>
        <FormDescription>
          Select the items you want to display in the sidebar.
        </FormDescription>
      </div>
      {items.map((item) => (
        <FormField
          key={item.id}
          control={form.control}
          name="items"
          render={({ field }) => {
            return (
              <FormItem
                key={item.id}
                className="flex flex-row items-center gap-2"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, item.id])
                        : field.onChange(
                            field.value?.filter(
                              (value) => value !== item.id
                            )
                          )
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  {item.label}
                </FormLabel>
              </FormItem>
            )
          }}
        />
      ))}
      <FormMessage />
    </FormItem>
  )}
/>
<Button type="submit">Submit</Button>
</form>
</Form> */
}
