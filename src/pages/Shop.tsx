
import React from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import ShopHero from "@/components/shop/ShopHero";
import ShopHeader from "@/components/shop/ShopHeader";
import ShopSidebar from "@/components/shop/ShopSidebar";
import ProductsGrid from "@/components/shop/ProductsGrid";
import BenefitsSection from "@/components/shop/BenefitsSection";
import TestimonialSection from "@/components/shop/TestimonialSection";
import { useShopFilters } from "@/hooks/useShopFilters";
import { useShopSEO } from "@/hooks/useShopSEO";
import { benefits } from "@/data/products";
import { Button } from "@/components/ui/button";

const Shop = () => {
  const { filters, sort, sortedProducts, updateFilters, updateSort } = useShopFilters();
  
  // SEO setup
  useShopSEO(sortedProducts);

  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <ShopHero 
        activeCategorySlug={filters.category || undefined}
        onSelectCategory={(slug) => updateFilters({ ...filters, category: slug })}
      />
      
      <div className="bg-gray-50 min-h-screen pt-[150px]">
        <div className="container mx-auto px-4 py-8">
          <ShopHeader
            sort={sort}
            onSortChange={updateSort}
            productCount={sortedProducts.length}
          />
          
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="hidden lg:block">
              <ShopSidebar
                filters={filters}
                onFiltersChange={updateFilters}
              />
            </div>
            
            {/* Main Product Grid */}
            <div className="flex-1">
              <div className="bg-white rounded-lg p-6">
                <ProductsGrid products={sortedProducts} />
                
                {/* Load more button */}
                {sortedProducts.length > 0 && (
                  <div className="mt-8 flex justify-center">
                    <Button variant="outline" size="lg" className="px-8">
                      Load More Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional sections */}
          <div className="mt-16 space-y-16">
            <BenefitsSection benefits={benefits} />
            <TestimonialSection />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Shop;
