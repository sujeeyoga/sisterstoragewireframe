import { SEO } from '@/components/SEO';
import BaseLayout from '@/components/layout/BaseLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import cultureHeroSide from '@/assets/culture-hero-side.png';
import sisNeededThisProduct from '@/assets/sis-needed-this-product.png';
import { useOptimizedParallax } from '@/hooks/use-optimized-parallax';
import { useScrollProgress } from '@/hooks/use-scroll-progress';
import { usePageContent } from '@/hooks/usePageContent';

const Culture = () => {
  const { content, isLoading, getSection, getSections } = usePageContent('culture');
  const [activeFeature, setActiveFeature] = useState(0);
  const { ref: parallaxRef, offset } = useOptimizedParallax({ speed: 0.3 });
  const scrollRef = useScrollProgress();

  // Get feature sections from database
  const features = getSections('feature_').filter((f) => f.enabled);
  const hero = getSection('hero');
  const whySection = getSection('why_section');

  useEffect(() => {
    if (features.length === 0) return;
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <BaseLayout>
      <SEO
        title="Culture, Not Clutter | Sister Storage - Celebrating South Asian Heritage"
        description="Thoughtfully designed storage that protects tradition, not mess. Sister Storage honors South Asian culture with purpose-built bangle and jewelry organizers."
        url="/culture"
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          className="relative py-16 md:py-24 overflow-hidden"
          style={{ backgroundColor: '#ff0077' }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${cultureHeroSide})`,
              backgroundSize: '300px auto',
              backgroundPosition: 'center',
              backgroundRepeat: 'repeat',
              backgroundAttachment: 'scroll',
              filter: 'brightness(0) blur(1px)',
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #ff0077)' }} />
          <div className="absolute top-0 bottom-0 left-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(to right, #ff0077, transparent)' }} />
          <div className="absolute top-0 bottom-0 right-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(to left, #ff0077, transparent)' }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-center">
              <div className="max-w-4xl w-full">
                <div className="bg-background border-4 border-primary p-8 md:p-12 lg:p-16 rounded-lg">
                  <h1 className="mb-2">
                    <span
                      className="text-5xl md:text-6xl lg:text-7xl block leading-tight"
                      style={{ fontFamily: 'Regards, cursive', color: '#ff0077' }}
                    >
                      {hero?.title || 'Culture,'}
                    </span>
                    <span
                      className="text-2xl md:text-3xl lg:text-4xl font-semibold uppercase tracking-wider block mt-1"
                      style={{ color: '#ff0077' }}
                    >
                      {hero?.subtitle || 'without clutter.'}
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-lg md:text-xl mt-6 mb-8 max-w-lg">
                    {hero?.description || 'We Got you SIs'}
                  </p>
                  <Button asChild size="lg" className="px-8">
                    <Link to="/shop">{hero?.button_text || 'Shop the Collection'}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Carousel Section */}
        {features.length > 0 && (
          <section className="py-16 md:py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                <div className="border-2 border-primary rounded-lg overflow-hidden">
                  <div className="relative min-h-[500px] md:min-h-[650px]">
                    {features.map((feature, index) => (
                      <div
                        key={feature.id}
                        className={`absolute inset-0 flex flex-col md:flex-row items-center justify-center gap-8 p-8 transition-all duration-500 ${
                          index === activeFeature
                            ? 'opacity-100 translate-x-0'
                            : index < activeFeature
                            ? 'opacity-0 -translate-x-full'
                            : 'opacity-0 translate-x-full'
                        }`}
                      >
                        <div className="w-[200px] h-[300px] md:w-[400px] md:h-[600px] bg-muted rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-border">
                          {feature.video_url ? (
                            <video
                              src={feature.video_url}
                              className="w-full h-full object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <div className="text-muted-foreground text-center p-4">
                              <div className="text-4xl mb-2">🎬</div>
                              <p className="text-sm">Video placeholder</p>
                            </div>
                          )}
                        </div>
                        <div className="text-center md:text-left max-w-md">
                          <h3 className="text-2xl md:text-3xl font-semibold text-primary mb-3">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground text-lg">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 pb-6">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveFeature(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeFeature ? 'bg-primary w-6' : 'bg-primary/30 hover:bg-primary/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Elevator Culture Split Section */}
        <section className="py-8 md:py-12 bg-[#ff0077] overflow-hidden">
          <div ref={scrollRef} className="mx-auto max-w-5xl grid grid-cols-2 gap-1 px-4">
            <div className="elevator-left text-right">
              <span className="text-white text-4xl md:text-6xl lg:text-7xl" style={{ fontFamily: 'Regards, cursive' }}>
                Culture
              </span>
            </div>
            <div className="elevator-right text-left">
              <span className="text-white text-4xl md:text-6xl lg:text-7xl" style={{ fontFamily: 'Regards, cursive' }}>
                Culture
              </span>
            </div>
          </div>
        </section>

        {/* Why Sister Storage Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-6">
                {whySection?.title || 'Why Sister Storage?'}
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {whySection?.description ||
                  'We believe storage should feel personal, respectful, and empowering. Sister Storage was created to help women protect what matters — without compromising beauty or culture.'}
              </p>
            </div>
          </div>
        </section>

        {/* Sis, You Needed This Section */}
        <section className="relative overflow-hidden">
          <div className="flex h-full">
            <div className="flex-1 relative py-12 md:py-16 px-8 md:px-16 flex items-center" style={{ backgroundColor: '#E86A33' }}>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${cultureHeroSide})`, backgroundSize: '400px auto', backgroundPosition: 'center', backgroundRepeat: 'repeat' }} />
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-white">
                  <span className="text-5xl md:text-7xl lg:text-8xl block leading-tight" style={{ fontFamily: 'Regards, cursive' }}>Sis,</span>
                  <span className="text-2xl md:text-4xl lg:text-5xl font-semibold uppercase tracking-wide block mt-2">
                    YOU <span className="italic font-normal">NEEDED</span> THIS.
                  </span>
                </h2>
              </div>
            </div>
            <div ref={parallaxRef} className="hidden md:block w-[27rem] lg:w-[30rem] flex-shrink-0 relative">
              <img
                src={sisNeededThisProduct}
                alt="Sister Storage bangle box with beautiful henna hands design"
                className="w-full h-auto object-cover object-center will-change-transform"
                style={{ transform: `translateY(${-offset * 0.1}px)` }}
              />
            </div>
            <div className="hidden md:flex w-16 lg:w-20 flex-shrink-0 flex-col items-center justify-start py-8" style={{ backgroundColor: '#ff0077' }}>
              <span className="text-white text-xl lg:text-2xl font-bold tracking-wider" style={{ fontFamily: 'Regards, cursive' }}>SS</span>
            </div>
          </div>
        </section>
      </div>
    </BaseLayout>
  );
};

export default Culture;
