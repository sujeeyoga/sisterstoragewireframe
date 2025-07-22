import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
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

  // Pixel-perfect size mappings
  const sizeClasses = {
    xs: 'h-4 md:h-5',
    sm: 'h-6 md:h-7',
    md: 'h-8 md:h-10',
    lg: 'h-10 md:h-12',
    xl: 'h-12 md:h-14'
  };

  // Precise scroll scaling with sub-pixel accuracy
  const scale = scrolled ? 0.92 : 1;
  const opacity = imageLoaded ? (scrolled ? 0.95 : 1) : 0;

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
              "absolute inset-0 bg-muted animate-pulse rounded",
              sizeClasses[size]
            )}
            style={{ width: '120px' }}
          />
        )}
        
        {/* Main logo image */}
        <img 
          src="https://sisterstorage.com/wp-content/uploads/2025/02/Sister-Storage-Logo-Main-300x112.png"
          alt="Sister Storage - Elegant jewelry and keepsake storage solutions"
          className={cn(
            sizeClasses[size],
            "w-auto transition-all duration-300 ease-out",
            "hover:brightness-110 active:scale-95",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          style={{ 
            transform: `scale(${scale})`,
            opacity: opacity,
            filter: scrolled ? 'brightness(0.98)' : 'brightness(1)',
            transformOrigin: 'center',
          }}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          fetchPriority={loading === 'eager' ? 'high' : 'auto'}
        />
      </div>
    </Link>
  );
};

export default EnhancedLogo;