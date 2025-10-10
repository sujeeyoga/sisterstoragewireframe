import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroMainImage from '@/assets/hero-main-32rem.jpg';

const Hero = () => {
  return (
    <section className="relative w-full bg-[hsl(var(--brand-pink))]" aria-label="Hero section">
      <div className="w-[min(1100px,calc(100%-40px))] mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 min-h-[80vh] lg:min-h-[90vh] items-center py-12 lg:py-16">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 lg:space-y-8 text-white px-4">
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
              CLUTTER
            </h1>

            {/* Tagline */}
            <p className="text-lg md:text-xl lg:text-2xl font-light max-w-xl leading-relaxed">
              Made by sisters, for sisters. Clutter never had a place in our culture.
            </p>

            {/* CTA Button */}
            <Link to="/shop">
              <Button 
                size="lg"
                className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-base px-8 py-6 w-fit shadow-xl transition-all duration-300"
              >
                SHOP THE DROP
              </Button>
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full h-full min-h-[50vh] lg:min-h-[90vh]">
              <img
                src={heroMainImage}
                alt="Woman showcasing Sister Storage jewelry organization solution"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
