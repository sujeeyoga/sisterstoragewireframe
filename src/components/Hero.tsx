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

      {/* Pink Content Section - Wipes in from left then grows vertically */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="bg-[hsl(var(--brand-pink))] min-h-screen flex items-center animate-[wipe-in-right_1.2s_ease-out,grow-vertical_2s_1.2s_ease-out_forwards] lg:max-w-[55%]">
          <div className="w-full max-w-[550px] pl-[max(32px,calc((100vw-1100px)/2+32px))] pr-8 md:pr-12 lg:pr-12 py-12 lg:py-16">
            <div className="flex flex-col space-y-8 lg:space-y-12 text-white">
              {/* Badge */}
              <Badge 
                variant="secondary" 
                className="bg-white text-[hsl(var(--brand-pink))] px-8 py-4 text-lg font-bold w-fit rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Beautifully Organized
              </Badge>

              {/* Headline */}
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black leading-[0.95] tracking-tight">
                CULTURE /<br />
                WITHOUT<br />
                CLUTTER.
              </h1>

              {/* Main Tagline */}
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight uppercase">
                BROUGHT TO YOU BY SISTERS WHO GET IT.
              </p>

              {/* CTA Button */}
              <div>
                <Link to="/shop">
                  <Button 
                    size="lg"
                    className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-xl px-12 py-8 w-fit shadow-xl transition-all duration-300"
                  >
                    SHOP THE DROP
                  </Button>
                </Link>
              </div>

              {/* Bottom Text */}
              <div className="pt-6">
                <p className="text-xl md:text-2xl font-light leading-relaxed">
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
