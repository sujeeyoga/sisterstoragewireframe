
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
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} rootMargin="-50px 0px">
        <FeaturedItems />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} delay={0.1} rootMargin="-50px 0px">
        <HowItWorks />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} delay={0.2} rootMargin="-50px 0px">
        <About />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} delay={0.1} rootMargin="-50px 0px">
        <Testimonials />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} delay={0.2} rootMargin="-50px 0px">
        <InstagramUGC />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} delay={0.1} rootMargin="-50px 0px">
        <Newsletter />
      </ScrollFadeContainer>
      <ScrollFadeContainer scrollFadeDirection="both" threshold={0.05} duration={1.2} rootMargin="-50px 0px">
        <Delivery />
      </ScrollFadeContainer>
    </Layout>
  );
};

export default Index;
