import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import type { Product } from "@/api/types";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ProductsTableProps {
  onEdit?: (product: Product) => void;
}

export default function ProductsTable({ onEdit }: ProductsTableProps) {
  const { data: products, isLoading } = useProducts();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();

  const rows = useMemo(() => products?.content ?? [], [products]);
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No products found.
              </TableCell>
            </TableRow>
          )}
          {rows.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="h-12 w-12 object-cover rounded"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                  }}
                />
              </TableCell>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.brandName || p.brand}</TableCell>
              <TableCell>{p.categoryName || p.category}</TableCell>
              <TableCell>${p.price.toFixed(2)}</TableCell>
              <TableCell>{p.stock}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onEdit?.(p)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={() => {
                    const confirmed = window.confirm(`Are you sure you want to delete "${p.name}"?`);
                    if (!confirmed) return;
                    deleteProduct(Number(p.id), {
                      onSuccess: () => toast.success("Product deleted successfully"),
                      onError: (err: unknown) => {
                        const e = err as any;
                        const msg = e?.message || e?.response?.data?.message || "Failed to delete product";
                        toast.error(msg);
                      },
                    });
                  }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
