import { useState } from "react";
import { useGetAllOrders, useUpdateOrder, useGetOrdersByUserId } from "@/hooks";
import { useAllUsers } from "@/hooks/useUsers";
import { LoadingComponent } from "@/components/global/LoadingComponents";
import { ErrorComponent } from "@/components/global/ErrorComponents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type {
  OrderDto,
  OrderStatus,
  OrderStatusRequest,
  PaymentStatus,
} from "@/api/types";

export default function OrdersTable() {
  const { data: orders = [], isLoading, error, refetch } = useGetAllOrders();
  const { data: users = [] } = useAllUsers();
  const { mutate: updateOrder, isPending: isUpdating } = useUpdateOrder();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderToUpdate, setOrderToUpdate] = useState<OrderDto | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: userOrders = [] } = useGetOrdersByUserId(selectedUserId ?? 0);

  // Create user lookup map
  const userById = new Map(users.map((user) => [Number(user.id), user]));

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "secondary";
      case "CONFIRMED":
        return "default";
      case "DELIVERED":
        return "default";
      case "CANCELED":
      case "CANCELLED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status.toUpperCase()) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "FAILED":
        return "destructive";
      case "CANCELED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const handleUpdateOrder = (orderStatus: string, paymentStatus: string) => {
    if (!orderToUpdate) return;

    const updateData: OrderStatusRequest = {
      orderStatus: orderStatus as
        | "PENDING"
        | "CANCELED"
        | "CONFIRMED"
        | "DELIVERED",
      paymentStatus: paymentStatus as
        | "PAID"
        | "CANCELED"
        | "FAILED"
        | "PENDING",
    };

    updateOrder(
      { id: orderToUpdate.orderId, body: updateData },
      {
        onSuccess: () => {
          toast.success("Order updated successfully");
          setOrderToUpdate(null);
          refetch();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update order");
        },
      }
    );
  };

  const OrderDetailsRow = ({ order }: { order: OrderDto }) => {
    if (expandedOrderId !== order.orderId) return null;

    const user = userById.get(order.userId);

    return (
      <TableRow>
        <TableCell colSpan={9} className="bg-muted/30">
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Customer Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">User ID:</span> {order.userId}
                  </p>
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {user?.name || user?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {user?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {user?.phoneNumber || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Information</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Order ID:</span> #
                    {order.orderId}
                  </p>
                  <p>
                    <span className="font-medium">Order Date:</span>{" "}
                    {formatDate(order.orderDate)}
                  </p>
                  <p>
                    <span className="font-medium">Delivery Date:</span>{" "}
                    {formatDate(order.deliveryDate)}
                  </p>
                  <p>
                    <span className="font-medium">Payment Method:</span>{" "}
                    <span className="capitalize">
                      {order.paymentMethod.toLowerCase()}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Order Items</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm border-b pb-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-xs">
                            {item.product.name}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-xs">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(order.totalCost)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-12">
            <LoadingComponent />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <ErrorComponent
            message={error.message || "Failed to load orders"}
            callback={() => refetch()}
            callbackText="Retry"
          />
        </CardContent>
      </Card>
    );
  }

  const displayOrders = selectedUserId ? userOrders : orders;

  return (
    <div className="space-y-4">
      {/* Filter by User */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filter by User:</label>
            <Select
              value={selectedUserId?.toString() || ""}
              onChange={(e) =>
                setSelectedUserId(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              options={[
                { value: "", label: "All Users" },
                ...users.map((user) => ({
                  value: user.id,
                  label: user.name || user.email || `User #${user.id}`,
                })),
              ]}
            />
            {selectedUserId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedUserId(null)}
              >
                Clear Filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedUserId
              ? `Orders for User #${selectedUserId}`
              : "All Orders"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-24">Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="min-w-[180px]">Order Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-8">
                        <p className="text-muted-foreground">No orders found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayOrders.map((order) => {
                      const itemsCount = order.orderItems.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      );
                      const user = userById.get(order.userId);
                      const isExpanded = expandedOrderId === order.orderId;
                      return (
                        <>
                          <TableRow
                            key={order.orderId}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() =>
                              setExpandedOrderId(
                                isExpanded ? null : order.orderId
                              )
                            }
                          >
                            <TableCell>
                              {isExpanded ? (
                                <ChevronUpIcon className="h-4 w-4" />
                              ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              #{order.orderId}
                            </TableCell>
                            <TableCell>
                              {user?.name ||
                                user?.email ||
                                `User #${order.userId}`}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              {formatDate(order.orderDate)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(
                                  order.orderStatus
                                )}
                              >
                                {order.orderStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={getPaymentStatusBadgeVariant(
                                  order.paymentStatus
                                )}
                              >
                                {order.paymentStatus}
                              </Badge>
                            </TableCell>
                            <TableCell className="capitalize">
                              {order.paymentMethod.toLowerCase()}
                            </TableCell>
                            <TableCell className="text-center">
                              {itemsCount}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(order.totalCost)}
                            </TableCell>
                            <TableCell
                              className="text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setOrderToUpdate(order)}
                                disabled={isUpdating}
                              >
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                          <OrderDetailsRow order={order} />
                        </>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Order Dialog */}
      <Dialog
        open={orderToUpdate !== null}
        onOpenChange={(open) => !open && setOrderToUpdate(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order #{orderToUpdate?.orderId}</DialogTitle>
            <DialogDescription>
              Update the order status and payment status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Order Status
              </label>
              <Select
                value={orderToUpdate?.orderStatus || ""}
                onChange={(e) =>
                  setOrderToUpdate({
                    ...orderToUpdate!,
                    orderStatus: e.target.value as OrderStatus,
                  })
                }
                options={[
                  { value: "PENDING", label: "Pending" },
                  { value: "CONFIRMED", label: "Confirmed" },
                  { value: "DELIVERED", label: "Delivered" },
                  { value: "CANCELED", label: "Canceled" },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Status
              </label>
              <Select
                value={orderToUpdate?.paymentStatus || ""}
                onChange={(e) =>
                  setOrderToUpdate({
                    ...orderToUpdate!,
                    paymentStatus: e.target.value as PaymentStatus,
                  })
                }
                options={[
                  { value: "PENDING", label: "Pending" },
                  { value: "PAID", label: "Paid" },
                  { value: "FAILED", label: "Failed" },
                  { value: "CANCELED", label: "Canceled" },
                ]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOrderToUpdate(null)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                orderToUpdate &&
                handleUpdateOrder(
                  orderToUpdate.orderStatus,
                  orderToUpdate.paymentStatus
                )
              }
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
