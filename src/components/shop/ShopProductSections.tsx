import React from "react";
import { Product } from "@/types/product";
import BundleCard from "./BundleCard";
import SimpleProductCard from "./SimpleProductCard";
import LaunchCardsSection from "./LaunchCardsSection";
import CultureBagPromo from "./CultureBagPromo";
import { useShopSections, slugsForFilter } from "@/hooks/useShopSections";

interface ShopProductSectionsProps {
  products: Product[];
}

const sectionBgMap: Record<string, string> = {
  'top-bundles': '#FFF7F5',
  'individual-boxes': '#F6F7FB',
  'organizers': '#FFFDF2',
  'open-box': '#FFF5F0',
};

const ShopProductSections = ({ products }: ShopProductSectionsProps) => {
  const { data: sections, isLoading } = useShopSections();

  const visibleSections = React.useMemo(
    () => (sections || []).filter((s) => s.visible),
    [sections]
  );

  const productsBySection = React.useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const section of visibleSections) {
      const slugs = slugsForFilter(section.category_filter);
      if (slugs.length === 0) continue;
      // For "individual-boxes" also include open-box products if that section name matches
      const sectionName = section.name;
      if (sectionName === 'individual-boxes') {
        map[section.id] = products.filter(
          (p) => p.category === 'bangle-boxes' || p.category === 'open-box'
        );
      } else {
        map[section.id] = products.filter((p) =>
          slugs.includes(p.category)
        );
      }
    }
    return map;
  }, [products, visibleSections]);

  if (isLoading) return null;

  const allEmpty = visibleSections.every(
    (s) => (productsBySection[s.id] || []).length === 0
  );

  return (
    <div className="grid gap-8">
      {visibleSections.map((section) => {
        const sectionProducts = productsBySection[section.id] || [];
        if (sectionProducts.length === 0) return null;

        const cols = section.layout_columns || 3;
        const bgColor = sectionBgMap[section.name] || '#FAFAFA';
        const isBundle = section.name === 'top-bundles';

        return (
          <section
            key={section.id}
            className="w-full"
            style={{ backgroundColor: bgColor, borderRadius: '0px' }}
          >
            <div className="container-custom py-8 md:py-12">
              <header className="flex items-end justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground uppercase tracking-wide">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-base text-muted-foreground uppercase tracking-wide mt-1">
                      {section.subtitle}
                    </p>
                  )}
                </div>
              </header>

              <div
                className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-${cols}`}
                style={{
                  gridTemplateColumns: undefined,
                }}
              >
                {sectionProducts.map((product) =>
                  isBundle ? (
                    <BundleCard key={product.id} product={product} isBundle />
                  ) : (
                    <SimpleProductCard key={product.id} product={product} />
                  )
                )}
              </div>
            </div>
          </section>
        );
      })}

      {/* Culture Bag Promo */}
      <CultureBagPromo variant="shop" />

      {/* Upcoming Collections */}
      <LaunchCardsSection />

      {/* Empty State */}
      {allEmpty && (
        <div className="text-center py-16 text-muted-foreground uppercase tracking-wide">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ShopProductSections;
