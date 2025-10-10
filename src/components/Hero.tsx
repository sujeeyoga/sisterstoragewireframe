import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { HeroMobileLayout } from './hero/HeroMobileLayout';
import { HeroDesktopLayout } from './hero/HeroDesktopLayout';

const Hero = () => {
  const { ref: parallaxRef, offset } = useOptimizedParallax({ speed: 0.3 });

  return (
    <section ref={parallaxRef} className="relative w-full overflow-hidden" aria-label="Hero section">
      {/* Mobile Layout */}
      <HeroMobileLayout offset={offset} />

      {/* Desktop Layout */}
      <HeroDesktopLayout />
    </section>
  );
};

export default Hero;
