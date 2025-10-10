import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroMainImage from '@/assets/hero-bg-main.jpg';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden min-h-screen" aria-label="Hero section">
      {/* Full Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={heroMainImage}
          alt="Woman showcasing Sister Storage jewelry organization solution"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Pink Content Section - Wipes in from left */}
      <div className="relative min-h-screen flex items-center">
        <div className="bg-[hsl(var(--brand-pink))] animate-[wipe-in-right_1.2s_ease-out] lg:max-w-[55%]">
          <div className="w-full max-w-[550px] ml-auto pl-[max(20px,calc((100vw-1100px)/2+20px))] pr-8 md:pr-12 lg:pr-12 py-12 lg:py-16">
            <div className="flex flex-col space-y-6 lg:space-y-8 text-white">
              {/* Badge */}
              <Badge 
                variant="secondary" 
                className="bg-white text-[hsl(var(--brand-pink))] px-6 py-2.5 text-sm font-bold w-fit rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Beautifully Organized
              </Badge>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
                CULTURE /<br />
                WITHOUT<br />
                CLUTTER.
              </h1>

              {/* Main Tagline */}
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight uppercase">
                BROUGHT TO YOU BY SISTERS WHO GET IT.
              </p>

              {/* CTA Button */}
              <div>
                <Link to="/shop">
                  <Button 
                    size="lg"
                    className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-base px-8 py-6 w-fit shadow-xl transition-all duration-300"
                  >
                    SHOP THE DROP
                  </Button>
                </Link>
              </div>

              {/* Bottom Text */}
              <div className="pt-4">
                <p className="text-base md:text-lg font-light leading-relaxed">
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
