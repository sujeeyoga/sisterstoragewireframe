import React from 'react';
import { EnhancedScrollFade } from '@/components/ui/enhanced-scroll-fade';
import { SisterStoriesCarousel } from './SisterStoriesCarousel';
import { CommunitySpacesCarousel } from './CommunitySpacesCarousel';
import { SisterLoveCarousel } from './SisterLoveCarousel';
import { JoinMovementCard } from './JoinMovementCard';

const CommunityStoriesCarousels = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/50">
      <div className="container-custom">
        <EnhancedScrollFade preset="medium" className="text-center mb-12 md:mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-primary font-medium text-sm">Community</span>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight">
              STYLED BY OUR
              <span className="block text-primary">SISTERS</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
              See how our community celebrates organizing with culture, color, and love. Real homes, real sisters, real style.
            </p>
          </div>
        </EnhancedScrollFade>

        <div className="space-y-16">
          <EnhancedScrollFade preset="subtle" delay={200}>
            <SisterStoriesCarousel />
          </EnhancedScrollFade>

          <EnhancedScrollFade preset="subtle" delay={400}>
            <CommunitySpacesCarousel />
          </EnhancedScrollFade>

          <EnhancedScrollFade preset="subtle" delay={600}>
            <SisterLoveCarousel />
          </EnhancedScrollFade>

          <EnhancedScrollFade preset="subtle" delay={800}>
            <JoinMovementCard />
          </EnhancedScrollFade>
        </div>
      </div>
    </section>
  );
};

export default CommunityStoriesCarousels;