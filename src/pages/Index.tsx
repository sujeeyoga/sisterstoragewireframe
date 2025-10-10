import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SaleBanner from "@/components/SaleBanner";

// Lazy load below-the-fold content
const BestSeller = lazy(() => import("@/components/BestSeller"));
const CommunityStoriesCarousels = lazy(() => import("@/components/community/CommunityStoriesCarousels"));
const OrganizationGallery = lazy(() => import("@/components/OrganizationGallery"));
const PromotionalBanner = lazy(() => import("@/components/PromotionalBanner"));

const Index = () => {
  // Ensure body scroll is enabled on mount
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Sale Banner - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SaleBanner />
      </div>
      
      {/* Hero Section - Full Height with Nav Overlay */}
      <div className="relative">
        {/* Navigation - Fixed Floating below banner */}
        <div className="fixed top-10 left-0 right-0 z-50 py-3">
          <nav className="w-[min(1100px,calc(100%-40px))] mx-auto rounded-[25px] bg-white shadow-lg px-4 py-2">
            <Navbar position={0} />
          </nav>
        </div>

        <Hero />
      </div>
      
      {/* Styled by Our Sisters - Community carousel */}
      <Suspense fallback={<div className="h-96" />}>
        <CommunityStoriesCarousels />
      </Suspense>
      
      {/* Best Sellers - Product carousel */}
      <Suspense fallback={<div className="h-64" />}>
        <BestSeller />
      </Suspense>
      
      {/* Organization Gallery - Photo grid */}
      <Suspense fallback={<div className="h-64" />}>
        <OrganizationGallery />
      </Suspense>
      
      {/* Promotional Banner - Bottom CTA */}
      <Suspense fallback={<div className="h-64" />}>
        <PromotionalBanner />
      </Suspense>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
