import { useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import BestSeller from "@/components/BestSeller";
import OrganizationGallery from "@/components/OrganizationGallery";
import PromotionalBanner from "@/components/PromotionalBanner";

const Index = () => {
  // Ensure body scroll is enabled on mount
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  return (
    <BaseLayout variant="standard" spacing="none" showFooter={true}>
      <div className="min-h-screen bg-[#F10781] -mt-28">
        {/* Hero Section */}
        <Hero />
        
        {/* Styled by Our Sisters */}
        <CommunityStoriesCarousels />
        
        {/* Best Sellers - Product carousel */}
        <BestSeller />
        
        {/* Organization Gallery - Photo grid */}
        <OrganizationGallery />
        
        {/* Promotional Banner - Bottom CTA */}
        <PromotionalBanner />
      </div>
    </BaseLayout>
  );
};

export default Index;
