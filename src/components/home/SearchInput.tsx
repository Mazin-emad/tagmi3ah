import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";

interface SearchInputProps {
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchInput({ onSearchChange, onSubmit }: SearchInputProps) {
  const form = useFormContext();

  return (
    <div className="flex-1 min-w-[200px]">
      <Input
        type="text"
        placeholder="Search products..."
        {...form.register("search")}
        onChange={(e) => {
          form.setValue("search", e.target.value);
          onSearchChange(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
    </div>
  );
}

