
import React from "react";
import ShopLayout from "@/components/shop/ShopLayout";
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

  const hero = (
    <ShopHero 
      activeCategorySlug={filters.category || undefined}
      onSelectCategory={(slug) => updateFilters({ ...filters, category: slug })}
    />
  );

  return (
    <ShopLayout hero={hero}>
      <div className="container mx-auto px-4">
        <ShopHeader
          sort={sort}
          onSortChange={updateSort}
          productCount={sortedProducts.length}
        />
        
        <div className="flex gap-8">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <ShopSidebar
              filters={filters}
              onFiltersChange={updateFilters}
            />
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <ProductsGrid products={sortedProducts} />
            
            {/* Load more button */}
            <div className="mt-12 flex justify-center">
              <Button variant="outline" size="lg">
                Load More Products
              </Button>
            </div>
          </div>
        </div>
        
        {/* Additional sections */}
        <div className="mt-16 space-y-16">
          <BenefitsSection benefits={benefits} />
          <TestimonialSection />
        </div>
      </div>
    </ShopLayout>
  );
};

export default Shop;
