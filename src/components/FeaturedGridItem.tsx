import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FeaturedGridItemProps {
  image: string;
  title: string;
  span: 'normal' | 'horizontal' | 'vertical';
}

const FeaturedGridItem: React.FC<FeaturedGridItemProps> = ({ 
  image, 
  title, 
  span
}) => {
  const [hasError, setHasError] = useState(false);

  const getSpanClass = (spanType: string) => {
    switch (spanType) {
      case 'horizontal':
        return 'col-span-2 aspect-[2/1]';
      case 'vertical':
        return 'row-span-2 aspect-[1/2]';
      case 'normal':
      default:
        return 'aspect-square';
    }
  };

  return (
    <div 
      className={cn(
        "relative overflow-hidden bg-muted cursor-pointer group",
        getSpanClass(span)
      )}
    >
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-muted-foreground text-sm">Failed to load</span>
        </div>
      )}

      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-all duration-300 transform-gpu group-hover:opacity-90 group-hover:scale-105"
        loading="eager"
        decoding="async"
        onError={() => setHasError(true)}
        style={{ backfaceVisibility: 'hidden' }}
      />
    </div>
  );
};

export default FeaturedGridItem;
