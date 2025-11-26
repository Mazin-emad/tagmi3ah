import { useState, useCallback } from "react";

interface UseQuantityOptions {
  initialQuantity?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

export function useQuantity({
  initialQuantity = 1,
  minQuantity = 1,
  maxQuantity,
}: UseQuantityOptions = {}) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increase = useCallback(() => {
    setQuantity((prev) => {
      if (maxQuantity !== undefined && prev >= maxQuantity) {
        return prev;
      }
      return prev + 1;
    });
  }, [maxQuantity]);

  const decrease = useCallback(() => {
    setQuantity((prev) => {
      if (prev <= minQuantity) {
        return prev;
      }
      return prev - 1;
    });
  }, [minQuantity]);

  const reset = useCallback(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  return {
    quantity,
    increase,
    decrease,
    reset,
    setQuantity,
  };
}

