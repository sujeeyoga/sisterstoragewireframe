import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import HeroSection from "@/components/shop/sections/HeroSection";
import ProductsSection from "@/components/shop/sections/ProductsSection";
import FooterSection from "@/components/shop/sections/FooterSection";
import { DiscountBanner } from "@/components/shop/DiscountBanner";
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
        <div className="mt-4">
          <DiscountBanner />
        </div>
        <HeroSection product={featuredProduct} />
        <ProductsSection products={sortedProducts} />
        <FooterSection />
      </div>
    </BaseLayout>
  );
};

export default Shop;
