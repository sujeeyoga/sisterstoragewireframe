
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedItems from "@/components/FeaturedItems";
import About from "@/components/About";
import HowItWorks from "@/components/HowItWorks";
import Locations from "@/components/Locations";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import InstagramUGC from "@/components/InstagramUGC";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <FeaturedItems />
      <HowItWorks />
      <About />
      <Testimonials />
      <InstagramUGC />
      <Newsletter />
      <Locations />
      <Footer />
    </div>
  );
};

export default Index;
