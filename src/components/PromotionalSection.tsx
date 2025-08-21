import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PromotionalSection = () => {
  return (
    <div className="bg-gradient-to-br from-primary/5 to-secondary/10 py-8 md:py-12 w-full">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <Badge variant="outline" className="mb-4 text-sm font-medium">
            BY SISTERS / FOR SISTERS
          </Badge>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-7xl mx-auto px-4">
          
          {/* Summer Sale Card - Large */}
          <div className="md:col-span-5 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl p-8 flex flex-col justify-center min-h-[300px]">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-4">
              SUMMER<br />
              END<br />
              <span className="text-primary">SALE!</span>
            </h2>
            <Button variant="default" size="lg" className="w-fit">
              Shop Now
            </Button>
          </div>

          {/* Product Demo Card */}
          <div className="md:col-span-4 bg-primary rounded-2xl p-6 text-white flex flex-col justify-center min-h-[300px] relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-lg mb-4 leading-relaxed">
                See how our storage solutions transform your jewelry organization
              </p>
              <Button variant="secondary" size="sm">
                Watch Demo
              </Button>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-4 right-8 w-8 h-8 bg-white/20 rounded-full"></div>
          </div>

          {/* Storage Solutions Card */}
          <div className="md:col-span-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-white flex flex-col justify-center min-h-[300px]">
            <div className="bg-accent rounded-xl p-4 mb-4 text-center">
              <h3 className="font-bold text-lg text-foreground mb-2">
                ZIP LOCK<br />BAGS?
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                PLEASE SIS<br />
                <span className="text-foreground font-bold">YOUR<br />
                BANGLES<br />
                DESERVE<br />
                BETTER</span>
              </p>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="md:col-span-5 bg-primary rounded-2xl p-6 text-white flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Complete Storage Solution</h3>
              <p className="mb-4 opacity-90">Everything you need to organize your jewelry collection</p>
              <Button variant="secondary">
                View Collection
              </Button>
            </div>
          </div>

          {/* Starter Pack Grid */}
          <div className="md:col-span-7 grid grid-cols-3 gap-2">
            <div className="bg-primary rounded-xl flex items-center justify-center min-h-[90px]">
              <span className="text-white font-bold text-sm">STARTER</span>
            </div>
            <div className="bg-secondary rounded-xl flex items-center justify-center min-h-[90px]">
              <span className="text-white font-bold text-sm">PACK</span>
            </div>
            <div className="bg-accent/20 rounded-xl"></div>
            <div className="bg-primary rounded-xl"></div>
            <div className="bg-secondary rounded-xl"></div>
            <div className="bg-accent/30 rounded-xl"></div>
          </div>

        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 px-4">
          <p className="text-muted-foreground mb-4">Join thousands of sisters who've transformed their jewelry storage</p>
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