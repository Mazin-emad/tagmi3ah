import { Card, CardContent } from "@/components/ui/card";

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
}

export function ProductImage({
  src,
  alt,
  className = "",
  loading = "lazy",
}: ProductImageProps) {
  return (
    <Card className="overflow-hidden p-0">
      <CardContent className="p-0">
        <div className="w-full rounded-lg overflow-hidden bg-muted/40">
          <img
            src={src}
            alt={alt}
            className={`h-full w-full object-cover ${className}`}
            loading={loading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
