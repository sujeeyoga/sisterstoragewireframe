import React from 'react';
import { SisterStoriesCarousel } from './SisterStoriesCarousel';

const CommunityStoriesCarousels = () => {
  return (
    <section className="py-12 md:py-16 bg-[hsl(var(--brand-gray))] overflow-x-hidden">
      {/* Header */}
      <div className="container-custom text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
          STYLED BY OUR <span className="text-[hsl(var(--brand-pink))]">SISTERS</span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          See how real sisters organize their jewelry
        </p>
      </div>

      {/* Sister Stories Carousel */}
      <SisterStoriesCarousel />
    </section>
  );
};

export default CommunityStoriesCarousels;