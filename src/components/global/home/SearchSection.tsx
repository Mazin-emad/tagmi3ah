import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
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
import { XMarkIcon } from "@heroicons/react/24/outline";

const FormSchema = z.object({
  category: z.string().optional(),
  brand: z.array(z.string()).optional(),
  search: z.string().optional(),
});

const SearchSection = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize form from URL params
  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand");
  // Brand names are stored in URL (not IDs) for easier filtering
  const brandsArray = brandParam ? brandParam.split(",").filter(Boolean) : [];
  const searchParam = searchParams.get("search") || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: categoryParam,
      brand: brandsArray,
      search: searchParam,
    },
  });

  const { data: categories } = useCategoriesPaged({ page: 0, size: 100 });
  const { data: brands } = useBrandsPaged({ page: 0, size: 100 });

  // Update form when URL params change
  useEffect(() => {
    form.setValue("category", categoryParam);
    form.setValue("brand", brandsArray);
    form.setValue("search", searchParam);
  }, [categoryParam, brandParam, searchParam, form]);

  const updateURLParams = (data: z.infer<typeof FormSchema>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Update category
    if (data.category && data.category !== "") {
      newSearchParams.set("category", data.category);
    } else {
      newSearchParams.delete("category");
    }

    // Update brands
    if (data.brand && data.brand.length > 0) {
      newSearchParams.set("brand", data.brand.join(","));
    } else {
      newSearchParams.delete("brand");
    }

    // Update search
    if (data.search && data.search.trim() !== "") {
      newSearchParams.set("search", data.search.trim());
    } else {
      newSearchParams.delete("search");
    }

    // Reset to page 1 when filters change
    newSearchParams.delete("page");
    
    setSearchParams(newSearchParams, { replace: true });
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    updateURLParams(data);
  };

  const handleCategorySelect = (categoryName: string) => {
    const newCategory = categoryName === "All Products" ? "" : categoryName;
    form.setValue("category", newCategory);
    updateURLParams({ ...form.getValues(), category: newCategory });
  };

  // Use ref to store timeout ID for debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    form.setValue("search", value);
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Debounce search - update URL after user stops typing
    searchTimeoutRef.current = setTimeout(() => {
      updateURLParams({ ...form.getValues(), search: value });
    }, 500);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleClearFilters = () => {
    form.reset({
      category: "",
      brand: [],
      search: "",
    });
    const newSearchParams = new URLSearchParams();
    // Keep only page param if exists
    const page = searchParams.get("page");
    if (page) {
      newSearchParams.set("page", page);
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  const selectedCategory = form.watch("category");
  const selectedBrands = form.watch("brand") || [];
  const searchValue = form.watch("search") || "";

  const hasActiveFilters = selectedCategory || selectedBrands.length > 0 || searchValue;

  return (
    <section>
      <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Products You'll Love
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full gap-4 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" type="button">
                    {selectedCategory || "All Products"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => handleCategorySelect("All Products")}
                    >
                      All Products
                    </DropdownMenuItem>
                    {categories?.content.map((category) => (
                      <DropdownMenuItem
                        key={category.id}
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        {category.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex-1 min-w-[200px]">
                <Input
                  type="text"
                  placeholder="Search products..."
                  {...form.register("search")}
                  onChange={(e) => {
                    form.setValue("search", e.target.value);
                    handleSearchChange(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                />
              </div>
              <Button
                variant="default"
                className="cursor-pointer"
                type="submit"
              >
                Search
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleClearFilters}
                  className="cursor-pointer"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
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
                                  checked={field.value?.includes(item.name)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValues,
                                        item.name,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValues.filter(
                                          (value) => value !== item.name
                                        )
                                      );
                                    }
                                    // Update URL immediately when brand is toggled
                                    updateURLParams({
                                      ...form.getValues(),
                                      brand: checked
                                        ? [...currentValues, item.name]
                                        : currentValues.filter(
                                            (value) => value !== item.name
                                          ),
                                    });
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
