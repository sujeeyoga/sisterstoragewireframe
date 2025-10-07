
import { useState } from 'react';
import HeroContent from './hero/HeroContent';
import ScrollIndicator from './hero/ScrollIndicator';
import HeroSpotlightCard from './HeroSpotlightCard';
import RotatingImageGallery from './hero/RotatingImageGallery';
import { useOptimizedScroll } from '@/hooks/use-optimized-scroll';

// Import optimized image assets
import heroMain32rem from '@/assets/hero-main-32rem.jpg';

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
      {/* Hero container with standardized container system */}
      <div className="container-custom relative">
        <div className="pt-8 pb-16 lg:pt-12 lg:pb-24">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8 min-h-[calc(100vh-12rem)]">
            {/* Hero Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-8 text-center lg:text-left">
                <HeroContent scrollPosition={scrollPosition} />
              </div>
            </div>

            {/* Right section - Spotlight Card on desktop, Image container on mobile */}
            <div className="flex-shrink-0 flex flex-col gap-8">
              {/* Hero Spotlight Card */}
              <HeroSpotlightCard
                alt="Beautiful jewelry storage solutions with elegant pink and white bangle organizers"
                sources={[
                  { src: heroMain32rem, width: 512 },
                ]}
                badge="Beautifully Organized"
                title="Beautiful Organization"
                body="Made by sisters, for sisters. Designed storage that respects your space."
                cta={{ label: "Shop the Drop", href: "/shop" }}
                aspect="1/1"
                className="w-[32rem] max-w-full mx-auto lg:mx-0"
              />
              
              {/* XL Image Container - appears on desktop in right section, mobile after text */}
              <div className="w-[48rem] max-w-full mx-auto lg:mx-0 lg:block hidden animate-breath-fade-up-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                  <RotatingImageGallery
                    images={[
                      '/lovable-uploads/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png',
                      '/lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png',
                      '/lovable-uploads/4ef08ea3-3380-4111-b4a1-eb939cba275b.png'
                    ]}
                    className="w-full h-full rounded-2xl"
                  />
                </div>
              </div>
              
              {/* Mobile version - shows after hero text */}
              <div className="w-[48rem] max-w-full mx-auto lg:hidden animate-breath-fade-up-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                  <RotatingImageGallery
                    images={[
                      '/lovable-uploads/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png',
                      '/lovable-uploads/fb8da55a-c9bb-419e-a96f-175a667875e1.png',
                      '/lovable-uploads/4ef08ea3-3380-4111-b4a1-eb939cba275b.png'
                    ]}
                    className="w-full h-full rounded-2xl"
                  />
                </div>
              </div>
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
