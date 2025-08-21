import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PromotionalSection = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/10 py-12 md:py-16 w-full">
        {/* Header */}
        <div className="text-center mb-12 px-4">
          <Badge variant="outline" className="mb-6 text-sm font-medium">
            BY SISTERS / FOR SISTERS
          </Badge>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full px-4 md:px-6">
          
          {/* Summer Sale Card - Large */}
          <div className="md:col-span-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl overflow-hidden min-h-[320px] relative">
            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              {/* Left: Text content */}
              <div className="flex flex-col justify-between h-full p-8 md:p-10">
                <h2 className="text-6xl font-bold text-foreground leading-tight mb-6">
                  SUMMER<br />
                  END<br />
                  <span className="text-primary">SALE!</span>
                </h2>
                <Button variant="default" size="lg" className="w-fit">
                  Shop Now
                </Button>
              </div>
              
              {/* Right: Image */}
              <div className="h-full">
                <img 
                  src="/lovable-uploads/ff4988e3-c51c-4391-a440-95e03d111656.png" 
                  alt="Woman holding ziplock bag with bangles"
                  className="w-full h-full object-contain object-center"
                />
              </div>
            </div>
          </div>

          {/* Product Demo Card */}
          <div className="md:col-span-3 bg-primary rounded-3xl p-8 text-white flex flex-col justify-center min-h-[320px] relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-lg mb-6 leading-relaxed">
                See how our storage solutions transform your jewelry organization
              </p>
              <Button variant="secondary" size="sm">
                Watch Demo
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-6 right-10 w-10 h-10 bg-white/20 rounded-full"></div>
          </div>

          {/* Storage Solutions Card */}
          <div className="md:col-span-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl p-8 text-white flex flex-col justify-center min-h-[320px]">
            <div className="bg-accent rounded-2xl p-6 mb-6 text-center">
              <h3 className="font-bold text-xl text-foreground mb-3">
                ZIP LOCK<br />BAGS?
              </h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                PLEASE SIS<br />
                <span className="text-foreground font-bold">YOUR<br />
                BANGLES<br />
                DESERVE<br />
                BETTER</span>
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-5 bg-primary rounded-3xl p-8 text-white flex items-center justify-center min-h-[240px]">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Complete Storage Solution</h3>
              <p className="mb-6 opacity-90 text-lg">Everything you need to organize your jewelry collection</p>
              <Button variant="secondary">
                View Collection
              </Button>
            </div>
          </div>

          {/* Starter Pack Grid */}
          <div className="md:col-span-7 grid grid-cols-3 gap-3">
            <div className="bg-primary rounded-2xl flex items-center justify-center min-h-[110px]">
              <span className="text-white font-bold text-sm">STARTER</span>
            </div>
            <div className="bg-secondary rounded-2xl flex items-center justify-center min-h-[110px]">
              <span className="text-white font-bold text-sm">PACK</span>
            </div>
            <div className="bg-accent/20 rounded-2xl min-h-[110px]"></div>
            <div className="bg-primary rounded-2xl min-h-[110px]"></div>
            <div className="bg-secondary rounded-2xl min-h-[110px]"></div>
            <div className="bg-accent/30 rounded-2xl min-h-[110px]"></div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 px-4">
          <p className="text-muted-foreground mb-6 text-lg">Join thousands of sisters who've transformed their jewelry storage</p>
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
  );
};

export default PromotionalSection;