import React from 'react';
import { SisterStoriesCarousel } from './SisterStoriesCarousel';

const CommunityStoriesCarousels = () => {
  return (
    <section className="mt-0 py-12 md:py-16 bg-[#F10781] overflow-x-hidden relative z-10">
      {/* Header */}
      <div className="container-custom text-center mb-12">
        <h2 className="text-3xl md:text-4xl lg:text-6xl font-black mb-6 text-foreground tracking-wide">
          STYLED BY OUR <span className="text-[hsl(var(--brand-pink))] text-5xl md:text-6xl lg:text-7xl">SISTERS</span>
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          See how real sisters organize their jewelry
        </p>
      </div>

      {/* Sister Stories Carousel */}
      <SisterStoriesCarousel />
    </section>
  );
};

export default CommunityStoriesCarousels;