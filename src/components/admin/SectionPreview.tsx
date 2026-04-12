import React, { useMemo, useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { slugsForFilter } from '@/hooks/useShopSections';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionPreviewProps {
  title: string;
  subtitle: string | null;
  categoryFilter: string | null;
  layoutColumns: number;
  visible: boolean;
}

const colsClass: Record<number, string> = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

export const SectionPreview: React.FC<SectionPreviewProps> = ({
  title,
  subtitle,
  categoryFilter,
  layoutColumns,
  visible,
}) => {
  const [open, setOpen] = useState(false);
  const { data: allProducts = [] } = useProducts();

  const products = useMemo(() => {
    if (!categoryFilter) return [];
    const slugs = slugsForFilter(categoryFilter);
    return allProducts.filter((p) => slugs.includes(p.category));
  }, [allProducts, categoryFilter]);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground">
          <span className="flex items-center gap-2">
            {visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Section Preview
          </span>
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div
          className={cn(
            'mt-3 rounded-lg border p-4 transition-opacity',
            !visible && 'opacity-40 grayscale'
          )}
        >
          {!visible && (
            <div className="mb-2 text-xs font-medium text-destructive uppercase tracking-wide flex items-center gap-1">
              <EyeOff className="h-3 w-3" /> Hidden from shop
            </div>
          )}

          {/* Title / Subtitle */}
          <h3 className="text-lg font-bold uppercase tracking-wide text-foreground">
            {title || 'Untitled Section'}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5 mb-3">
              {subtitle}
            </p>
          )}

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className={cn('grid gap-3', colsClass[layoutColumns] || 'grid-cols-3')}>
              {products.slice(0, layoutColumns * 2).map((product) => (
                <div
                  key={product.id}
                  className="rounded-md border bg-card overflow-hidden"
                >
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${product.price?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic py-4 text-center">
              {categoryFilter
                ? `No products found for "${categoryFilter}"`
                : 'No category filter set'}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
