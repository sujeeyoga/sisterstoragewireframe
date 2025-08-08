
import { useState } from 'react';
import HeroContent from './hero/HeroContent';
import ScrollIndicator from './hero/ScrollIndicator';
import { useOptimizedScroll } from '@/hooks/use-optimized-scroll';

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Use optimized scroll hook only if motion is allowed
  useOptimizedScroll({
    onScroll: prefersReducedMotion ? () => {} : setScrollPosition,
    throttle: 16,
    passive: true
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[hsl(var(--brand-pink))]" aria-label="Hero section">
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center pt-24 pb-32 lg:pt-32 lg:pb-20 z-20 gap-24 lg:gap-40 px-4">
        {/* Hero Content - Centered with proper spacing */}
        <div className="w-full flex flex-col justify-center items-center lg:items-start">
          <div className="w-full space-y-8 text-center lg:text-left">
            <HeroContent scrollPosition={scrollPosition} />
          </div>
        </div>
        
        {/* Hero Image with White Container - Proper spacing and sizing */}
        <div className="flex-1 flex justify-center lg:justify-end items-center px-6 lg:px-8 max-w-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="w-full flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-[hsl(var(--brand-pink))] border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300" aria-label="Beautiful Organization title pill">
              <span className="text-sm lg:text-base font-black tracking-tight">BEAUTIFUL ORGANIZATION</span>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollIndicator scrollPosition={scrollPosition} />
      
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none" style={{background: 'linear-gradient(to top, hsl(var(--brand-pink)), rgba(0,0,0,0))'}} />
    </section>
  );
};

export default Hero;
