interface EmptyProductsStateProps {
  message?: string;
  subMessage?: string;
}

export function EmptyProductsState({
  message = "No products found matching your filters.",
  subMessage = "Try adjusting your search criteria or clearing the filters.",
}: EmptyProductsStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-lg text-muted-foreground mb-2">{message}</p>
      <p className="text-sm text-muted-foreground">{subMessage}</p>
    </div>
  );
}

