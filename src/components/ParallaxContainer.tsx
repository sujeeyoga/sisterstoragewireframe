
import React, { useState } from 'react';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useIsMobile } from '@/hooks/use-mobile';

const ParallaxContainer = () => {
  const isMobile = useIsMobile();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // More noticeable mobile parallax speeds
  const mainParallaxSpeed = isMobile ? 0.3 : 0.5;
  const overlayParallaxSpeed = isMobile ? 0.15 : 0.3;
  
  const { 
    ref: mainRef, 
    offset: mainOffset, 
    isVisible,
    prefersReducedMotion 
  } = useOptimizedParallax({
    speed: mainParallaxSpeed,
    threshold: 0.1
  });
  
  const { offset: overlayOffset } = useOptimizedParallax({
    speed: overlayParallaxSpeed,
    threshold: 0.1
  });

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Calculate responsive height
  const containerHeight = isMobile ? 'h-[80vh]' : 'h-screen';

  return (
    <section 
      ref={mainRef}
      className={`relative ${containerHeight} overflow-hidden w-full`}
      aria-label="Parallax showcase section"
      style={{
        marginTop: '0' // Remove conflicting margins
      }}
    >
      {/* Background Layer with Parallax Effect */}
      <div 
        className="absolute inset-0 w-full h-[120%] bg-[#E90064]"
        style={{
          transform: prefersReducedMotion 
            ? 'translateY(0) translate3d(0, 0, 0)' 
            : `translateY(${mainOffset}px) translate3d(0, 0, 0)`,
          willChange: prefersReducedMotion ? 'auto' : 'transform'
        }}
      >
        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#E90064] animate-pulse flex items-center justify-center">
            <div className="text-white text-lg font-medium">Loading...</div>
          </div>
        )}

        {/* Main Image */}
        {!imageError && (
          <picture>
            <source 
              srcSet="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-43-scaled.webp" 
              type="image/webp" 
            />
            <img
              src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-43-scaled.jpg"
              alt="Elegant storage solutions in a beautifully organized space"
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </picture>
        )}

        {/* Fallback for image error */}
        {imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E90064] to-[#B8004D] flex items-center justify-center">
            <div className="text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Sister Storage</h3>
              <p className="text-lg opacity-90">Beautiful Organization</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay Layer with Secondary Parallax */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          transform: prefersReducedMotion 
            ? 'translateY(0) translate3d(0, 0, 0)' 
            : `translateY(${overlayOffset}px) translate3d(0, 0, 0)`,
          willChange: prefersReducedMotion ? 'auto' : 'transform'
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-[#E90064]/30 via-black/20 to-black/40" />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h2 
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-lg"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            STORAGE THAT SPEAKS TO YOUR SOUL
          </h2>
          <p 
            className="text-xl md:text-2xl lg:text-3xl font-medium opacity-95 leading-relaxed drop-shadow-md"
            style={{
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            Every piece designed with intention, crafted with love
          </p>
        </div>
      </div>

      {/* Smooth transition gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-30 pointer-events-none" />
      
      {/* Performance indicator for debugging (only in development) */}
      {process.env.NODE_ENV === 'development' && isVisible && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 text-xs rounded z-40">
          Parallax Active | Offset: {Math.round(mainOffset)}px
        </div>
      )}
    </section>
  );
};

export default ParallaxContainer;
