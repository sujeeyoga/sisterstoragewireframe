
import Layout from "@/components/layout/Layout";
import Hero from "@/components/Hero";
import FeaturedItems from "@/components/FeaturedItems";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import InstagramUGC from "@/components/InstagramUGC";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedItems />
      <HowItWorks />
      <About />
      <Testimonials />
      <InstagramUGC />
      <Newsletter />
      <Locations />
    </Layout>
  );
};

export default Index;
