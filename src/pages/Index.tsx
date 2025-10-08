
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import Hero from "@/components/Hero";
import BestSeller from "@/components/BestSeller";

import About from "@/components/About";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import FeaturedGrid from "@/components/FeaturedGrid";
import PromotionalSection from "@/components/PromotionalSection";

import ParallaxContainer from "@/components/ParallaxContainer";
import EnhancedScrollFade from "@/components/ui/enhanced-scroll-fade";
import { Button } from "@/components/ui/button";


const Index = () => {
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
      
      {/* About Section - Brand story */}
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <Section spacing="lg" width="contained" background="gray">
          <About />
        </Section>
      </EnhancedScrollFade>
      
      {/* Community Stories - Combined carousel section with testimonials */}
      <CommunityStoriesCarousels />
      
      {/* Promotional Section - Summer Sale & Storage Solutions */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <PromotionalSection />
      </EnhancedScrollFade>
    </BaseLayout>
  );
};

export default Index;
