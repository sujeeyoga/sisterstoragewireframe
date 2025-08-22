import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PromotionalSection = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/10 py-12 md:py-16 w-full">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <Badge variant="outline" className="mb-4 text-sm font-medium">
            BY SISTERS / FOR SISTERS
          </Badge>
        </div>

        {/* Mobile-First Stack Layout */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* Summer Sale Card - Hero */}
          <div className="bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl md:rounded-3xl overflow-hidden relative">
            <div className="flex flex-col md:flex-row min-h-[280px] md:min-h-[320px]">
              {/* Text content */}
              <div className="flex-1 flex flex-col justify-center p-6 md:p-8 lg:p-10">
                <h2 className="text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-foreground leading-none mb-4 md:mb-6">
                  SUMMER<br />
                  END<br />
                  <span className="text-primary">SALE!</span>
                </h2>
                <Button variant="default" size="lg" className="w-fit">
                  Shop Now
                </Button>
              </div>
              
              {/* Image */}
              <div className="flex-1 min-h-[200px] md:min-h-full">
                <img 
                  src="/lovable-uploads/ff4988e3-c51c-4391-a440-95e03d111656.png" 
                  alt="Woman holding ziplock bag with bangles"
                  className="w-full h-full object-contain object-center drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Two Column Cards on Desktop, Stack on Mobile */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Product Demo Card */}
            <div className="flex-1 bg-primary rounded-2xl md:rounded-3xl p-6 md:p-8 text-white min-h-[240px] md:min-h-[280px] flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Watch Our Demo</h3>
                <p className="text-sm md:text-base mb-4 md:mb-6 leading-relaxed opacity-90">
                  See how our storage solutions transform your jewelry organization
                </p>
                <Button variant="secondary" size="sm">
                  Watch Demo
                </Button>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 md:w-20 md:h-20 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-4 right-6 md:bottom-6 md:right-10 w-6 h-6 md:w-10 md:h-10 bg-white/20 rounded-full"></div>
            </div>

            {/* Storage Solutions Card */}
            <div className="flex-1 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl md:rounded-3xl p-6 md:p-8 text-white min-h-[240px] md:min-h-[280px] flex flex-col justify-center">
              <div className="bg-accent rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                <h3 className="font-bold text-lg md:text-xl text-foreground mb-2 md:mb-3">
                  ZIP LOCK BAGS?
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground font-medium leading-relaxed">
                  PLEASE SIS<br />
                  <span className="text-foreground font-bold">YOUR BANGLES<br />
                  DESERVE BETTER</span>
                </p>
              </div>
            </div>
          </div>

          {/* Complete Storage Solution Card */}
          <div className="bg-primary rounded-2xl md:rounded-3xl p-6 md:p-8 text-white min-h-[200px] md:min-h-[240px] flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-6">Complete Storage Solution</h3>
              <p className="mb-4 md:mb-6 opacity-90 text-sm md:text-lg">Everything you need to organize your jewelry collection</p>
              <Button variant="secondary">
                View Collection
              </Button>
            </div>
          </div>

          {/* Starter Pack Visual Grid */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl md:rounded-3xl p-6 md:p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Starter Pack Collection</h3>
              <p className="text-sm text-muted-foreground">Perfect for beginners</p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="bg-primary rounded-xl md:rounded-2xl flex items-center justify-center h-16 md:h-20">
                <span className="text-white font-bold text-xs md:text-sm">STARTER</span>
              </div>
              <div className="bg-secondary rounded-xl md:rounded-2xl flex items-center justify-center h-16 md:h-20">
                <span className="text-white font-bold text-xs md:text-sm">PACK</span>
              </div>
              <div className="bg-accent/20 rounded-xl md:rounded-2xl h-16 md:h-20"></div>
              <div className="bg-primary/80 rounded-xl md:rounded-2xl h-16 md:h-20"></div>
              <div className="bg-secondary/80 rounded-xl md:rounded-2xl h-16 md:h-20"></div>
              <div className="bg-accent/30 rounded-xl md:rounded-2xl h-16 md:h-20"></div>
            </div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-muted-foreground mb-6 text-base md:text-lg">Join thousands of sisters who've transformed their jewelry storage</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default">
              Start Organizing
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalSection;