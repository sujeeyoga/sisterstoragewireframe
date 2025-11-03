import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import HeroSection from "@/components/shop/sections/HeroSection";
import ProductsSection from "@/components/shop/sections/ProductsSection";
import FooterSection from "@/components/shop/sections/FooterSection";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useShopSEO } from "@/hooks/useShopSEO";
import { featuredProduct } from "@/data/products";

const Shop = () => {
  const { sortedProducts, isLoading } = useShopFilters();
  
  // SEO setup
  useShopSEO(sortedProducts);

  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <div className="bg-background min-h-screen">
        <HeroSection product={featuredProduct} />
        <ProductsSection 
          products={sortedProducts} 
          isLoading={isLoading}
        />
        <FooterSection />
      </div>
    </BaseLayout>
  );
};

export default Shop;
