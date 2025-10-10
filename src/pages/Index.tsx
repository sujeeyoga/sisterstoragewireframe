import { useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import Hero from "@/components/Hero";
import BestSeller from "@/components/BestSeller";
import ScreenLoader from "@/components/ui/ScreenLoader";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import FeaturedGrid from "@/components/FeaturedGrid";
import PromotionalSection from "@/components/PromotionalSection";

import ParallaxContainer from "@/components/ParallaxContainer";
import EnhancedScrollFade from "@/components/ui/enhanced-scroll-fade";
import { Button } from "@/components/ui/button";


const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <ScreenLoader onComplete={() => setIsLoading(false)} duration={3000} />;
  }

  return (
    <BaseLayout variant="standard" pageId="home">
      {/* Hero Section - No wrapper needed, has built-in spacing */}
      <Hero />
      
      {/* Parallax Transition - No additional spacing */}
      <ParallaxContainer />
      
      {/* Featured Grid - First major section after hero */}
      <Section spacing="xl" width="contained" background="white">
        <FeaturedGrid />
      </Section>
      
      {/* Buy Cards - Major product section */}
      <BestSeller />
      
      {/* Community Stories - Combined carousel section with testimonials */}
      <CommunityStoriesCarousels />
      
      <PromotionalSection />
    </BaseLayout>
  );
};

export default Index;
