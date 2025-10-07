
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import HeroSection from "@/components/shop/sections/HeroSection";
import PromoSection from "@/components/shop/sections/PromoSection";
import ProductsSection from "@/components/shop/sections/ProductsSection";
import FooterSection from "@/components/shop/sections/FooterSection";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useShopSEO } from "@/hooks/useShopSEO";
import { featuredProduct } from "@/data/products";

const Shop = () => {
  const { sortedProducts } = useShopFilters();
  
  // SEO setup
  useShopSEO(sortedProducts);

  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <div className="bg-background min-h-screen">
        <div className="mx-auto max-w-[1200px] p-4 md:p-6 lg:p-8 grid gap-8">
          <HeroSection product={featuredProduct} />
          <PromoSection />
          <ProductsSection products={sortedProducts} />
          <FooterSection />
        </div>
      </div>
    </BaseLayout>
  );
};

export default Shop;
