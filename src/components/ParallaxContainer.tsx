
import React from 'react';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useIsMobile } from '@/hooks/use-mobile';
import { useViewportHeight } from '@/hooks/use-viewport-height';
import { Button } from '@/components/ui/button';
import { Instagram } from 'lucide-react';

const ParallaxContainer = () => {
  const isMobile = useIsMobile();
  useViewportHeight();
  
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
        backgroundColor: 'hsl(var(--brand-pink))'
      }}
    >
      {/* JS-driven parallax background for broad browser support */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: !prefersReducedMotion && !isMobile && isVisible
            ? `translateY(${mainOffset * 0.4}px)`
            : 'none',
          transition: prefersReducedMotion || isMobile ? 'none' : 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      />

      {/* Centered Instagram button only */}
      <div 
        className="relative z-10 h-full flex items-center justify-center px-4 md:px-6 animate-[float_3s_ease-in-out_infinite]"
        style={{
          transform: !prefersReducedMotion && isVisible ? `translateY(${overlayOffset}px)` : 'none',
          transition: prefersReducedMotion ? 'none' : 'transform 0.1s ease-out',
          willChange: 'transform'
        }}
      >
        <Button
          asChild
          variant="pink"
          size="lg"
          aria-label="Follow us on Instagram"
          className="shadow-lg"
        >
          <a
            href="https://www.instagram.com/sisterstorage/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Instagram className="h-5 w-5" aria-hidden="true" />
            <span>Follow on Instagram</span>
          </a>
        </Button>
      </div>

      {/* Optional subtle bottom gradient for contrast */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.2), rgba(0,0,0,0))'
        }}
      />
    </section>
  );
};

export default ParallaxContainer;
