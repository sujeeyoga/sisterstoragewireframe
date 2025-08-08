
import React, { useState } from 'react';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useIsMobile } from '@/hooks/use-mobile';

const ParallaxContainer = () => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Optimized mobile parallax - disabled on mobile for better performance
  const parallaxDisabled = isMobile;
  const mainParallaxSpeed = isMobile ? 0 : 0.3;
  const overlayParallaxSpeed = isMobile ? 0 : 0.2;
  
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

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Mobile-optimized height and text sizes
  const containerHeight = isMobile ? 'h-[70vh] min-h-[500px]' : 'h-screen';

  return (
    <section 
      ref={mainRef}
      className={`relative ${containerHeight} overflow-hidden w-full`}
      aria-label="Parallax showcase section"
      style={{
        marginTop: '0' // Remove conflicting margins
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

      
      {/* Content Overlay - Mobile Optimized */}
      <div 
        className="relative z-20 h-full flex items-center justify-center px-4 md:px-6"
        style={{
          transform: !prefersReducedMotion && !isMobile && isVisible ? `translateY(${overlayOffset}px)` : 'none',
          transition: prefersReducedMotion || isMobile ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {/* Text overlay removed per request */}
      </div>

      
    </section>
  );
};

export default ParallaxContainer;
