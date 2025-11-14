import { useState } from "react";
import { useGetMyOrders, useCancelOrder } from "@/hooks";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import type { OrderDto } from "@/api/types";

const CheckOut = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-12">
              <LoadingComponent />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorComponent
              message={error.message || "Failed to load orders"}
              callback={() => refetch()}
              callbackText="Retry"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                You don't have any orders yet.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  const canCancelOrder = (order: OrderDto) => {
    return order.orderStatus === "PENDING" && order.paymentStatus !== "PAID";
  };

  const handleCancelOrder = (orderId: number) => {
    cancelOrder(orderId, {
      onSuccess: () => {
        toast.success("Order cancelled successfully");
        setOrderToCancel(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to cancel order");
      },
    });
  };

  const OrderDetailsRow = ({ order }: { order: OrderDto }) => {
    if (expandedOrderId !== order.orderId) return null;

    return (
      <TableRow>
        <TableCell colSpan={8} className="bg-muted/30">
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold">
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-24">Order ID</TableHead>
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
                  {orders.map((order) => {
                    const itemsCount = order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );
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
                          <TableCell className="whitespace-nowrap">
                            {formatDate(order.orderDate)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(order.orderStatus)}
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
                            {canCancelOrder(order) && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setOrderToCancel(order.orderId)}
                                disabled={isCancelling}
                              >
                                Cancel
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                        <OrderDetailsRow order={order} />
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Order Confirmation Dialog */}
      <Dialog
        open={orderToCancel !== null}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel order #{orderToCancel}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setOrderToCancel(null)}
              disabled={isCancelling}
            >
              No, Keep Order
            </Button>
            <Button
              variant="destructive"
              onClick={() => orderToCancel && handleCancelOrder(orderToCancel)}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckOut;
