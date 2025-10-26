import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroMainImage from '@/assets/hero-bg-main.jpg';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';
import { Skeleton } from '@/components/ui/skeleton';

const Hero = () => {
  const { ref: parallaxRef, offset } = useOptimizedParallax({ speed: 0.15 });
  const { texts, isLoading } = useSiteTexts('homepage_hero');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Default fallback text to show immediately while loading
  const defaultText: any = {
    id: 'default',
    title: 'SISTER STORAGE',
    subtitle: 'JEWELRY ORGANIZATION',
    button_text: 'SHOP NOW',
    description: 'The perfect solution for organizing your jewelry collection'
  };
  
  // Get first text or use default
  const heroText: any = (Array.isArray(texts) && texts.length > 0 ? texts[0] : texts) || defaultText;

  return (
    <section ref={parallaxRef} className="relative w-full overflow-hidden md:pt-8" aria-label="Hero section">
      {/* Mobile: Stacked Layout */}
      <div className="md:hidden flex flex-col relative z-10">
        {/* Hero Content Container */}
        <div className="w-full bg-[hsl(var(--brand-pink))] pt-56 pb-12 px-6">
          <div 
            className="flex flex-col space-y-3 text-white w-full max-w-full"
            style={{ transform: `translateY(${-offset * 0.1}px)` }}
          >
            <EditableText
              siteTextId={heroText.id}
              field="title"
              value={heroText.title}
              as="h1"
              className="text-[3.5rem] sm:text-[4.5rem] font-black leading-[1.1] tracking-tighter break-words"
            />

            <EditableText
              siteTextId={heroText.id}
              field="subtitle"
              value={heroText.subtitle}
              as="p"
              className="text-xl sm:text-2xl md:text-3xl font-bold leading-[1.1] tracking-tight uppercase break-words"
            />

            <div className="pt-8 sm:pt-12">
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-base sm:text-lg px-6 py-4 w-fit shadow-2xl transition-all duration-300 rounded-full"
                >
                  <EditableText
                    siteTextId={heroText.id}
                    field="button_text"
                    value={heroText.button_text}
                    as="span"
                  />
                </Button>
              </Link>
            </div>

            <div className="pt-2 opacity-95">
              <EditableText
                siteTextId={heroText.id}
                field="description"
                value={heroText.description}
                as="p"
                className="text-base sm:text-lg font-light leading-relaxed tracking-wide break-words"
              />
            </div>
          </div>
        </div>

        {/* Hero Image Container */}
        <div className="w-full h-[67vh] overflow-hidden bg-[hsl(var(--brand-pink))] relative">
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 bg-white/20" />
          )}
          <div 
            className="w-full h-full" 
            style={{ transform: `translateY(${-offset * 0.2}px)` }}
          >
            <img
              src={heroMainImage}
              alt="Woman showcasing Sister Storage jewelry organization solution"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>

      {/* Desktop: Overlay Layout */}
      <div className="hidden md:block relative min-h-screen overflow-hidden">
        {/* Pink Loading Background Layer (slides from left, fastest) */}
        <div 
          className="absolute inset-0 z-0 bg-[hsl(var(--brand-pink))] animate-slide-in-left"
          style={{ animationDelay: '0.1s', animationDuration: '0.8s' }}
        />
        
        {/* Background Layer: Hero Image (fades in with delay) */}
        <div 
          className="absolute inset-0 z-0 animate-fade-in"
          style={{ animationDelay: '1.1s', opacity: '0', animationFillMode: 'forwards' }}
        >
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 bg-white/20" />
          )}
          <div 
            className="w-full h-full"
            style={{ transform: `translateY(${offset * 0.05}px)` }}
          >
            <img
              src={heroMainImage}
              alt="Woman showcasing Sister Storage jewelry organization solution"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* Foreground Layer: Pink Content Section (slides from left) */}
        <div className="relative z-10 min-h-screen flex items-center justify-start pt-0">
          <div className="bg-[hsl(var(--brand-pink))] flex items-center animate-slide-in-left w-full md:w-[60vw] lg:w-[55vw] shadow-2xl rounded-r-[3rem]" style={{ animationDelay: '0.3s' }}>
            <div className="grid grid-cols-2 w-full py-4 md:py-6 lg:py-8">
              <div className="col-span-1"></div>
              
              <div className="col-span-1 pr-2 md:pr-3 lg:pr-4 pt-8 md:pt-12 lg:pt-16">
                <div className="flex flex-col gap-2 lg:gap-3 text-white">
                  <EditableText
                    siteTextId={heroText.id}
                    field="title"
                    value={heroText.title}
                    as="h1"
                    className="text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-[0.9] tracking-tighter"
                  />

                  <EditableText
                    siteTextId={heroText.id}
                    field="subtitle"
                    value={heroText.subtitle}
                    as="p"
                    className="text-xs md:text-sm lg:text-base xl:text-lg font-bold leading-tight tracking-tight uppercase"
                  />

                  <div className="pt-1">
                    <Link to="/shop">
                      <Button 
                        size="sm"
                        className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/90 hover:scale-105 font-bold text-[10px] md:text-xs px-4 py-2 w-fit shadow-2xl transition-all duration-300 rounded-full"
                      >
                        <EditableText
                          siteTextId={heroText.id}
                          field="button_text"
                          value={heroText.button_text}
                          as="span"
                        />
                      </Button>
                    </Link>
                  </div>

                  <div className="pt-0.5 opacity-90">
                    <EditableText
                      siteTextId={heroText.id}
                      field="description"
                      value={heroText.description}
                      as="p"
                      className="text-[10px] md:text-xs lg:text-sm font-light leading-relaxed tracking-wide"
                    />
                  </div>
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
