import Sidebar from "../components/ui/sidebar";
import { BuilderProductRow } from "@/components/builder/BuilderProductRow";
import { useContext, useMemo } from "react";
import { MyItemsContext } from "@/Context/myItemsContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { useCpus } from "@/hooks/product/useCpus";
import { useMotherboards } from "@/hooks/product/useMotherboards";
import { useGpus } from "@/hooks/product/useGpus";
import { useRamKits } from "@/hooks/product/useRamKits";
import { usePsus } from "@/hooks/product/usePsus";
import { usePcCases } from "@/hooks/product/usePcCases";

const Builder = () => {
  const context = useContext(MyItemsContext);
  const { currentShow, socket, ramType, items } = context;
  const { data: cpus = [] } = useCpus();
  const { data: motherboards } = useMotherboards();
  const { data: gpus } = useGpus();
  const { data: ramKits } = useRamKits();
  const { data: psus } = usePsus();
  const { data: pcCases } = usePcCases();

  const selectedRamType = useMemo(() => {
    if (!ramType || typeof ramType !== "string") return "ALL";
    return ramType.toUpperCase();
  }, [ramType]);

  const getFilteredProducts = () => {
    switch (currentShow) {
      case "CPUs":
        return (cpus ?? []).filter((p) => {
          const hasMotherboard = items.Motherboard !== undefined;
          const socketMatches =
            !hasMotherboard ||
            !socket?.mSocket ||
            socket.mSocket === "all" ||
            p.socket === socket.mSocket;

          const hasRAM = items.RAM !== undefined;
          const supportedMemoryTypes = (p.supportedMemoryTypes ?? []).map(
            (value) => value.toUpperCase()
          );

          const ramMatches =
            !hasRAM ||
            selectedRamType === "ALL" ||
            supportedMemoryTypes.includes(selectedRamType);

          return socketMatches && ramMatches;
        });
      case "GPUs":
        return gpus ?? [];
      case "Motherboards":
        return (motherboards ?? []).filter((p) => {
          const socketMatches =
            !socket?.pSocket ||
            socket.pSocket === "all" ||
            p.socket === socket.pSocket;

          const motherboardRamType = (p.ramType ?? "").toUpperCase();
          const ramMatches =
            selectedRamType === "ALL" ||
            (motherboardRamType &&
              motherboardRamType.includes(selectedRamType));

          return socketMatches && ramMatches;
        });
      case "ramKits":
        return (ramKits ?? []).filter((p) => {
          const kitType = (p.type ?? "").toUpperCase();
          return selectedRamType === "ALL" || kitType === selectedRamType;
        });
      case "PowerSupply":
        return psus ?? [];
      case "pcCases":
        return pcCases ?? [];
      default:
        return [];
    }
  };

  const filteredProducts = getFilteredProducts();
  const categoryNames: Record<string, string> = {
    CPUs: "CPUs",
    GPUs: "GPUs",
    Motherboards: "Motherboards",
    ramKits: "RAM Kits",
    PowerSupply: "Power Supplies",
    pcCases: "PC Cases",
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Mobile Header */}
        <div className="mb-6 md:hidden">
          <h1 className="text-2xl font-bold tracking-tight">Build Your PC</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Start Where You Ant And Finish Where You Suppose To.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Mobile: Full width, Desktop: 3 columns */}
          <div className="lg:col-span-3">
            <Sidebar />
          </div>

          {/* Main Content - Mobile: Full width, Desktop: 9 columns */}
          <div className="lg:col-span-9">
            {/* Desktop Header */}
            <div className="hidden md:block mb-6">
              <h1 className="text-3xl font-bold tracking-tight">
                Build Your PC
              </h1>
              <p className="text-muted-foreground mt-2">
                Pick parts to start your custom build
              </p>
            </div>

            {/* Category Title */}
            {currentShow && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {categoryNames[currentShow] || currentShow}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} available
                </p>
              </div>
            )}

            {/* Products Table */}
            {filteredProducts.length > 0 ? (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <div className="max-h-[70vh] overflow-y-auto">
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="w-16 sm:w-20">
                              Image
                            </TableHead>
                            <TableHead className="min-w-[200px]">
                              Product
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-right">
                              Price
                            </TableHead>
                            <TableHead className="sm:hidden">
                              Price & Actions
                            </TableHead>
                            <TableHead className="hidden sm:table-cell text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.map((product) => (
                            <BuilderProductRow
                              key={product.id}
                              product={product}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No products found matching your current filters.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try selecting different components or clearing filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Builder;
