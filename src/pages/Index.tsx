import { useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import Hero from "@/components/Hero";
import CommunityStoriesCarousels from "@/components/community/CommunityStoriesCarousels";
import BestSeller from "@/components/BestSeller";
import OrganizationGallery from "@/components/OrganizationGallery";
import PromotionalBanner from "@/components/PromotionalBanner";
import { SEO } from "@/components/SEO";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { homepageFAQs } from "@/data/homepage-faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    url: 'https://www.sisterstorage.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.sisterstorage.com/shop?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <BaseLayout variant="standard" spacing="none" showFooter={true}>
      <SEO
        title="Sister Storage | Culture Without Clutter – Premium Bangle & Jewelry Organizers"
        description="Sister Storage offers premium stackable bangle and jewelry organizers. Shop our 4-rod dust-free storage boxes. Ship to Canada, USA & UK. Culture Without Clutter."
        keywords="sister storage, bangle organizer, jewelry storage box, 4 rod bangle storage, stackable jewelry organizer, south asian jewelry, cultural keepsakes, canadian jewelry storage, dust free organizer, bangle box"
        url="/"
        structuredData={structuredData}
      />
      <FAQSchema faqs={homepageFAQs} />
      
      <div className="min-h-screen bg-[#F10781] -mt-28">
        {/* Hero Section */}
        <Hero />
        
        {/* Styled by Our Sisters */}
        <CommunityStoriesCarousels />
        
        {/* Best Sellers - Product carousel */}
        <BestSeller />
        
        {/* Organization Gallery - Photo grid */}
        <OrganizationGallery />
        
        {/* FAQ Section */}
        <section className="bg-background py-16">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {homepageFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
        
        {/* Promotional Banner - Bottom CTA */}
        <PromotionalBanner />
      </div>
    </BaseLayout>
  );
};

export default Index;
