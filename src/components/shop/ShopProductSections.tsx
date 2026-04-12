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

const colsClass: Record<number, string> = {
  2: 'grid gap-5 sm:grid-cols-2',
  3: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4',
};

const ShopProductSections = ({ products }: ShopProductSectionsProps) => {
  const { data: sections, isLoading } = useShopSections();

  const visibleSections = React.useMemo(
    () => (sections || []).filter((s) => s.visible),
    [sections]
  );

  console.log('[ShopSections] isLoading:', isLoading, 'sections:', sections?.length, 'products:', products.length, 'visible:', visibleSections.length);

  const productsBySection = React.useMemo(() => {
    const map: Record<string, Product[]> = {};
    for (const section of visibleSections) {
      const slugs = slugsForFilter(section.category_filter);
      if (slugs.length === 0) continue;
      if (section.name === 'individual-boxes') {
        map[section.id] = products.filter(
          (p) => p.category === 'bangle-boxes' || p.category === 'open-box'
        );
      } else {
        map[section.id] = products.filter((p) => slugs.includes(p.category));
      }
    }
    console.log('[ShopSections] productsBySection:', Object.entries(map).map(([id, prods]) => `${id}: ${prods.length}`));
    console.log('[ShopSections] product categories:', products.map(p => `${p.name}: ${p.category}`));
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
        const gridClass = colsClass[cols] || colsClass[3];

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

              <div className={gridClass}>
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

      <CultureBagPromo variant="shop" />
      <LaunchCardsSection />

      {allEmpty && (
        <div className="text-center py-16 text-muted-foreground uppercase tracking-wide">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ShopProductSections;
