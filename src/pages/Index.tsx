
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
import EnhancedScrollFade from "@/components/ui/enhanced-scroll-fade";

const Index = () => {
  return (
    <BaseLayout variant="standard" pageId="home">
      <Hero />
      
      <EnhancedScrollFade preset="medium" once={true}>
        <Section spacing="md" width="contained">
          <BestSeller />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <StorySection />
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained">
          <HowItWorks />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <Section spacing="md" width="contained" background="gray">
          <About />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained">
          <Testimonials />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="md" width="contained">
          <FeaturedGrid />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="subtle" delay={0.2} once={true}>
        <Section spacing="md" width="full">
          <InstagramUGC />
        </Section>
      </EnhancedScrollFade>
      
      <EnhancedScrollFade preset="medium" delay={0.1} once={true}>
        <Section spacing="lg" width="contained" background="brand-pink">
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
