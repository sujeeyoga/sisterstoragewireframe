import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FeaturedGridItemProps {
  image: string;
  title: string;
  span: 'normal' | 'horizontal' | 'vertical';
  delay: number;
}

const FeaturedGridItem: React.FC<FeaturedGridItemProps> = ({ 
  image, 
  title, 
  span, 
  delay 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
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
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

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
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          "group-hover:opacity-90 group-hover:scale-105",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
    </div>
  );
};

export default FeaturedGridItem;
