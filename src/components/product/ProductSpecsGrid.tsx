type SpecItem = { label: string; value: string };

interface ProductSpecsGridProps {
  specs: SpecItem[];
  className?: string;
}

export function ProductSpecsGrid({ specs, className = "" }: ProductSpecsGridProps) {
  if (specs.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <h2 className="text-lg font-semibold mb-4">Specifications</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {specs.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className="flex flex-col gap-1 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors"
          >
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {item.label}
            </span>
            <span className="text-sm font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

