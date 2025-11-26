interface ProductDescriptionProps {
  description: string;
  className?: string;
}

export function ProductDescription({
  description,
  className = "",
}: ProductDescriptionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h2 className="text-lg font-semibold">Description</h2>
      <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {description || "No description available."}
      </p>
    </div>
  );
}

