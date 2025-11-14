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
import { burstPreloadImages, burstPreloadVideos } from "@/lib/burstImagePreloader";

const Index = () => {
  // Ensure body scroll is enabled and burst load all homepage images
  useEffect(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    // Burst load all homepage images in parallel
    const homepageImages = [
      // Organization Gallery
      '/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png',
      '/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png',
      '/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png',
      // Best Seller Bundles
      '/src/assets/optimized/starter-set.jpg',
      '/src/assets/optimized/sister-staples.jpg',
      '/src/assets/optimized/family-set.jpg',
      // Instagram Posts
      'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg',
      'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg',
      'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-13-scaled.jpg',
    ];
    
    // Burst load homepage videos in parallel with images
    const homepageVideos = [
      '/lovable-uploads/sister-story-new.mp4',
      '/lovable-uploads/sister-story-brown-girls-bangles.mp4'
    ];
    
    // Load images and videos in parallel for fastest load time
    Promise.all([
      burstPreloadImages({
        images: homepageImages,
        priority: 'high',
        onProgress: (loaded, total) => {
          console.log(`📸 Loaded ${loaded}/${total} images`);
        }
      }),
      burstPreloadVideos(homepageVideos)
    ]).then(() => {
      console.log('✅ All homepage media burst loaded (images + videos)');
    });
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
        description="Sister Storage offers premium stackable bangle and jewelry organizers. Shop our 4-rod dust-free storage boxes. Ship to Canada & USA. UK shipping coming soon!"
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
