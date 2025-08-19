
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import ShopHero from "@/components/shop/ShopHero";
import ShopHeader from "@/components/shop/ShopHeader";
import ProductsGrid from "@/components/shop/ProductsGrid";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useShopSEO } from "@/hooks/useShopSEO";

const Shop = () => {
  const { filters, sort, sortedProducts, updateFilters, updateSort } = useShopFilters();
  
  // SEO setup
  useShopSEO(sortedProducts);

  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6 md:py-8">
          <ShopHero 
            activeCategorySlug={filters.category || undefined}
            onSelectCategory={(slug) => updateFilters({ ...filters, category: slug })}
          />
          
          <ShopHeader
            sort={sort}
            onSortChange={updateSort}
            productCount={sortedProducts.length}
          />
          
          <ProductsGrid products={sortedProducts} />
        </div>
      </div>
    </BaseLayout>
  );
};

export default Shop;
