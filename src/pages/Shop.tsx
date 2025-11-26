import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import HeroSection from "@/components/shop/sections/HeroSection";
import ProductsSection from "@/components/shop/sections/ProductsSection";
import FooterSection from "@/components/shop/sections/FooterSection";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useShopSEO } from "@/hooks/useShopSEO";
import { useProduct } from "@/hooks/useProducts";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { shopFAQs } from "@/data/shop-faqs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Shop = () => {
  const { sortedProducts, isLoading } = useShopFilters();
  const { data: featuredProduct } = useProduct("bundle-3");
  
  // SEO setup
  useShopSEO(sortedProducts);

  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <FAQSchema faqs={shopFAQs} />
      
      <div className="bg-background min-h-screen">
        {featuredProduct && <HeroSection product={featuredProduct} />}
        <ProductsSection
          products={sortedProducts} 
          isLoading={isLoading}
        />
        
        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Shopping FAQs</h2>
            <Accordion type="single" collapsible className="w-full">
              {shopFAQs.map((faq, index) => (
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
        
        <FooterSection />
      </div>
    </BaseLayout>
  );
};

export default Shop;
