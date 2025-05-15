
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedItems from "@/components/FeaturedItems";
import About from "@/components/About";
import Locations from "@/components/Locations";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <FeaturedItems />
      <About />
      <Locations />
      <Footer />
    </div>
  );
};

export default Index;
