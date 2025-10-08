import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ShoppingBag, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const PromotionalSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--brand-pink)/0.05)] via-white to-[hsl(var(--brand-orange)/0.05)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--brand-pink)/0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--brand-orange)/0.08),transparent_50%)]" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-[hsl(var(--brand-pink))] text-white text-sm font-bold rounded-full mb-6 animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>BY SISTERS / FOR SISTERS</span>
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        {/* Hero Sale Section */}
        <div className="relative mb-12 md:mb-16">
          {/* Main Sale Card */}
          <div className="relative bg-gradient-to-br from-white via-[hsl(var(--brand-pink)/0.02)] to-[hsl(var(--brand-orange)/0.05)] rounded-3xl md:rounded-4xl overflow-hidden shadow-2xl border border-[hsl(var(--brand-pink)/0.1)] group hover:shadow-3xl transition-all duration-700">
            
            {/* Floating Elements */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-[hsl(var(--brand-orange)/0.1)] rounded-full animate-bounce delay-100" />
            <div className="absolute top-20 right-20 w-8 h-8 bg-[hsl(var(--brand-pink)/0.2)] rounded-full animate-pulse delay-300" />
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-[hsl(var(--brand-orange)/0.15)] rounded-full animate-bounce delay-500" />
            
            <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[500px]">
              {/* Text Content */}
              <div className="flex-1 flex flex-col justify-center p-8 md:p-12 lg:p-16 relative z-10">
                {/* Sale Badge */}
                <div className="inline-flex items-center space-x-2 px-6 py-3 bg-[hsl(var(--brand-pink))] text-white rounded-full mb-6 w-fit animate-fade-in">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-sm tracking-wide">LIMITED TIME</span>
                </div>
                
                {/* Main Heading */}
                <div className="mb-8">
                  <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-gray-900 leading-[0.85] mb-4 animate-fade-in animate-delay-200">
                    SISTERS<br />
                    <span className="text-[hsl(var(--brand-pink))] drop-shadow-sm">SUMMER</span><br />
                    <span className="text-[hsl(var(--brand-orange))] drop-shadow-sm">END</span><br />
                    <span className="bg-gradient-to-r from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))] bg-clip-text text-transparent animate-pulse">SALE!</span>
                  </h2>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="px-4 py-2 bg-[hsl(var(--brand-orange)/0.1)] text-[hsl(var(--brand-orange))] rounded-full">
                      <span className="font-bold text-2xl">20% OFF</span>
                    </div>
                    <div className="text-gray-600 text-lg">Everything Store-Wide</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-400">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))] hover:from-[hsl(var(--brand-pink))] hover:to-[hsl(var(--brand-pink))] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg font-bold"
                    asChild
                  >
                    <Link to="/shop" className="flex items-center space-x-3">
                      <ShoppingBag className="h-5 w-5" />
                      <span>SHOP NOW</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-[hsl(var(--brand-pink))] text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))] hover:text-white transition-all duration-300 px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link to="/about" className="flex items-center space-x-3">
                      <Heart className="h-5 w-5" />
                      <span>Our Story</span>
                    </Link>
                  </Button>
                </div>

                {/* Sale Details */}
                <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-[hsl(var(--brand-pink)/0.1)] animate-fade-in animate-delay-600">
                  <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[hsl(var(--brand-pink))] rounded-full animate-pulse" />
                      <span>Free shipping on orders $75+</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[hsl(var(--brand-orange))] rounded-full animate-pulse" />
                      <span>Ends September 30th</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image Section */}
              <div className="flex-1 relative min-h-[300px] lg:min-h-full p-8">
                <div className="relative h-full">
                  <img 
                    src="/lovable-uploads/ff4988e3-c51c-4391-a440-95e03d111656.png" 
                    alt="Sister Storage - organized jewelry collection in beautiful containers"
                    className="w-full h-full object-contain object-center drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Decorative glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--brand-pink)/0.1)] via-transparent to-transparent rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalSection;