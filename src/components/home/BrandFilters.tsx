import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import type { Brand } from "@/api/types";

interface BrandFiltersProps {
  brands?: Brand[];
  onBrandToggle: (brandName: string, checked: boolean) => void;
}

export function BrandFilters({ brands, onBrandToggle }: BrandFiltersProps) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="brand"
      render={() => (
        <FormItem className="flex flex-row items-center flex-wrap gap-3">
          {brands?.map((item) => (
            <FormField
              key={item.id}
              control={form.control}
              name="brand"
              render={({ field }) => {
                const isChecked = field.value?.includes(item.name) ?? false;
                return (
                  <FormItem className="flex flex-row items-center gap-1">
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, item.name]);
                          } else {
                            field.onChange(
                              currentValues.filter(
                                (value: string) => value !== item.name
                              )
                            );
                          }
                          onBrandToggle(item.name, checked === true);
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
  );
}
