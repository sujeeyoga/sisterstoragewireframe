
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import ShopHeroProduct from "@/components/shop/ShopHeroProduct";
import PromoBanner from "@/components/shop/PromoBanner";
import ShopProductSections from "@/components/shop/ShopProductSections";
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
          {/* Hero: Featured Product */}
          <ShopHeroProduct product={featuredProduct} />
          
          {/* Promo Banner */}
          <PromoBanner />
          
          {/* Product Sections */}
          <ShopProductSections products={sortedProducts} />
          
          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground py-4">
            © 2025 Sister Storage — Culture without clutter.
          </footer>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Shop;
