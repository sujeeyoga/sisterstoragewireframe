import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroMainImage from '@/assets/hero-bg-main.jpg';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';

const Hero = () => {
  const { ref: parallaxRef, offset } = useOptimizedParallax({ speed: 0.3 });

  return (
    <section ref={parallaxRef} className="relative w-full overflow-hidden" aria-label="Hero section">
      {/* Mobile: Stacked Layout */}
      <div className="md:hidden flex flex-col">
        {/* Pink Content Section */}
        <div className="bg-[hsl(var(--brand-pink))] py-16 px-4 h-[75vh] flex items-center">
          <div className="flex flex-col space-y-3 text-white pt-54">
            {/* Badge */}
            <Badge 
              variant="secondary" 
              className="bg-white text-[hsl(var(--brand-pink))] px-4 py-2 text-base font-bold w-fit rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Beautifully Organized
            </Badge>

            {/* Headline */}
            <h1 className="text-[6rem] font-black leading-[0.9] tracking-tighter">
              CULTURE /<br />
              WITHOUT<br />
              CLUTTER.
            </h1>

            {/* Main Tagline */}
            <p className="text-3xl font-bold leading-[1.1] tracking-tight uppercase">
              BROUGHT TO YOU BY SISTERS<br />
              WHO GET IT.
            </p>

            {/* CTA Button */}
            <div className="pt-12">
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-lg px-6 py-4 w-fit shadow-2xl transition-all duration-300 rounded-full"
                >
                  SHOP THE DROP
                </Button>
              </Link>
            </div>

            {/* Bottom Text */}
            <div className="pt-2 opacity-95">
              <p className="text-lg font-light leading-relaxed tracking-wide">
                Made by sisters, for sisters.<br />
                Clutter never had a place in our culture.
              </p>
            </div>
          </div>
        </div>

        {/* Background Image */}
        <div className="w-full h-[70vh] overflow-hidden -mb-64">
          <img
            src={heroMainImage}
            alt="Woman showcasing Sister Storage jewelry organization solution"
            className="w-full h-full object-cover"
            style={{ transform: `translateY(${-offset}px)` }}
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>

      {/* Desktop: Overlapping Layout */}
      <div className="hidden md:block">
        {/* Full Background Image */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[70%] h-[100%] overflow-hidden">
          <img
            src={heroMainImage}
            alt="Woman showcasing Sister Storage jewelry organization solution"
            className="w-full h-full object-contain object-center"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Pink Content Section - Wipes in from left then grows vertically */}
        <div className="relative h-[90vh] flex items-center justify-start pt-0">
          <div className="bg-[hsl(var(--brand-pink))] flex items-center justify-end animate-[slide-left_1.2s_ease-out_forwards] w-full md:w-[60vw] lg:w-[55vw] overflow-hidden shadow-2xl rounded-r-[3rem]">
            <div className="w-full max-w-[600px] pr-0 pl-6 md:pl-8 lg:pl-12 py-8 md:py-12 lg:py-16">
              <div className="flex flex-col space-y-2 lg:space-y-3 text-white">
                {/* Badge */}
                <Badge 
                  variant="secondary" 
                  className="bg-white text-[hsl(var(--brand-pink))] px-4 py-2 text-sm font-bold w-fit rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Beautifully Organized
                </Badge>

                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tighter">
                  CULTURE /<br />
                  WITHOUT<br />
                  CLUTTER.
                </h1>

                {/* Main Tagline */}
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight uppercase">
                  BROUGHT TO YOU BY SISTERS<br />
                  WHO GET IT.
                </p>

                {/* CTA Button */}
                <div className="pt-1">
                  <Link to="/shop">
                    <Button 
                      size="lg"
                      className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-base px-6 py-4 w-fit shadow-2xl transition-all duration-300 rounded-full"
                    >
                      SHOP THE DROP
                    </Button>
                  </Link>
                </div>

                {/* Bottom Text */}
                <div className="pt-2 opacity-95">
                  <p className="text-base md:text-lg font-light leading-relaxed tracking-wide">
                    Made by sisters, for sisters.<br />
                    Clutter never had a place in our culture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
