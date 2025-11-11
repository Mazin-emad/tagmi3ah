import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "@/Context/cartContextBase";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface SideCartProps {
  open: boolean;
  onClose: () => void;
}

export default function SideCart({ open, onClose }: SideCartProps) {
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

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
    navigate("/");
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

  return (
    <div>
      <Dialog open={open} onClose={onClose} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between">
                      <DialogTitle className="text-lg font-medium text-gray-900">
                        Shopping cart
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center gap-2">
                        {items.length > 0 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleClearAll}
                            disabled={isClearing}
                            className="text-xs mr-2"
                          >
                            {isClearing ? (
                              <>
                                <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Clearing...
                              </>
                            ) : (
                              <>
                                <TrashIcon className="mr-1 h-3 w-3" />
                                Clear All
                              </>
                            )}
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={onClose}
                          className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-8">
                      {items.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">
                          Your cart is empty
                        </p>
                      ) : (
                        <div className="flow-root">
                          <ul
                            role="list"
                            className="-my-6 divide-y divide-gray-200"
                          >
                            {items.map((item) => (
                              <li key={item.id} className="flex py-6">
                                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    alt={item.name}
                                    src={item.image}
                                    className="size-full object-cover"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <Link
                                          to={`/products/${item.id}`}
                                          onClick={onClose}
                                        >
                                          {item.name}
                                        </Link>
                                      </h3>
                                      <p className="ml-4">
                                        {formatCurrency(
                                          item.price * item.quantity
                                        )}
                                      </p>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-500">
                                      {item.brandName}
                                    </p>
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          updateItemQuantity(
                                            item.id,
                                            item.quantity - 1
                                          )
                                        }
                                        disabled={
                                          item.quantity <= 1 ||
                                          updatingProductId === item.id
                                        }
                                      >
                                        {updatingProductId === item.id ? (
                                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600" />
                                        ) : (
                                          <MinusIcon className="h-3 w-3" />
                                        )}
                                      </Button>
                                      <span className="text-gray-500 min-w-8 text-center">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() =>
                                          updateItemQuantity(
                                            item.id,
                                            item.quantity + 1
                                          )
                                        }
                                        disabled={updatingProductId === item.id}
                                      >
                                        {updatingProductId === item.id ? (
                                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-400 border-t-gray-600" />
                                        ) : (
                                          <PlusIcon className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>

                                    <div className="flex">
                                      <Button
                                        variant="destructive"
                                        onClick={() => removeItem(item.id)}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>{formatCurrency(getTotalPrice())}</p>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        className="flex items-center cursor-pointer w-full justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700"
                      >
                        Checkout
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or{" "}
                        <button
                          type="button"
                          onClick={handleContinueShopping}
                          className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500"
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
