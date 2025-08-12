import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface PerformanceImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'eager' | 'lazy';
  priority?: boolean;
  placeholder?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
  srcSet?: string;
}

const PerformanceImage: React.FC<PerformanceImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  placeholder,
  fallback,
  onLoad,
  onError,
  sizes,
  srcSet,
  ...props
}) => {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setImageState('loaded');
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setImageState('error');
    onError?.();
    
    // Try fallback image if available
    if (placeholder && imageSrc !== placeholder) {
      setImageSrc(placeholder);
      setImageState('loading');
    }
  }, [onError, placeholder, imageSrc]);

  // Error state
  if (imageState === 'error' && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading placeholder */}
      {imageState === 'loading' && placeholder && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}
        />
      )}
      
      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={cn(
          "transition-opacity duration-300",
          imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        srcSet={srcSet}
        {...props}
      />
    </div>
  );
};

export default PerformanceImage;