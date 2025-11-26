interface ProductHeaderProps {
  title: string;
  price: string;
  className?: string;
}

export function ProductHeader({
  title,
  price,
  className = "",
}: ProductHeaderProps) {
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground flex-1 min-w-0 wrap-break-word">
          {title}
        </h1>
        <span className="text-3xl md:text-4xl font-bold text-primary shrink-0">
          {price}
        </span>
      </div>
    </div>
  );
}
