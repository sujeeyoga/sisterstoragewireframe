
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import Hero from "@/components/Hero";
import BestSeller from "@/components/BestSeller";

import About from "@/components/About";
import Delivery from "@/components/Delivery";
import Newsletter from "@/components/Newsletter";
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
      <Section spacing="xl" width="contained">
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
      
      
      {/* Newsletter - Email capture */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained" background="white">
          <Newsletter />
        </Section>
      </EnhancedScrollFade>
      
      {/* Promotional Section - Summer Sale & Storage Solutions */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <PromotionalSection />
      </EnhancedScrollFade>
      
      {/* Delivery - Final service details */}
      <EnhancedScrollFade preset="subtle" once={true}>
        <Section spacing="md" width="contained" background="white" id="delivery">
          <Delivery />
        </Section>
      </EnhancedScrollFade>
    </BaseLayout>
  );
};

export default Index;
