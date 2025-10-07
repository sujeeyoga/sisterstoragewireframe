import React from "react";
import { Product } from "@/types/product";
import BundleCard from "./BundleCard";

interface ShopProductSectionsProps {
  products: Product[];
}

const ShopProductSections = ({ products }: ShopProductSectionsProps) => {
  // Split products into bundles and individual items
  const bundles = products.filter(p => p.category === 'bundles');
  const individualProducts = products.filter(p => p.category !== 'bundles');

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6">
      {/* Section 1: Top-Selling Bundles */}
      {bundles.length > 0 && (
        <section className="ss-section ss-bundles mb-12 md:mb-16">
          <div className="mb-6 md:mb-8">
            <h2 className="ss-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
              Top-Selling Bundles
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Complete collections for every Sister
            </p>
          </div>
          
          <div className="ss-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {bundles.map((product) => (
              <BundleCard key={product.id} product={product} isBundle />
            ))}
          </div>
        </section>
      )}
      
      {/* Section 2: Individual Boxes */}
      {individualProducts.length > 0 && (
        <section className="ss-section ss-products mb-12">
          <div className="mb-6 md:mb-8">
            <h2 className="ss-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
              Individual Boxes
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Build your own perfect collection
            </p>
          </div>
          
          <div className="ss-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {individualProducts.map((product) => (
              <BundleCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {bundles.length === 0 && individualProducts.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ShopProductSections;
