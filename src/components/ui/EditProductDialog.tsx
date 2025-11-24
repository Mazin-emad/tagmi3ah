import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { Product } from "@/api/types";
import EditGpuForm from "@/components/forms/product/EditGpuForm";
import EditCpuForm from "@/components/forms/product/EditCpuForm";
import EditPsuForm from "@/components/forms/product/EditPsuForm";
import EditMotherboardForm from "@/components/forms/product/EditMotherboardForm";
import EditRamKitForm from "@/components/forms/product/EditRamKitForm";
import EditPcCaseForm from "@/components/forms/product/EditPcCaseForm";

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export default function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription className="sr-only">
            Edit existing product details
          </DialogDescription>
        </DialogHeader>
        {product ? (
          <div className="py-2">
            {(() => {
              const cat = (product.categoryName || product.category || product.type || "").toString().toLowerCase();
              if (cat.includes("gpu") || cat.includes("graphics")) {
                return <EditGpuForm product={product} onClose={handleClose} />;
              }
              if (cat.includes("cpu")) {
                return <EditCpuForm product={product} onClose={handleClose} />;
              }
              if (cat.includes("psu") || cat.includes("power")) {
                return <EditPsuForm product={product} onClose={handleClose} />;
              }
              if (cat.includes("motherboard")) {
                return <EditMotherboardForm product={product} onClose={handleClose} />;
              }
              if (cat.includes("ram") || cat.includes("memory")) {
                return <EditRamKitForm product={product} onClose={handleClose} />;
              }
              if (cat.includes("case")) {
                return <EditPcCaseForm product={product} onClose={handleClose} />;
              }
              return (
                <div className="text-sm text-muted-foreground">
                  Editing for this product type is not implemented yet.
                </div>
              );
            })()}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
