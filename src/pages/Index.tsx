
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import Hero from "@/components/Hero";
import BestSeller from "@/components/BestSeller";
import StorySection from "@/components/hero/StorySection";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Delivery from "@/components/Delivery";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import InstagramUGC from "@/components/InstagramUGC";
import FeaturedGrid from "@/components/FeaturedGrid";

import ParallaxContainer from "@/components/ParallaxContainer";
import EnhancedScrollFade from "@/components/ui/enhanced-scroll-fade";

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
      
      {/* Story Section - Visual storytelling */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="full">
          <StorySection />
        </Section>
      </EnhancedScrollFade>
      
      {/* How It Works - Process explanation */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained" background="white">
          <HowItWorks />
        </Section>
      </EnhancedScrollFade>
      
      {/* About Section - Brand story */}
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <Section spacing="lg" width="contained" background="gray">
          <About />
        </Section>
      </EnhancedScrollFade>
      
      {/* Testimonials - Social proof */}
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained" background="white">
          <Testimonials />
        </Section>
      </EnhancedScrollFade>
      
      {/* Instagram UGC - Social media integration */}
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <Section spacing="lg" width="full">
          <InstagramUGC />
        </Section>
      </EnhancedScrollFade>
      
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
