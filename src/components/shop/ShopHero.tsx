
import React from "react";
import { categoryTree } from "@/data/catalog";
import { products } from "@/data/products";
import { productTaxonomyMap } from "@/data/product-taxonomy";

interface ShopHeroProps {
  activeCategorySlug?: string;
  onSelectCategory: (slug?: string) => void;
}

const ShopHero = ({ activeCategorySlug, onSelectCategory }: ShopHeroProps) => {
  // Calculate product counts for each category using taxonomy (same logic as filtering)
  const getCategoryCount = (categorySlug?: string) => {
    if (!categorySlug) return products.length;
    
    const augmentedProducts = products.map((p) => ({
      ...p,
      taxonomy: productTaxonomyMap[p.id] ?? { categorySlugs: [], attributes: {} },
    }));
    
    return augmentedProducts.filter((p) => 
      p.taxonomy?.categorySlugs?.includes(categorySlug)
    ).length;
  };

  return (
    <div className="mb-6 -mt-5">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 lg:gap-16 text-sm md:text-base">
        <button
          onClick={() => onSelectCategory(undefined)}
          className={`transition-colors ${
            !activeCategorySlug
              ? "text-foreground underline"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          all ({getCategoryCount()})
        </button>
        {categoryTree.map((node) => (
          <button
            key={node.slug}
            onClick={() => onSelectCategory(node.slug)}
            className={`transition-colors ${
              activeCategorySlug === node.slug
                ? "text-foreground underline"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {node.label.toLowerCase()} ({getCategoryCount(node.slug)})
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShopHero;
