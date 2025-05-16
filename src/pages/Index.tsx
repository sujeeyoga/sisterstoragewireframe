
import Layout from "@/components/layout/Layout";
import Hero from "@/components/Hero";
import FeaturedItems from "@/components/FeaturedItems";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Delivery from "@/components/Delivery";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import InstagramUGC from "@/components/InstagramUGC";
import ScrollFadeContainer from "@/components/ui/scroll-fade-container";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1}>
        <FeaturedItems />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1} delay={0.1}>
        <HowItWorks />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1} delay={0.2}>
        <About />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1} delay={0.1}>
        <Testimonials />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1} delay={0.2}>
        <InstagramUGC />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1} delay={0.1}>
        <Newsletter />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.1} duration={1}>
        <Delivery />
      </ScrollFadeContainer>
    </Layout>
  );
};

export default Index;
