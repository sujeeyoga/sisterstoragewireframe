import { useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import BestSeller from "@/components/BestSeller";
import OrganizationGallery from "@/components/OrganizationGallery";
import PromotionalBanner from "@/components/PromotionalBanner";
import { SEO } from "@/components/SEO";

const Index = () => {
  // Ensure body scroll is enabled on mount
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sister Storage',
    url: 'https://attczdhexkpxpyqyasgz.lovable.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://attczdhexkpxpyqyasgz.lovable.app/shop?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <BaseLayout variant="standard" spacing="none" showFooter={true}>
      <SEO
        title="Sister Storage | Culture Without Clutter – Premium Bangle & Jewelry Organizers"
        description="Sister Storage offers premium stackable bangle and jewelry organizers. Shop our 4-rod dust-free storage boxes with free shipping to Canada, USA & UK on orders over $50. Culture Without Clutter."
        keywords="sister storage, bangle organizer, jewelry storage box, 4 rod bangle storage, stackable jewelry organizer, south asian jewelry, cultural keepsakes, canadian jewelry storage, dust free organizer, bangle box"
        url="/"
        structuredData={structuredData}
      />
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
