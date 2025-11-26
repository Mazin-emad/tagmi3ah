interface StockBadgeProps {
  stock: number;
  className?: string;
}

export function StockBadge({ stock, className = "" }: StockBadgeProps) {
  const isInStock = stock > 0;
  const stockText = isInStock ? `In Stock (${stock})` : "Out of Stock";

  return (
    <span
      className={`text-sm font-medium ${
        isInStock
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      } ${className}`}
    >
      {stockText}
    </span>
  );
}

