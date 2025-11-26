import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/api/types";

interface CategoryDropdownProps {
  selectedCategory: string;
  categories?: Category[];
  onSelect: (categoryName: string) => void;
}

export function CategoryDropdown({
  selectedCategory,
  categories,
  onSelect,
}: CategoryDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" type="button">
          {selectedCategory || "All Products"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onSelect("All Products")}>
            All Products
          </DropdownMenuItem>
          {categories?.content.map((category) => (
            <DropdownMenuItem
              key={category.id}
              onClick={() => onSelect(category.name)}
            >
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

