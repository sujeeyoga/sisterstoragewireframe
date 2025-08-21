
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import Hero from "@/components/Hero";
import BestSeller from "@/components/BestSeller";

import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Delivery from "@/components/Delivery";
import Newsletter from "@/components/Newsletter";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import FeaturedGrid from "@/components/FeaturedGrid";

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
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="xl" width="contained">
          <FeaturedGrid />
        </Section>
      </EnhancedScrollFade>
      
      {/* Buy Cards - Major product section */}
      <EnhancedScrollFade preset="medium" once={true}>
        <Section spacing="lg" width="full">
          <BestSeller />
        </Section>
      </EnhancedScrollFade>
      
      
      {/* How It Works - Process explanation */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained" background="white">
          <HowItWorks />
        </Section>
      </EnhancedScrollFade>

      {/* Our Story CTA - Pink button on white */}
      <EnhancedScrollFade preset="subtle" delay={0.05} once={true}>
        <Section spacing="md" width="contained" background="white">
          <div className="w-full flex items-center justify-center">
            <Button variant="pink" size="lg" asChild aria-label="Read Our Story">
              <a href="/our-story">Our Story</a>
            </Button>
          </div>
        </Section>
      </EnhancedScrollFade>
      
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
