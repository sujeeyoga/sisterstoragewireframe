import { lazy, Suspense, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";

// Lazy load all below-the-fold content for better performance
const OrganizationShowcase = lazy(() => import("@/components/OrganizationShowcase"));
const CommunityStoriesCarousels = lazy(() => import("@/components/community/CommunityStoriesCarousels"));
const BestSeller = lazy(() => import("@/components/BestSeller"));
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
        {/* Hero Section - Critical, loads immediately */}
        <Hero />
        
        {/* Organization Showcase - Image cards linking to shop */}
        <Suspense fallback={<div className="h-64" />}>
          <OrganizationShowcase />
        </Suspense>
        
        {/* Styled by Our Sisters - Lazy loaded for performance */}
        <Suspense fallback={<div className="h-64" />}>
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
