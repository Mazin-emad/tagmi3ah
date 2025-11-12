import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/Context/cartContextBase";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import { usePrepareOrder } from "@/hooks";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingComponent } from "@/components/global/LoadingComponents";

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    removeItem,
    updateItemQuantity,
    getTotalPrice,
    updatingProductId,
    clearCart,
  } = useCart();
  const [isClearing, setIsClearing] = useState(false);
  const { mutate: prepareOrder, isPending: isPreparingOrder } =
    usePrepareOrder();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Call prepareOrder with CARD payment method (default)
    // The server will return a Stripe URL for card payments
    prepareOrder(
      { paymentMethod: "CARD" },
      {
        onSuccess: (response) => {
          if (response.url) {
            // Redirect to Stripe checkout page
            window.location.href = response.url;
          } else {
            // If no URL, navigate to checkout page
            navigate("/checkout");
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to prepare order");
        },
      }
    );
  };

  const handleClearAll = () => {
    if (items.length === 0) return;

    toast("Are you sure you want to clear all items from your cart?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            setIsClearing(true);
            clearCart();
            toast.success("Cart cleared");
          } catch {
            toast.error("Failed to clear cart");
          } finally {
            setIsClearing(false);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      position: "top-center",
      style: {
        zIndex: 9999,
      },
    });
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBagIcon className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild size="lg">
            <Link to="/">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Clear All Button - Desktop */}
            <div className="hidden sm:flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                disabled={isClearing}
              >
                {isClearing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Clear All
                  </>
                )}
              </Button>
            </div>

            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/products/${item.id}`}
                        className="flex-shrink-0 w-full sm:w-32 h-32 sm:h-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Link
                            to={`/products/${item.id}`}
                            className="block group"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {item.brandName}
                          </p>
                          <p className="mt-2 text-lg font-semibold text-gray-900 sm:hidden">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                        </div>

                        {/* Quantity Controls and Price - Desktop */}
                        <div className="flex items-start justify-between sm:justify-end gap-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 ||
                                updatingProductId === item.id
                              }
                            >
                              {updatingProductId === item.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600" />
                              ) : (
                                <MinusIcon className="h-4 w-4" />
                              )}
                            </Button>
                            <span className="min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() =>
                                updateItemQuantity(item.id, item.quantity + 1)
                              }
                              disabled={updatingProductId === item.id}
                            >
                              {updatingProductId === item.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600" />
                              ) : (
                                <PlusIcon className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          {/* Price - Desktop */}
                          <div className="hidden sm:block text-right">
                            <p className="text-lg font-semibold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.price)} each
                              </p>
                            )}
                          </div>

                          {/* Remove Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                            title="Remove item"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Clear All Button - Mobile */}
            <div className="sm:hidden pt-4">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClearAll}
                disabled={isClearing}
                className="w-full"
              >
                {isClearing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Clearing...
                  </>
                ) : (
                  <>
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Clear All Items
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(getTotalPrice())}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-base">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>

                  {/* Divider */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatCurrency(getTotalPrice())}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={isPreparingOrder}
                    className="w-full mt-6"
                    size="lg"
                  >
                    {isPreparingOrder ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      "Proceed to Checkout"
                    )}
                  </Button>

                  {/* Continue Shopping Link */}
                  <Link
                    to="/"
                    className="block text-center text-sm text-primary hover:text-primary/80 mt-4"
                  >
                    ← Continue Shopping
                  </Link>
                </div>

                <p className="mt-4 text-xs text-muted-foreground text-center">
                  Shipping and taxes calculated at checkout.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

