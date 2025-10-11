import { lazy, Suspense, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";

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
    <BaseLayout variant="standard" spacing="none" showFooter={true}>
      <div className="min-h-screen bg-white -mt-28">
        {/* Hero Section */}
        <Hero />
        
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
      </div>
    </BaseLayout>
  );
};

export default Index;
