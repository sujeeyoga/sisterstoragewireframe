
import React from "react";
import { categoryTree } from "@/data/catalog";

interface ShopHeroProps {
  activeCategorySlug?: string;
  onSelectCategory: (slug?: string) => void;
}

const ShopHero = ({ activeCategorySlug, onSelectCategory }: ShopHeroProps) => {
  return (
    <div className="relative pb-10 bg-muted/30">
      <div className="container-custom pt-10">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="font-bold text-3xl mb-4">Storage with Soul</h1>
          <p className="text-muted-foreground text-center mx-auto mb-6">
            Discover storage that's designed for your bangles, jewelry, and keepsakes — made with the details that matter most to your cultural heritage.
          </p>
          <p className="text-sm text-[hsl(var(--primary))] mb-6">
            Handcrafted with love, designed with intention.
          </p>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => onSelectCategory(undefined)}
            className={`px-4 py-2 rounded-full capitalize transition-all ${
              !activeCategorySlug
                ? "bg-[hsl(var(--primary))] text-primary-foreground shadow-md"
                : "bg-background border border-border text-foreground/80 hover:bg-primary/10"
            }`}
          >
            All
          </button>
          {categoryTree.map((node) => (
            <button
              key={node.slug}
              onClick={() => onSelectCategory(node.slug)}
              className={`px-4 py-2 rounded-full transition-all ${
                activeCategorySlug === node.slug
                  ? "bg-[hsl(var(--primary))] text-primary-foreground shadow-md"
                  : "bg-background border border-border text-foreground/80 hover:bg-primary/10"
              }`}
            >
              {node.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
