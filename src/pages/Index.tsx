import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import FeaturedGrid from "@/components/FeaturedGrid";
import SaleBanner from "@/components/SaleBanner";

// Lazy load below-the-fold content
const BestSeller = lazy(() => import("@/components/BestSeller"));
const CommunityStoriesCarousels = lazy(() => import("@/components/community/CommunityStoriesCarousels"));
const PromotionalSection = lazy(() => import("@/components/PromotionalSection"));
const ParallaxContainer = lazy(() => import("@/components/ParallaxContainer"));

const Index = () => {
  // Ensure body scroll is enabled on mount
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

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
      <Suspense fallback={<div className="h-32" />}>
        <ParallaxContainer />
      </Suspense>
      
      {/* Featured Grid - First major section after hero */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <FeaturedGrid />
        </div>
      </section>
      
      {/* Buy Cards - Major product section */}
      <Suspense fallback={<div className="h-64" />}>
        <BestSeller />
      </Suspense>
      
      {/* Community Stories - Combined carousel section with testimonials */}
      <Suspense fallback={<div className="h-96" />}>
        <CommunityStoriesCarousels />
      </Suspense>
      
      <Suspense fallback={<div className="h-64" />}>
        <PromotionalSection />
      </Suspense>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
