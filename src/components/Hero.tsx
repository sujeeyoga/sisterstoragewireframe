
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
    <section className="relative min-h-screen w-full overflow-hidden bg-[var(--brand-pink)]" aria-label="Hero section">
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center pt-40 pb-32 lg:pt-48 lg:pb-20 z-20 gap-24 lg:gap-40 px-4">
        {/* Hero Content - Centered with proper spacing */}
        <div className="w-full flex flex-col justify-center items-center lg:items-start">
          <div className="w-full space-y-8 text-center lg:text-left">
            <HeroContent scrollPosition={scrollPosition} />
          </div>
        </div>
        
        {/* Hero Image with White Container - Proper spacing and sizing */}
        <div className="flex-1 flex justify-center lg:justify-end items-center px-6 lg:px-8 max-w-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-lg transform hover:scale-[1.02] transition-all duration-500 ease-out hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.4)]">
            <div className="aspect-square overflow-hidden rounded-2xl mb-8 lg:mb-10 shadow-lg relative group">
              <img
                src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg"
                alt="Sister Storage lifestyle organization"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl lg:text-2xl font-black text-[var(--brand-pink)] tracking-tight leading-tight">BEAUTIFUL ORGANIZATION</h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed font-medium">
                Transform your space with our thoughtfully designed storage solutions. Made by sisters, for sisters.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <ScrollIndicator scrollPosition={scrollPosition} />
      
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none" style={{background: 'linear-gradient(to top, var(--brand-pink), rgba(0,0,0,0))'}} />
    </section>
  );
};

export default Hero;
