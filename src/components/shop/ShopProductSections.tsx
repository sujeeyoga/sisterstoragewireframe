import React from "react";
import { Product } from "@/types/product";
import BundleCard from "./BundleCard";
import SimpleProductCard from "./SimpleProductCard";
import LaunchCardsSection from "./LaunchCardsSection";
import CultureBagPromo from "./CultureBagPromo";
import { useShopSections } from "@/hooks/useShopSections";

interface ShopProductSectionsProps {
  products: Product[];
}

const ShopProductSections = ({ products }: ShopProductSectionsProps) => {
  const { data: sections } = useShopSections();

  // Helper to get section config by name
  const getSection = (name: string) => sections?.find(s => s.name === name);

  const bundles = React.useMemo(() => 
    products.filter(p => p.category === 'bundles'), [products]);
  
  const bangleBoxes = React.useMemo(() => {
    const regularBoxes = products.filter(p => p.category === 'bangle-boxes');
    const openBoxes = products.filter(p => p.category === 'open-box');
    return [...regularBoxes, ...openBoxes];
  }, [products]);
  
  const organizers = React.useMemo(() => 
    products.filter(p => p.category === 'organizers'), [products]);

  const bundlesSection = getSection('top-bundles');
  const boxesSection = getSection('individual-boxes');
  const organizersSection = getSection('organizers');
  const openBoxSection = getSection('open-box');

  return (
    <div className="grid gap-8">
      {/* Section 1: Top-Selling Bundles */}
      {bundles.length > 0 && bundlesSection?.visible !== false && (
        <section className="w-full bg-[#FFF7F5]" style={{ borderRadius: '0px' }}>
          <div className="container-custom py-8 md:py-12">
            <header className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                  {bundlesSection?.title || 'Top-Selling Bundles'}
                </h2>
                <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                  {bundlesSection?.subtitle || 'Complete collections for every Sister'}
                </p>
              </div>
            </header>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {bundles.map((product) => (
                <BundleCard key={product.id} product={product} isBundle />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Section 2: Individual Boxes */}
      {bangleBoxes.length > 0 && boxesSection?.visible !== false && (
        <section className="w-full bg-[#F6F7FB]" style={{ borderRadius: '0px' }}>
          <div className="container-custom py-8 md:py-12">
            <header className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                  {boxesSection?.title || 'Individual Boxes'}
                </h2>
                <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                  {boxesSection?.subtitle || 'Build your own perfect collection'}
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
      {organizers.length > 0 && organizersSection?.visible !== false && (
        <section className="w-full bg-[#FFFDF2]" style={{ borderRadius: '0px' }}>
          <div className="container-custom py-8 md:py-12">
            <header className="flex items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                  {organizersSection?.title || 'Jewelry Pouches'}
                </h2>
                <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                  {organizersSection?.subtitle || 'Soft protection, travel-ready'}
                </p>
              </div>
            </header>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {organizers.map((product) => (
                <SimpleProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Section 4: Culture Bag */}
      <CultureBagPromo variant="shop" />
      
      {/* Section 5: Upcoming Collections */}
      <LaunchCardsSection />
      
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
