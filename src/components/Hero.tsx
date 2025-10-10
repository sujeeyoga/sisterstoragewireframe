import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroMainImage from '@/assets/hero-main-32rem.jpg';

const Hero = () => {
  return (
    <section className="relative w-full bg-[hsl(var(--brand-pink))] overflow-hidden" aria-label="Hero section">
      <div className="relative grid lg:grid-cols-2 gap-0 min-h-screen lg:min-h-screen">
        {/* Left Content - Contained */}
        <div className="flex items-center">
          <div className="w-full max-w-[550px] ml-auto px-8 md:px-12 lg:px-0 lg:pr-12 py-12 lg:py-16">
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

        {/* Right Image - Full Width Background */}
        <div className="relative h-screen w-full bg-gray-100">
          <img
            src={heroMainImage}
            alt="Woman showcasing Sister Storage jewelry organization solution"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
