
import React, { useState } from 'react';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useIsMobile } from '@/hooks/use-mobile';
import { useViewportHeight } from '@/hooks/use-viewport-height';

const ParallaxContainer = () => {
  const isMobile = useIsMobile();
  useViewportHeight();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Optimized mobile parallax - disabled on mobile for better performance
  const parallaxDisabled = false;
  const mainParallaxSpeed = isMobile ? 0.12 : 0.6;
  const overlayParallaxSpeed = isMobile ? 0.08 : 0.4;
  
  const { 
    ref: mainRef, 
    offset: mainOffset, 
    isVisible,
    prefersReducedMotion 
  } = useOptimizedParallax({
    speed: mainParallaxSpeed,
    threshold: 0.1,
    disabled: parallaxDisabled
  });
  
  const { offset: overlayOffset } = useOptimizedParallax({
    speed: overlayParallaxSpeed,
    threshold: 0.1,
    disabled: parallaxDisabled
  });
  
  const { offset: foregroundOffset } = useOptimizedParallax({
    speed: isMobile ? 0.16 : 0.8,
    threshold: 0.1,
    disabled: parallaxDisabled
  });

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Use CSS variable-driven viewport height for reliable mobile VH
  // Fallback to h-screen via class; inline style uses --vh
  return (
    <section 
      ref={mainRef}
      className="relative h-screen overflow-hidden w-full"
      aria-label="Parallax showcase section"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        marginTop: '0'
      }}
    >
      {/* Background Layer with Optimized Mobile Performance */}
      <div 
        className="absolute inset-0 w-full h-full bg-[#E90064]"
        style={{
          transform: !prefersReducedMotion && !isMobile && isVisible ? `translateY(${mainOffset}px)` : 'none',
          transition: prefersReducedMotion || isMobile ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#E90064] animate-pulse flex items-center justify-center">
            <div className="text-white text-sm md:text-lg font-medium">Loading...</div>
          </div>
        )}

        {/* Main Image - Mobile Optimized */}
        {!imageError && (
          <img
            src={isMobile 
              ? "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png"
              : "https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg"
            }
            alt="Sister Storage lifestyle organization"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: !prefersReducedMotion && !isMobile && isVisible 
                ? `translateY(${mainOffset * 0.8}px) scale(1.05)` 
                : isMobile ? 'scale(1)' : 'scale(1.05)',
              transition: prefersReducedMotion || isMobile ? 'none' : 'transform 0.1s ease-out'
            }}
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Fallback for image error */}
        {imageError && (
          <div className="absolute inset-0 bg-[#E90064] flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Sister Storage</h3>
              <p className="text-base md:text-lg opacity-90">Beautiful Organization</p>
            </div>
          </div>
        )}
      </div>

      {/* Foreground decorative parallax elements */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute -top-10 left-6 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/10 border border-white/20 backdrop-blur-[2px]"
          style={{
            transform: !prefersReducedMotion && isVisible ? `translateY(${foregroundOffset * 1.2}px)` : 'none',
            transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
            willChange: 'transform'
          }}
        />
        <div
          className="absolute -bottom-10 right-10 w-40 h-40 md:w-56 md:h-56 rounded-full bg-black/10 border border-white/10"
          style={{
            transform: !prefersReducedMotion && isVisible ? `translateY(${foregroundOffset * 1.5}px)` : 'none',
            transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
            willChange: 'transform'
          }}
        />
      </div>

      {/* Content Overlay - Mobile Optimized */}
      <div 
        className="relative z-20 h-full flex items-center justify-center px-4 md:px-6 animate-fade-in"
        style={{
          transform: !prefersReducedMotion && isVisible ? `translateY(${overlayOffset}px)` : 'none',
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      >
        {/* Text overlay removed per request */}
      </div>

      
    </section>
  );
};

export default ParallaxContainer;
