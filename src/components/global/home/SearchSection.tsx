import { useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useBrandsPaged } from "@/hooks/useBrands";
import { useCategoriesPaged } from "@/hooks/useCategories";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CategoryDropdown } from "@/components/home/CategoryDropdown";
import { BrandFilters } from "@/components/home/BrandFilters";
import { SearchInput } from "@/components/home/SearchInput";

const FormSchema = z.object({
  category: z.string().optional(),
  brand: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export default function SearchSection() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand");
  const brandsArray = useMemo(
    () => (brandParam ? brandParam.split(",").filter(Boolean) : []),
    [brandParam]
  );
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

  useEffect(() => {
    const currentCategory = form.getValues("category");
    const currentBrand = form.getValues("brand") || [];
    const currentSearch = form.getValues("search") || "";

    if (currentCategory !== categoryParam) {
      form.setValue("category", categoryParam, { shouldDirty: false });
    }
    if (
      JSON.stringify(currentBrand.sort()) !== JSON.stringify(brandsArray.sort())
    ) {
      form.setValue("brand", brandsArray, { shouldDirty: false });
    }
    if (currentSearch !== searchParam) {
      form.setValue("search", searchParam, { shouldDirty: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam, brandParam, searchParam, brandsArray]);

  const updateURLParams = (data: z.infer<typeof FormSchema>) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (data.category && data.category !== "") {
      newSearchParams.set("category", data.category);
    } else {
      newSearchParams.delete("category");
    }

    if (data.brand && data.brand.length > 0) {
      newSearchParams.set("brand", data.brand.join(","));
    } else {
      newSearchParams.delete("brand");
    }

    if (data.search && data.search.trim() !== "") {
      newSearchParams.set("search", data.search.trim());
    } else {
      newSearchParams.delete("search");
    }

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

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (value: string) => {
    form.setValue("search", value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      updateURLParams({ ...form.getValues(), search: value });
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleBrandToggle = (brandName: string, checked: boolean) => {
    const currentValues = form.getValues("brand") || [];
    const newBrands = checked
      ? [...currentValues, brandName]
      : currentValues.filter((value) => value !== brandName);
    updateURLParams({ ...form.getValues(), brand: newBrands });
  };

  const handleClearFilters = () => {
    form.reset({
      category: "",
      brand: [],
      search: "",
    });
    const newSearchParams = new URLSearchParams();
    const page = searchParams.get("page");
    if (page) {
      newSearchParams.set("page", page);
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  const selectedCategory = form.watch("category");
  const selectedBrands = form.watch("brand") || [];
  const searchValue = form.watch("search") || "";

  const hasActiveFilters =
    selectedCategory || selectedBrands.length > 0 || searchValue;

  return (
    <section>
      <div className="grid max-w-7xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Products You'll Love
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex w-full gap-4 flex-wrap">
              <CategoryDropdown
                selectedCategory={selectedCategory || ""}
                categories={categories?.content || []}
                onSelect={handleCategorySelect}
              />
              <SearchInput
                onSearchChange={handleSearchChange}
                onSubmit={() => onSubmit(form.getValues())}
              />
              <Button variant="default" type="submit">
                Search
              </Button>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleClearFilters}
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
            <div className="flex justify-center pt-4">
              <BrandFilters
                brands={brands?.content || []}
                onBrandToggle={handleBrandToggle}
              />
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
