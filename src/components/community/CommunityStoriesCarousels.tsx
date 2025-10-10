import React from 'react';
import { SisterStoriesCarousel } from './SisterStoriesCarousel';

const CommunityStoriesCarousels = () => {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background to-background/50 overflow-x-hidden">
      {/* Simple Header */}
      <div className="container-custom text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
          <span className="w-2 h-2 bg-primary rounded-full"></span>
          <span className="text-primary font-medium text-sm">Community</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          STYLED BY OUR <span className="text-primary">SISTERS</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Real sisters sharing their organization journeys
        </p>
      </div>

      {/* Sister Stories Carousel */}
      <SisterStoriesCarousel />
    </section>
  );
};

export default CommunityStoriesCarousels;