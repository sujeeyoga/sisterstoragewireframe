import React from "react";
import { Product } from "@/types/product";
import BundleCard from "./BundleCard";
import SimpleProductCard from "./SimpleProductCard";

interface ShopProductSectionsProps {
  products: Product[];
}

const ShopProductSections = ({ products }: ShopProductSectionsProps) => {
  // Split products into bundles, bangle boxes, and organizers
  const bundles = products.filter(p => p.category === 'bundles');
  const bangleBoxes = products.filter(p => p.category === 'bangle-boxes');
  const organizers = products.filter(p => p.category === 'organizers');

  return (
    <div className="grid gap-8">
      {/* Section 1: Top-Selling Bundles */}
      {bundles.length > 0 && (
        <section className="shop-section rounded-2xl p-5 md:p-6 lg:p-8 bg-[#FFF7F5]">
          <header className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Top-Selling Bundles
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete collections for every Sister
              </p>
            </div>
          </header>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((product) => (
              <BundleCard key={product.id} product={product} isBundle />
            ))}
          </div>
        </section>
      )}
      
      {/* Section 2: Individual Boxes */}
      {bangleBoxes.length > 0 && (
        <section className="shop-section rounded-2xl p-5 md:p-6 lg:p-8 bg-[#F6F7FB]">
          <header className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Individual Boxes
              </h2>
              <p className="text-sm text-muted-foreground">
                Build your own perfect collection
              </p>
            </div>
          </header>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bangleBoxes.map((product) => (
              <SimpleProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
      
      {/* Section 3: Pouches & Bags */}
      {organizers.length > 0 && (
        <section className="shop-section rounded-2xl p-5 md:p-6 lg:p-8 bg-[#FFFDF2]">
          <header className="flex items-end justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Jewelry Pouches
              </h2>
              <p className="text-sm text-muted-foreground">
                Soft protection, travel-ready
              </p>
            </div>
          </header>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {organizers.map((product) => {
              // Define bullets for jewelry organizer
              const bullets = product.id === 'jewelry-bag-organizer' 
                ? ['7 zip pouches', 'Flat fold for travel', 'Soft-touch lining']
                : undefined;
              
              return (
                <SimpleProductCard 
                  key={product.id} 
                  product={product}
                  bullets={bullets}
                />
              );
            })}
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {bundles.length === 0 && bangleBoxes.length === 0 && organizers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ShopProductSections;
