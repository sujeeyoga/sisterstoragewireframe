import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import heroMainImage from '@/assets/hero-bg-main.jpg';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useSiteTexts } from '@/hooks/useSiteTexts';
import { EditableText } from '@/components/admin/EditableText';
import { EditableImage } from '@/components/admin/EditableImage';

const Hero = () => {
  const { ref: parallaxRef, offset } = useOptimizedParallax({ speed: 0.15 });
  const { texts, isLoading } = useSiteTexts('homepage_hero');
  
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
    <section ref={parallaxRef} className="relative w-full overflow-hidden md:pt-32" aria-label="Hero section">
      {/* Mobile: Stacked Layout */}
      <div className="md:hidden flex flex-col">
        <div className="bg-[hsl(var(--brand-pink))] pt-40 pb-16 px-4 h-[75vh] flex items-center">
          <div 
            className="flex flex-col space-y-3 text-white pt-54"
            style={{ transform: `translateY(${-offset * 0.1}px)` }}
          >
            <EditableText
              siteTextId={heroText.id}
              field="title"
              value={heroText.title}
              as="h1"
              className="text-[6rem] font-black leading-[0.9] tracking-tighter"
            />

            <EditableText
              siteTextId={heroText.id}
              field="subtitle"
              value={heroText.subtitle}
              as="p"
              className="text-3xl font-bold leading-[1.1] tracking-tight uppercase"
            />

            <div className="pt-12">
              <Link to="/shop">
                <Button 
                  size="lg"
                  className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/95 hover:scale-105 font-bold text-lg px-6 py-4 w-fit shadow-2xl transition-all duration-300 rounded-full"
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
                className="text-lg font-light leading-relaxed tracking-wide"
              />
            </div>
          </div>
        </div>

        <div className="w-full h-[90vh] overflow-hidden bg-[hsl(var(--brand-pink))]">
          <div className="w-full h-full" style={{ transform: `translateY(${-offset * 0.15}px)` }}>
            <img
              src={heroMainImage}
              alt="Woman showcasing Sister Storage jewelry organization solution"
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Desktop: Overlapping Layout */}
      <div className="hidden md:block">
        {/* Background Image */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[70%] h-[100%] overflow-hidden animate-[slide-in-right_1.2s_ease-out]"
          style={{ transform: `translateY(calc(-50% + ${offset * 0.15}px))` }}
        >
          <img
            src={heroMainImage}
            alt="Woman showcasing Sister Storage jewelry organization solution"
            className="w-full h-full object-contain object-right"
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Pink Content Section */}
        <div className="relative h-[90vh] flex items-center justify-start pt-0">
          <div className="bg-[hsl(var(--brand-pink))] flex items-center animate-slide-in-right w-full md:w-[60vw] lg:w-[55vw] overflow-hidden shadow-2xl rounded-r-[3rem]">
            <div className="grid grid-cols-2 w-full py-4 md:py-6 lg:py-8">
              <div className="col-span-1"></div>
              
              <div className="col-span-1 pr-2 md:pr-3 lg:pr-4 pt-8 md:pt-12 lg:pt-16">
                <div className="flex flex-col gap-2 lg:gap-3 text-white">
                  <EditableText
                    siteTextId={heroText.id}
                    field="title"
                    value={heroText.title}
                    as="h1"
                    className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] tracking-tighter"
                  />

                  <EditableText
                    siteTextId={heroText.id}
                    field="subtitle"
                    value={heroText.subtitle}
                    as="p"
                    className="text-sm md:text-base lg:text-xl xl:text-2xl font-bold leading-tight tracking-tight uppercase"
                  />

                  <div className="pt-1">
                    <Link to="/shop">
                      <Button 
                        size="sm"
                        className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/90 hover:scale-105 font-bold text-xs md:text-sm px-5 py-3 w-fit shadow-2xl transition-all duration-300 rounded-full"
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
                      className="text-xs md:text-sm lg:text-base font-light leading-relaxed tracking-wide"
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
