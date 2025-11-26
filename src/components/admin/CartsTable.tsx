import { useMemo, useState } from "react";
import { useGetAllCarts } from "@/hooks/useCart";
import { useAllUsers } from "@/hooks/useUsers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Cart, CartItem } from "@/types/cart";
import type { MeResponse } from "@/api/types";

export default function CartsTable() {
  const { data: carts = [], isLoading } = useGetAllCarts();
  const { data: users = [], isLoading: usersLoading } = useAllUsers();
  const [openCartId, setOpenCartId] = useState<number | null>(null);

  const userById = useMemo(() => {
    const map = new Map<string | number, MeResponse>();
    users?.forEach((u: MeResponse) => map.set(u.id, u));
    return map;
  }, [users]);

  const getTotal = (cart: Cart): number => {
    if (typeof cart?.totalCost === "number") return cart.totalCost;
    if (Array.isArray(cart?.items)) {
      return cart.items.reduce((sum: number, it: CartItem) => {
        const price = it.product.price ?? it.product?.price ?? 0;
        const qty = it.quantity ?? 1;
        return sum + price * qty;
      }, 0);
    }
    return 0;
  };

  if (isLoading || usersLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carts</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Carts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart: Cart) => {
                const user = userById.get(cart.userId);
                const total = getTotal(cart);
                const itemsCount = Array.isArray(cart.items)
                  ? cart.items.reduce(
                      (sum: number, it: CartItem) => sum + (it.quantity ?? 1),
                      0
                    )
                  : 0;
                return (
                  <TableRow
                    key={cart.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setOpenCartId(cart.id)}
                  >
                    <TableCell className="whitespace-nowrap">
                      {user?.name || user?.email || `User #${cart.userId}`}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user?.phoneNumber || "-"}
                    </TableCell>
                    <TableCell className="max-w-[280px] truncate">
                      {user?.address || "-"}
                    </TableCell>
                    <TableCell className="text-center">{itemsCount}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(total)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {carts.map((cart: Cart) => {
        const open = openCartId === cart.id;
        const user = userById.get(cart.userId);
        return (
          <Dialog
            open={open}
            onOpenChange={(v) => !v && setOpenCartId(null)}
            key={`dlg-${cart.id}`}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>
                  Cart #{cart.id} —{" "}
                  {user?.name || user?.email || `User #${cart.userId}`}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <p>
                    <span className="font-medium">User:</span>{" "}
                    {user?.name || user?.email || "-"}
                  </p>
                  <p>
                    <span className="font-medium">User ID:</span> {cart.userId}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {user?.phoneNumber || "-"}
                  </p>
                  <p className="sm:col-span-2">
                    <span className="font-medium">Address:</span>{" "}
                    {user?.address || "-"}
                  </p>
                </div>

                <div className="rounded-md border p-3 flex items-center justify-between bg-muted/30 text-sm">
                  <span className="font-medium">Items</span>
                  <span>
                    {Array.isArray(cart.items)
                      ? cart.items.reduce(
                          (sum: number, it: CartItem) =>
                            sum + (it.quantity ?? 1),
                          0
                        )
                      : 0}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(cart.items || []).map((it: CartItem) => {
                        const name = it.product.name || `#${it.product.id}`;
                        const price =
                          it.product.price ?? it.product?.price ?? 0;
                        const qty = it.quantity ?? 1;
                        const subtotal = price * qty;
                        return (
                          <TableRow key={it.id}>
                            <TableCell className="max-w-[260px] truncate">
                              <div className="flex items-center gap-3">
                                {it.product?.imageUrl && (
                                  <img
                                    src={it.product.imageUrl}
                                    alt={name}
                                    className="h-10 w-10 rounded object-cover border"
                                  />
                                )}
                                <div className="truncate">{name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(price)}</TableCell>
                            <TableCell>{qty}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(subtotal)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-end gap-8 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(getTotal(cart))}</span>
                    </div>
                    <div className="flex items-center justify-between gap-8">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>—</span>
                    </div>
                    <div className="flex items-center justify-between gap-8 font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(getTotal(cart))}</span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })}
    </Card>
  );
}
