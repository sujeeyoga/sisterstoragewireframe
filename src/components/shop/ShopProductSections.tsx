import React from "react";
import { Product } from "@/types/product";
import BundleCard from "./BundleCard";
import SimpleProductCard from "./SimpleProductCard";
import LaunchCardsSection from "./LaunchCardsSection";
import CultureBagPromo from "./CultureBagPromo";
import { useShopSections, slugsForFilter } from "@/hooks/useShopSections";
import { cn } from "@/lib/utils";

interface ShopProductSectionsProps {
  products: Product[];
}

const ShopHeroBanner = ({ title, subtitle, bgColor }: { title: string; subtitle: string | null; bgColor: string | null }) => (
  <section
    id="section-hero"
    className={cn("w-full relative overflow-hidden", bgColor?.startsWith('bg-') ? bgColor : '')}
    style={bgColor && !bgColor.startsWith('bg-') ? { backgroundColor: bgColor } : undefined}
  >
    <img
      src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg"
      alt="Sister Storage lifestyle"
      className="absolute inset-0 w-full h-full object-cover"
      loading="eager"
    />
    <div className="absolute inset-0 bg-black/30" />
    <div className="relative z-10 container-custom text-center text-white py-20 md:py-32">
      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-4 drop-shadow-lg">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg md:text-xl lg:text-2xl font-medium uppercase tracking-wide opacity-90 drop-shadow">
          {subtitle}
        </p>
      )}
    </div>
  </section>
);

const ProductGrid = ({
  section,
  products,
  isBundle,
}: {
  section: { name: string; title: string; subtitle: string | null; layout_columns: number | null; category_filter: string | null };
  products: Product[];
  isBundle?: boolean;
}) => {
  const cols = section.layout_columns || 3;
  const colsClass: Record<number, string> = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
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
      <div className={cn("grid gap-5", colsClass[cols] || 'sm:grid-cols-2 lg:grid-cols-3')}>
        {products.map((product) =>
          isBundle ? (
            <BundleCard key={product.id} product={product} isBundle />
          ) : (
            <SimpleProductCard key={product.id} product={product} />
          )
        )}
      </div>
    </div>
  );
};

// Background color map for known sections
const sectionBgColors: Record<string, string> = {
  'top-bundles': '#FFF7F5',
  'individual-boxes': '#F6F7FB',
  'organizers': '#FFFDF2',
};

const ShopProductSections = ({ products }: ShopProductSectionsProps) => {
  const { data: sections } = useShopSections();

  // Group products by category
  const productsByCategory = React.useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      if (!map[p.category]) map[p.category] = [];
      map[p.category].push(p);
    });
    // Merge open-box into bangle-boxes for individual-boxes section
    return map;
  }, [products]);

  const getProductsForSection = React.useCallback((section: { name: string; category_filter: string | null }) => {
    if (!section.category_filter) return [];
    const slugs = slugsForFilter(section.category_filter);
    
    // Special case: individual-boxes includes open-box
    if (section.name === 'individual-boxes') {
      const allSlugs = [...slugs, 'open-box'];
      return products.filter(p => allSlugs.includes(p.category));
    }
    
    return products.filter(p => slugs.includes(p.category));
  }, [products]);

  if (!sections) return null;

  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="grid gap-0">
      {visibleSections.map((section) => {
        // Hero section
        if (section.name === 'hero') {
          return (
            <ShopHeroBanner
              key={section.id}
              title={section.title}
              subtitle={section.subtitle}
              bgColor={section.background_color}
            />
          );
        }

        // Styled by sisters (handled via CommunityStoriesCarousels or similar)
        if (section.name === 'styled-by-sisters') {
          // Import dynamically or render inline — for now render the culture bag promo as placeholder
          return null; // This section is rendered on the homepage, not on shop
        }

        // Culture bag
        if (section.name === 'culture-bag') {
          return <CultureBagPromo key={section.id} variant="shop" />;
        }

        // Upcoming collections
        if (section.name === 'upcoming-collections') {
          return <LaunchCardsSection key={section.id} />;
        }

        // Product sections
        const sectionProducts = getProductsForSection(section);
        if (sectionProducts.length === 0) return null;

        const bgColor = section.background_color?.startsWith('bg-')
          ? undefined
          : sectionBgColors[section.name] || undefined;

        return (
          <section
            key={section.id}
            id={`section-${section.name}`}
            className={cn("w-full", section.background_color?.startsWith('bg-') ? section.background_color : '')}
            style={bgColor ? { backgroundColor: bgColor } : undefined}
          >
            <ProductGrid
              section={section}
              products={sectionProducts}
              isBundle={section.name === 'top-bundles'}
            />
          </section>
        );
      })}

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-16 text-muted-foreground uppercase tracking-wide">
          No products found.
        </div>
      )}
    </div>
  );
};

export default ShopProductSections;
