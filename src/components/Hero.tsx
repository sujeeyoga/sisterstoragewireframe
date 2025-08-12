
import { useState } from 'react';
import HeroContent from './hero/HeroContent';
import ScrollIndicator from './hero/ScrollIndicator';
import HeroSpotlightCard from './HeroSpotlightCard';
import { useOptimizedScroll } from '@/hooks/use-optimized-scroll';

// Import optimized image assets
import heroSpot640 from '@/assets/hero-spot-640.jpg';
import heroSpot960 from '@/assets/hero-spot-960.jpg';
import heroSpot1440 from '@/assets/hero-spot-1440.jpg';

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
      {/* Hero container with max-width and proper padding */}
      <div className="relative mx-auto max-w-[1200px] px-4 lg:px-6">
        <div className="pt-20 pb-16 lg:pt-28 lg:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start min-h-[calc(100vh-12rem)]">
            {/* Hero Content */}
            <div className="flex flex-col justify-center">
              <div className="space-y-8 text-center md:text-left">
                <HeroContent scrollPosition={scrollPosition} />
              </div>
            </div>

            {/* Hero Spotlight Card */}
            <HeroSpotlightCard
              alt="Sisters organizing beautiful storage solutions with elegant pink and white organizers"
              sources={[
                { src: heroSpot640, width: 640 },
                { src: heroSpot960, width: 960 },
                { src: heroSpot1440, width: 1440 },
              ]}
              badge="Beautifully Organized"
              title="Beautiful Organization"
              body="Made by sisters, for sisters. Designed storage that respects your space."
              cta={{ label: "Shop the Drop", href: "/shop" }}
              aspect="4/3"
              className="md:sticky md:top-24 group"
            />
          </div>
        </div>
      </div>
      
      <ScrollIndicator scrollPosition={scrollPosition} />
      
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none" style={{background: 'linear-gradient(to top, hsl(var(--brand-pink)), rgba(0,0,0,0))'}} />
    </section>
  );
};

export default Hero;
