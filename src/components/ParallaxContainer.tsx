
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

  const imageUrlDesktop = "https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg";
  const imageUrlMobile = "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png";
  const backgroundImage = `url(${isMobile ? imageUrlMobile : imageUrlDesktop})`;

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
      className="relative h-screen overflow-hidden w-full bg-no-repeat bg-cover bg-center"
      aria-label="Parallax showcase section"
      style={{
        height: 'calc(var(--vh, 1vh) * 100)',
        marginTop: '0',
        backgroundImage: backgroundImage,
        backgroundAttachment: !prefersReducedMotion && !isMobile ? 'fixed' : 'scroll',
        backgroundColor: 'hsl(var(--brand-pink))'
      }}
    >
      {/* Image-only parallax background applied via section styles */}

      {/* Image-only — no foreground elements or overlays */}
    </section>
  );
};

export default ParallaxContainer;
