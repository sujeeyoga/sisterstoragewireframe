import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroMainImage from '@/assets/hero-bg-main.jpg';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';

const Hero = () => {
  const { ref: parallaxRef, offset } = useOptimizedParallax({ speed: 0.5 });

  return (
    <section ref={parallaxRef} className="relative w-full overflow-hidden h-[70vh]" aria-label="Hero section">
      {/* Full Background Image with Parallax */}
      <div className="absolute inset-0 w-full h-[140%] -top-[20%]">
        <img
          src={heroMainImage}
          alt="Woman showcasing Sister Storage jewelry organization solution"
          className="w-full h-full object-cover"
          style={{ transform: `translateY(${offset}px)` }}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Pink Content Section - Wipes in from left then grows vertically */}
      <div className="relative h-[70vh] flex items-center justify-start pt-0">
        <div className="bg-[hsl(var(--brand-pink))] flex items-center justify-start animate-[slide-left_1.2s_ease-out,expand-up_1.2s_ease-out_forwards] w-full lg:w-1/2 overflow-hidden">
          <div className="w-full max-w-[550px] pl-[max(32px,calc((100vw-1100px)/2+32px))] pr-8 md:pr-12 lg:pr-12 py-12 lg:py-16">
            <div className="flex flex-col space-y-5 lg:space-y-7 text-white">
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
                BROUGHT TO YOU BY SISTERS WHO GET IT.
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
    </section>
  );
};

export default Hero;
