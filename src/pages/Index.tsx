import { lazy, Suspense, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";
import { StoriesCarouselSkeleton } from "@/components/skeletons/StoriesCarouselSkeleton";
import { BestSellerSkeleton } from "@/components/skeletons/BestSellerSkeleton";
import { GallerySkeleton } from "@/components/skeletons/GallerySkeleton";
import { PromoBannerSkeleton } from "@/components/skeletons/PromoBannerSkeleton";

// Lazy load all below-the-fold content for better performance
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
      <div className="min-h-screen bg-[#F10781] -mt-28">
        {/* Hero Section - Critical, loads immediately */}
        <Hero />
        
        {/* Styled by Our Sisters - Lazy loaded with skeleton */}
        <Suspense fallback={<StoriesCarouselSkeleton />}>
          <CommunityStoriesCarousels />
        </Suspense>
        
        {/* Best Sellers - Product carousel */}
        <Suspense fallback={<BestSellerSkeleton />}>
          <BestSeller />
        </Suspense>
        
        {/* Organization Gallery - Photo grid */}
        <Suspense fallback={<GallerySkeleton />}>
          <OrganizationGallery />
        </Suspense>
        
        {/* Promotional Banner - Bottom CTA */}
        <Suspense fallback={<PromoBannerSkeleton />}>
          <PromotionalBanner />
        </Suspense>
      </div>
    </BaseLayout>
  );
};

export default Index;
