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
        <section className="w-full bg-[#FFF7F5]" style={{ borderRadius: '0px' }}>
          <div className="container-custom py-8 md:py-12">
            <header className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                  Top-Selling Bundles
                </h2>
                <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                  Complete collections for every Sister
                </p>
              </div>
            </header>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bundles.map((product) => (
                <BundleCard key={product.id} product={product} isBundle />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Section 2: Individual Boxes */}
      {bangleBoxes.length > 0 && (
        <section className="w-full bg-[#F6F7FB]" style={{ borderRadius: '0px' }}>
          <div className="container-custom py-8 md:py-12">
            <header className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                  Individual Boxes
                </h2>
                <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                  Build your own perfect collection
                </p>
              </div>
            </header>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {bangleBoxes.map((product) => (
                <SimpleProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Section 3: Pouches & Bags */}
      {organizers.length > 0 && (
        <section className="w-full bg-[#FFFDF2]" style={{ borderRadius: '0px' }}>
          <div className="container-custom py-8 md:py-12">
            <header className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                  Jewelry Pouches
                </h2>
                <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                  Soft protection, travel-ready
                </p>
              </div>
            </header>
            
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          </div>
        </section>
      )}
      
      {/* Empty State */}
      {bundles.length === 0 && bangleBoxes.length === 0 && organizers.length === 0 && (
        <div className="text-center py-16 text-muted-foreground uppercase tracking-wide">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ShopProductSections;
