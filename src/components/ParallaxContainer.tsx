
import React from 'react';
import { useParallaxScroll } from '@/hooks/use-parallax-scroll';
import { useIsMobile } from '@/hooks/use-mobile';

const ParallaxContainer = () => {
  const isMobile = useIsMobile();
  
  // Reduce parallax effect on mobile for better performance
  const mainParallaxSpeed = isMobile ? 0.15 : 0.4;
  const secondaryParallaxSpeed = isMobile ? 0.08 : 0.25;
  
  const { ref: mainRef, offset: mainOffset } = useParallaxScroll({
    speed: mainParallaxSpeed,
    threshold: 0.1
  });
  
  const { ref: overlayRef, offset: overlayOffset } = useParallaxScroll({
    speed: secondaryParallaxSpeed,
    threshold: 0.1
  });

  // Calculate responsive height
  const containerHeight = isMobile ? 'h-[70vh]' : 'h-[90vh]';

  return (
    <section 
      ref={mainRef}
      className={`relative ${containerHeight} overflow-hidden w-full -mt-16`}
      aria-label="Parallax showcase section"
      style={{
        marginTop: '-4rem' // Overlap with hero for seamless transition
      }}
    >
      {/* Main Parallax Background Layer */}
      <div 
        className="absolute inset-0 w-full h-[120%]"
        style={{
          transform: `translateY(${mainOffset}px) translate3d(0, 0, 0)`,
          willChange: 'transform'
        }}
      >
        <picture>
          <source 
            srcSet="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-43-scaled.webp" 
            type="image/webp" 
          />
          <img
            src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-43-scaled.jpg"
            alt="Elegant storage solutions in a beautifully organized space"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </picture>
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
        <div className="w-full h-full bg-gradient-to-b from-[#E90064]/20 via-black/10 to-black/30" />
      </div>
      
      {/* Static Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">
            STORAGE THAT SPEAKS TO YOUR SOUL
          </h2>
          <p className="text-xl md:text-2xl font-medium opacity-90 leading-relaxed">
            Every piece designed with intention, crafted with love
          </p>
        </div>
      </div>

      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/90 to-transparent z-20" />
    </section>
  );
};

export default ParallaxContainer;
