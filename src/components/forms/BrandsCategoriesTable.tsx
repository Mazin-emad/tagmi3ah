import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAllBrands,
  useDeleteBrand,
  useUpdateBrand,
} from "@/hooks/useBrands";
import {
  useAllCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import type { Brand, Category } from "@/api/types";
import { toast } from "sonner";

function InlineEditor({
  initial,
  onSave,
}: {
  initial: string;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-8"
      />
      <Button size="sm" onClick={() => onSave(value)}>
        Save
      </Button>
    </div>
  );
}

export function BrandsTable() {
  const { data: brands } = useAllBrands();
  const update = useUpdateBrand();
  const remove = useDeleteBrand();

  const onUpdate = (row: Brand, name: string) => {
    update.mutate(
      { id: row.id, name },
      {
        onSuccess: () => toast.success("Brand updated"),
        onError: (e: Error) =>
          toast.error(e?.message || "Failed to update brand"),
      }
    );
  };
  const onDelete = (row: Brand) => {
    remove.mutate(row.id, {
      onSuccess: () => toast.success("Brand deleted"),
      onError: (e: Error) =>
        toast.error(e?.message || "Failed to delete brand"),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brands</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[50vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(brands || []).map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.id}</TableCell>
                  <TableCell>
                    <InlineEditor
                      initial={b.name}
                      onSave={(v) => onUpdate(b, v)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(b)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoriesTable() {
  const { data: categories } = useAllCategories();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const onUpdate = (row: Category, name: string) => {
    update.mutate(
      { id: row.id, name },
      {
        onSuccess: () => toast.success("Category updated"),
        onError: (e: Error) =>
          toast.error(e?.message || "Failed to update category"),
      }
    );
  };
  const onDelete = (row: Category) => {
    remove.mutate(row.id, {
      onSuccess: () => toast.success("Category deleted"),
      onError: (e: Error) =>
        toast.error(e?.message || "Failed to delete category"),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[50vh] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(categories || []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>
                    <InlineEditor
                      initial={c.name}
                      onSave={(v) => onUpdate(c, v)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(c)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
