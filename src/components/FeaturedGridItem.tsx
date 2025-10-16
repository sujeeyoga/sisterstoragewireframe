import React from 'react';
import { cn } from '@/lib/utils';

interface FeaturedGridItemProps {
  image: string;
  title: string;
  span: 'normal' | 'horizontal' | 'vertical';
  onClick?: () => void;
}

const FeaturedGridItem: React.FC<FeaturedGridItemProps> = ({ 
  image, 
  title, 
  span,
  onClick
}) => {

  const getSpanClass = (spanType: string) => {
    switch (spanType) {
      case 'horizontal':
        return 'col-span-2 aspect-[2/1]';
      case 'vertical':
        return 'row-span-2';
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
      onClick={onClick}
    >
      {/* Image */}
      <img
        src={image}
        alt={title}
        fetchPriority="low"
        className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
        decoding="async"
        style={{ 
          backfaceVisibility: 'hidden',
          contentVisibility: 'auto'
        }}
      />
    </div>
  );
};

export default FeaturedGridItem;
