import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BestSeller from "@/components/BestSeller";
import ScreenLoader from "@/components/ui/ScreenLoader";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import FeaturedGrid from "@/components/FeaturedGrid";
import PromotionalSection from "@/components/PromotionalSection";
import ParallaxContainer from "@/components/ParallaxContainer";
import SaleBanner from "@/components/SaleBanner";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <ScreenLoader onComplete={() => setIsLoading(false)} duration={3000} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sale Banner */}
      <SaleBanner />
      
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[hsl(var(--brand-pink))] py-3 sm:sticky sm:top-0">
        <nav className="w-[min(1100px,calc(100%-40px))] mx-auto rounded-[25px] bg-white shadow-lg px-4 py-2">
          <Navbar position={0} />
        </nav>
      </div>

      {/* Hero Section - No wrapper needed, has built-in spacing */}
      <Hero />
      
      {/* Parallax Transition - No additional spacing */}
      <ParallaxContainer />
      
      {/* Featured Grid - First major section after hero */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <FeaturedGrid />
        </div>
      </section>
      
      {/* Buy Cards - Major product section */}
      <BestSeller />
      
      {/* Community Stories - Combined carousel section with testimonials */}
      <CommunityStoriesCarousels />
      
      <PromotionalSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
