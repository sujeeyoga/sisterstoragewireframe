import { lazy, Suspense, useEffect, useState } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";
import { HeroSkeleton } from "@/components/skeletons/HeroSkeleton";
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
  const [isContentReady, setIsContentReady] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState({
    hero: false,
    stories: false,
    bestSeller: false,
    gallery: false,
    promo: false
  });

  // Ensure body scroll is enabled on mount
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  // Preload hero image
  useEffect(() => {
    const img = new Image();
    img.src = '/src/assets/hero-bg-main.jpg';
    img.onload = () => {
      setComponentsLoaded(prev => ({ ...prev, hero: true }));
    };
  }, []);

  // Check if all components are loaded
  useEffect(() => {
    if (Object.values(componentsLoaded).every(loaded => loaded)) {
      // Add small delay to ensure smooth transition
      const timer = setTimeout(() => setIsContentReady(true), 300);
      return () => clearTimeout(timer);
    }
  }, [componentsLoaded]);

  // Mark lazy components as loaded when they mount
  const markLoaded = (component: keyof typeof componentsLoaded) => {
    setComponentsLoaded(prev => ({ ...prev, [component]: true }));
  };

  return (
    <BaseLayout variant="standard" spacing="none" showFooter={true}>
      <div className="min-h-screen bg-white -mt-28">
        {!isContentReady ? (
          <>
            {/* Show all skeletons while loading */}
            <HeroSkeleton />
            <StoriesCarouselSkeleton />
            <BestSellerSkeleton />
            <GallerySkeleton />
            <PromoBannerSkeleton />
          </>
        ) : (
          <>
            {/* Hero Section - Critical, loads immediately */}
            <Hero />
            
            {/* Styled by Our Sisters - Lazy loaded for performance */}
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
          </>
        )}
        
        {/* Hidden preloader for lazy components */}
        {!isContentReady && (
          <div className="hidden">
            <Suspense fallback={null}>
              <div onLoad={() => markLoaded('stories')}>
                <CommunityStoriesCarousels />
              </div>
            </Suspense>
            <Suspense fallback={null}>
              <div onLoad={() => markLoaded('bestSeller')}>
                <BestSeller />
              </div>
            </Suspense>
            <Suspense fallback={null}>
              <div onLoad={() => markLoaded('gallery')}>
                <OrganizationGallery />
              </div>
            </Suspense>
            <Suspense fallback={null}>
              <div onLoad={() => markLoaded('promo')}>
                <PromotionalBanner />
              </div>
            </Suspense>
          </div>
        )}
      </div>
    </BaseLayout>
  );
};

export default Index;
