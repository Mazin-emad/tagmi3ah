import Sidebar from "../components/ui/sidebar";
import { BuilderProductRow } from "@/components/builder/BuilderProductRow";
import {
  CPUs,
  Motherboards,
  GPUs,
  ramKits,
  PowerSupply,
  pcCases,
} from "@/lib/constants";
import { useContext } from "react";
import { MyItemsContext } from "@/Context/myItemsContext";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

type RamType = "DDR4" | "DDR5";

const Builder = () => {
  const context = useContext(MyItemsContext);
  const { currentShow, socket, ramType, items } = context;

  // Get filtered products based on current selection
  const getFilteredProducts = () => {
    switch (currentShow) {
      case "CPUs":
        return CPUs.filter((p) => {
          const socketMatches =
            p.socket === socket.mSocket || socket.mSocket == "all";
          const ramMatches =
            ramType == "all" ||
            p.supportedMemoryTypes.includes(ramType as "DDR4" | "DDR5") ||
            (items.Motherboard == undefined && items.RAM == undefined);
          return socketMatches && ramMatches;
        });
      case "GPUs":
        return GPUs;
      case "Motherboards":
        return Motherboards.filter((p) => {
          const socketMatches =
            p.socket === socket.pSocket || socket.pSocket == "all";
          const ramMatches =
            ramType == "all" || p.ramType?.includes(ramType as RamType);
          return socketMatches && ramMatches;
        });
      case "ramKits":
        return ramKits.filter(
          (p) => ramType === (p.type as RamType) || ramType == "all"
        );
      case "PowerSupply":
        return PowerSupply;
      case "pcCases":
        return pcCases;
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
