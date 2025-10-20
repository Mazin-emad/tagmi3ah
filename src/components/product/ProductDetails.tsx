import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type SpecItem = { label: string; value: string };

type ProductDetailsProps = {
  title: string;
  brand: string;
  price: string;
  description: string;
  image: string;
  specs: SpecItem[];
};

export function ProductDetails({ title, brand, price, description, image, specs }: ProductDetailsProps) {

  return (
    <section className="max-w-screen-xl mx-auto px-4 py-6">
      {/* UPPER PART  */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5">
          <Card>
            <CardContent className="p-3">
              <div className="aspect-square rounded-md overflow-hidden border bg-muted/40">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h1 className="text-2xl font-semibold">
            {title}
          </h1>

          <div className="flex items-center gap-3">
            <Badge>{brand}</Badge>
            <span className="text-xl font-bold">{price}</span>
          </div>

          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      {/* Specifications table */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Specifications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {specs.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="text-sm font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
