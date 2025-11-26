import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  maxQuantity?: number;
  minQuantity?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const iconSizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const textSizeClasses = {
  sm: "text-xs",
  md: "text-lg",
  lg: "text-xl",
};

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  maxQuantity,
  minQuantity = 1,
  disabled = false,
  size = "md",
}: QuantitySelectorProps) {
  const isDecreaseDisabled = disabled || quantity <= minQuantity;
  const isIncreaseDisabled = disabled || (maxQuantity !== undefined && quantity >= maxQuantity);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={onDecrease}
        disabled={isDecreaseDisabled}
        type="button"
        aria-label="Decrease quantity"
      >
        <MinusIcon className={iconSizeClasses[size]} />
      </Button>
      <span className={`font-semibold min-w-12 text-center ${textSizeClasses[size]}`}>
        {quantity}
      </span>
      <Button
        variant="outline"
        size="icon"
        className={sizeClasses[size]}
        onClick={onIncrease}
        disabled={isIncreaseDisabled}
        type="button"
        aria-label="Increase quantity"
      >
        <PlusIcon className={iconSizeClasses[size]} />
      </Button>
    </div>
  );
}

