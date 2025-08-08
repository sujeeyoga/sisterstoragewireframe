
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
import StyledBySisters from "@/components/StyledBySisters";
import ParallaxContainer from "@/components/ParallaxContainer";
import EnhancedScrollFade from "@/components/ui/enhanced-scroll-fade";

const Index = () => {
  return (
    <BaseLayout variant="standard" pageId="home">
      <Hero />
      
      <ParallaxContainer />
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <FeaturedGrid />
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" once={true}>
        <BestSeller />
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <StorySection />
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="xl" width="contained">
          <HowItWorks />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <Section spacing="xl" width="contained" background="gray">
          <About />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="xl" width="contained">
          <Testimonials />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained">
          <StyledBySisters />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <InstagramUGC />
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="xl" width="contained" background="brand-pink">
          <Newsletter />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="subtle" once={true}>
        <Section spacing="xl" width="contained">
          <Delivery />
        </Section>
      </EnhancedScrollFade>
    </BaseLayout>
  );
};

export default Index;
