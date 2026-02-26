import { useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import BestSeller from "@/components/BestSeller";
import OrganizationGallery from "@/components/OrganizationGallery";
import CultureBagPromo from "@/components/shop/CultureBagPromo";
import PromotionalBanner from "@/components/PromotionalBanner";
import { SEO } from "@/components/SEO";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { homepageFAQs } from "@/data/homepage-faqs";

const Index = () => {
  // Ensure body scroll is enabled
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sister Storage',
    url: 'https://sisterstorage.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sisterstorage.com/shop?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <BaseLayout variant="standard" spacing="none" showFooter={true}>
      <SEO
        title="Bangle Storage Boxes & Organizers | Sister Storage – Culture Without Clutter"
        description="Shop premium bangle storage boxes that protect your jewelry. Dust-free, stackable organizers designed for South Asian jewelry. Ships to Canada & USA."
        keywords="bangle storage box, bangle organizer, jewelry storage, 4 rod bangle storage, stackable jewelry organizer, south asian jewelry, indian bangle box, dust free organizer, sister storage canada"
        url="/"
        structuredData={structuredData}
      />
      <FAQSchema faqs={homepageFAQs} />
      
      <div className="min-h-screen bg-[#E80065] -mt-28">
        {/* Hero Section */}
        <Hero />
        
        {/* Styled by Our Sisters */}
        <CommunityStoriesCarousels />
        
        {/* Best Sellers - Product carousel */}
        <BestSeller />
        
        {/* New Product — Culture Bag */}
        <CultureBagPromo variant="homepage" />
        
        {/* Organization Gallery - Photo grid */}
        <OrganizationGallery />
        
        {/* Promotional Banner - Bottom CTA */}
        <PromotionalBanner />
      </div>
    </BaseLayout>
  );
};

export default Index;
