import { SEO } from '@/components/SEO';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const features = [
  {
    title: 'Purpose-Built',
    description: 'Designed specifically for bangles, jewelry, keepsakes, and heirlooms.',
  },
  {
    title: 'Beautiful & Practical',
    description: 'Clean, elegant designs that feel good to open and easy to store.',
  },
  {
    title: 'Culture-First',
    description: 'Made with intention — honoring traditions without adding clutter.',
  },
];

const Culture = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BaseLayout>
      <SEO 
        title="Culture, Not Clutter | Sister Storage - Celebrating South Asian Heritage"
        description="Thoughtfully designed storage that protects tradition, not mess. Sister Storage honors South Asian culture with purpose-built bangle and jewelry organizers."
        url="/culture"
      />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
          {/* Paisley Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-8 0-15 7-15 15s7 15 15 15c5 0 10-3 12-7 1-2 3-3 5-3 3 0 5 2 5 5 0 1 0 2-1 3-4 7-12 12-21 12-14 0-25-11-25-25S16 0 30 0c9 0 17 5 21 12 1 1 1 2 1 3 0 3-2 5-5 5-2 0-4-1-5-3-2-4-7-7-12-7z' fill='%23ffffff' fill-opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: '120px 120px',
            }}
          />
          
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-0 max-w-4xl w-full">
              {/* Side Decorative Strip - Hidden on mobile */}
              <div 
                className="hidden md:block rounded-l-lg"
                style={{
                  backgroundImage: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 50%, hsl(var(--primary)) 100%)',
                  backgroundSize: 'cover',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Decorative vertical pattern */}
                <div 
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='80' viewBox='0 0 40 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0c-6 0-12 5-12 12s6 12 12 12c4 0 8-2 10-6 1-1 2-2 4-2 2 0 4 2 4 4 0 1 0 2-1 2-3 6-10 10-17 10-11 0-20-9-20-20S9 0 20 0c7 0 13 4 17 10 1 0 1 1 1 2 0 2-2 4-4 4-2 0-3-1-4-2-2-4-6-6-10-6z' fill='%23ffffff' fill-opacity='0.5'/%3E%3Cpath d='M20 40c-6 0-12 5-12 12s6 12 12 12c4 0 8-2 10-6 1-1 2-2 4-2 2 0 4 2 4 4 0 1 0 2-1 2-3 6-10 10-17 10-11 0-20-9-20-20s9-20 20-20c7 0 13 4 17 10 1 0 1 1 1 2 0 2-2 4-4 4-2 0-3-1-4-2-2-4-6-6-10-6z' fill='%23ffffff' fill-opacity='0.5'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'repeat-y',
                    backgroundSize: '40px auto',
                    backgroundPosition: 'center',
                  }}
                />
              </div>
              
              {/* Content Box */}
              <div className="bg-background border-4 border-primary p-8 md:p-12 lg:p-16">
                <h1 className="mb-2">
                  <span className="font-script text-primary text-5xl md:text-6xl lg:text-7xl block leading-tight">
                    Culture,
                  </span>
                  <span className="text-primary text-2xl md:text-3xl lg:text-4xl font-semibold uppercase tracking-wider block mt-1">
                    without clutter.
                  </span>
                </h1>
                
                <p className="text-muted-foreground text-lg md:text-xl mt-6 mb-8 max-w-lg">
                  Thoughtfully designed storage that protects tradition, not mess.
                </p>
                
                <Button asChild size="lg" className="px-8">
                  <Link to="/shop">Shop the Collection</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        </section>

        {/* Features Carousel Section */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="border-2 border-primary rounded-lg overflow-hidden">
                <div className="relative h-48 md:h-56">
                  {features.map((feature, index) => (
                    <div
                      key={feature.title}
                      className={`absolute inset-0 flex flex-col items-center justify-center text-center p-8 transition-all duration-500 ${
                        index === activeFeature 
                          ? 'opacity-100 translate-x-0' 
                          : index < activeFeature 
                            ? 'opacity-0 -translate-x-full' 
                            : 'opacity-0 translate-x-full'
                      }`}
                    >
                      <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-lg max-w-md">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 pb-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveFeature(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeFeature 
                          ? 'bg-primary w-6' 
                          : 'bg-primary/30 hover:bg-primary/50'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Sister Storage Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
                Why Sister Storage?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                We believe storage should feel personal, respectful, and empowering.
                Sister Storage was created to help women protect what matters — without
                compromising beauty or culture.
              </p>
            </div>
          </div>
        </section>
      </div>
    </BaseLayout>
  );
};

export default Culture;
