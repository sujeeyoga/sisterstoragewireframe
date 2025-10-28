import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import logoImage from '@/assets/sister-storage-logo-new.jpg';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  scrolled?: boolean;
  variant?: 'default' | 'minimal' | 'icon-only';
  loading?: 'eager' | 'lazy';
  onLoad?: () => void;
  onError?: () => void;
}

const EnhancedLogo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  scrolled = false,
  variant = 'default',
  loading = 'eager',
  onLoad,
  onError
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Ensure we mark as loaded if the image is already cached
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    // If the image was cached and already complete, mark as loaded
    if (img.complete) {
      setImageLoaded(true);
      return;
    }
    const onLoad = () => setImageLoaded(true);
    img.addEventListener('load', onLoad);
    return () => img.removeEventListener('load', onLoad);
  }, []);

  // Safety fallback to avoid perpetual skeleton in rare cases
  useEffect(() => {
    const t = setTimeout(() => {
      if (!imageLoaded) setImageLoaded(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [imageLoaded]);

  // Responsive size mappings optimized for navbar
  const sizeClasses = {
    xs: 'h-3 sm:h-4 md:h-5',
    sm: 'h-4 sm:h-5 md:h-6 lg:h-7',
    md: 'h-5 sm:h-6 md:h-7 lg:h-8',
    lg: 'h-6 sm:h-7 md:h-8 lg:h-9 xl:h-10',
    xl: 'h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 2xl:h-12',
    '2xl': 'h-8 sm:h-9 md:h-10 lg:h-11 xl:h-12 2xl:h-14',
    '3xl': 'h-12 sm:h-14 md:h-16 lg:h-18 xl:h-20 2xl:h-22',
    '4xl': 'h-14 sm:h-16 md:h-18 lg:h-20 xl:h-22 2xl:h-24'
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  // Fallback for when image fails to load
  if (imageError) {
    return (
      <Link to="/" className={cn("relative z-10 font-bold text-primary", className)}>
        <span className="text-xl font-bold uppercase tracking-wide">
          Sister Storage
        </span>
      </Link>
    );
  }

  return (
    <Link to="/" className={cn("relative z-10 block", className)}>
      <div className="relative">
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div 
            className={cn(
              "absolute inset-0 bg-[hsl(var(--brand-pink)/0.2)] animate-pulse rounded",
              sizeClasses[size]
            )}
            style={{ width: '120px' }}
          />
        )}
        
        {/* Main logo image */}
        <img 
          ref={imgRef}
          src={logoImage}
          alt="Sister Storage - Elegant jewelry and keepsake storage solutions"
          className={cn(
            sizeClasses[size],
            "w-auto transition-all duration-300 ease-out",
            "hover:brightness-110 active:scale-95",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          loading={loading}
          decoding="async"
          fetchPriority={loading === 'eager' ? 'high' : 'auto'}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    </Link>
  );
};

export default EnhancedLogo;