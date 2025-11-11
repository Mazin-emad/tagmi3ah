import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MyItemsContext, type AnyProductResponse } from "../../Context/myItemsContext";
import { useContext } from "react";
import { Badge } from "@/components/ui/badge";
import { XMarkIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { useCart } from "@/Context/cartContextBase";
import { useAddToCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function Sidebar() {
  const {
    setCurrentShow,
    items,
    setItems,
    setSocket,
    setRamType,
    currentShow,
  } = useContext(MyItemsContext);
  const { addItems } = useCart();
  const { mutateAsync: addToCart } = useAddToCart();

  function removeItem(product: AnyProductResponse) {
    const categoryName = product.categoryName || "";
    if (categoryName.toUpperCase() === "CPU") {
      setItems((prev: Record<string, AnyProductResponse>) => ({
        ...prev,
        CPU: undefined as unknown as AnyProductResponse,
      }));
      setSocket((prev: { pSocket: string; mSocket: string }) => ({
        ...prev,
        pSocket: "all",
      }));
      if (items.Motherboard == undefined) {
        setRamType("all");
      }
    }
    if (categoryName.toUpperCase() === "MOTHERBOARD") {
      setItems((prev: Record<string, AnyProductResponse>) => ({
        ...prev,
        Motherboard: undefined as unknown as AnyProductResponse,
      }));
      setSocket((prev: { pSocket: string; mSocket: string }) => ({
        ...prev,
        mSocket: "all",
      }));
      if (items.CPU == undefined) {
        setRamType("all");
      }
    } else if (categoryName.toUpperCase() === "RAMKIT" || categoryName.toUpperCase() === "RAM") {
      setItems((prev: Record<string, AnyProductResponse>) => ({
        ...prev,
        RAM: undefined as unknown as AnyProductResponse,
      }));
      if (items.Motherboard == undefined && items.CPU == undefined) {
        setRamType("all");
      }
    } else {
      setItems((prev: Record<string, AnyProductResponse>) => ({
        ...prev,
        [categoryName]: undefined as unknown as AnyProductResponse,
      }));
    }
  }

  const navItems = [
    { show: "CPU", filter: "CPUs" },
    { show: "GPU", filter: "GPUs" },
    { show: "Motherboard", filter: "Motherboards" },
    { show: "RAM", filter: "ramKits" },
    { show: "Power Supply", filter: "PowerSupply" },
    { show: "Case", filter: "pcCases" },
  ];

  const selectedProducts = Object.values(items).filter(
    (product): product is AnyProductResponse => product !== undefined
  );

  const totalPrice = selectedProducts.reduce(
    (sum, product) => sum + product.price,
    0
  );

  const handleAddBuildToCart = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one component");
      return;
    }

    // Optimistic local cart update
    addItems(selectedProducts);

    // Sync with server cart
    try {
      await Promise.all(
        selectedProducts.map((p) => {
          const productId = typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
          return addToCart({ productId, quantity: 1 });
        })
      );
      toast.success(
        `Added ${selectedProducts.length} item${
          selectedProducts.length > 1 ? "s" : ""
        } to cart!`,
        {
          description: `Total: $${totalPrice.toFixed(2)}`,
        }
      );
    } catch (e: unknown) {
      toast.error("Failed to sync cart with server");
    }
  };

  return (
    <div className="space-y-4 lg:sticky lg:top-6">
      {/* Component Selection - Mobile: Horizontal scroll, Desktop: Vertical */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Components</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile: Horizontal scrollable */}
          <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              {navItems.map((item) => (
                <button
                  key={item.filter}
                  onClick={() => setCurrentShow(item.filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                    currentShow === item.filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {item.show}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: Vertical list */}
          <nav className="hidden md:block space-y-1">
            {navItems.map((item) => (
              <button
                key={item.filter}
                onClick={() => setCurrentShow(item.filter)}
                className={`w-full text-left rounded-md px-3 py-2 text-sm transition-colors ${
                  currentShow === item.filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 hover:bg-muted/60"
                }`}
              >
                {item.show}
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Selected Items */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Selected Components</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(items).length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              No items selected
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(items).map(
                ([category, product]: [string, AnyProductResponse]) => {
                  if (product != undefined) {
                    return (
                      <div
                        key={category}
                        className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          </div>
                          <p className="text-xs font-medium truncate">
                            {product?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${product?.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(product)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                          aria-label="Remove item"
                        >
                          <XMarkIcon className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    );
                  }
                }
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Build to Cart Button */}
      {selectedProducts.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Price</span>
                <span className="text-lg font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <Button
                onClick={handleAddBuildToCart}
                className="w-full"
                size="lg"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add Build to Cart
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                {selectedProducts.length} component
                {selectedProducts.length > 1 ? "s" : ""} selected
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
