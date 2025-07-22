
import React from 'react';
import { useParallaxScroll } from '@/hooks/use-parallax-scroll';
import { useIsMobile } from '@/hooks/use-mobile';

interface ParallaxLayer {
  speed: number;
  zIndex: number;
  opacity?: number;
  className?: string;
}

const ParallaxContainer = () => {
  const isMobile = useIsMobile();
  
  // Reduce parallax effect on mobile for better performance
  const mainParallaxSpeed = isMobile ? 0.2 : 0.5;
  const secondaryParallaxSpeed = isMobile ? 0.1 : 0.3;
  
  const { ref: mainRef, offset: mainOffset } = useParallaxScroll({
    speed: mainParallaxSpeed,
    threshold: 0.1
  });
  
  const { ref: overlayRef, offset: overlayOffset } = useParallaxScroll({
    speed: secondaryParallaxSpeed,
    threshold: 0.1
  });

  // Calculate responsive height
  const containerHeight = isMobile ? 'h-[70vh]' : 'h-[100vh]';

  return (
    <div 
      ref={mainRef}
      className={`relative ${containerHeight} overflow-hidden w-full`}
    >
      {/* Main Parallax Background Layer */}
      <div 
        className="absolute inset-0 w-full h-[120%]"
        style={{
          transform: `translateY(${mainOffset}px) translate3d(0, 0, 0)`,
          willChange: 'transform'
        }}
      >
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg)',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
      </div>

      {/* Secondary Parallax Overlay Layer */}
      <div 
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          transform: `translateY(${overlayOffset}px) translate3d(0, 0, 0)`,
          willChange: 'transform'
        }}
      >
        <div className="w-full h-full bg-gradient-to-b from-transparent via-black/5 to-black/20" />
      </div>
      
      {/* Static Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          {/* Optional content can be added here */}
        </div>
      </div>

      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-20" />
    </div>
  );
};

export default ParallaxContainer;
