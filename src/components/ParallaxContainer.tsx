
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
        className="absolute inset-0 w-full h-full bg-[#E90064]"
        style={{
          transform: !prefersReducedMotion && isVisible ? `translateY(${mainOffset}px)` : 'none',
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
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
          <img
            src="/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png"
            alt="Lifestyle image showing hands holding phone with social media interface"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: !prefersReducedMotion && isVisible ? `translateY(${mainOffset * 0.8}px) scale(1.1)` : 'scale(1.1)',
              transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
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
            <div className="text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Sister Storage</h3>
              <p className="text-lg opacity-90">Beautiful Organization</p>
            </div>
          </div>
        )}
      </div>

      
      {/* Content Overlay */}
      <div 
        className="relative z-20 h-full flex items-center justify-center px-6"
        style={{
          transform: !prefersReducedMotion && isVisible ? `translateY(${overlayOffset}px)` : 'none',
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out'
        }}
      >
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

      
    </section>
  );
};

export default ParallaxContainer;
