
import React from "react";
import { categoryTree } from "@/data/catalog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface ShopHeroProps {
  activeCategorySlug?: string;
  onSelectCategory: (slug?: string) => void;
}

const ShopHero = ({ activeCategorySlug, onSelectCategory }: ShopHeroProps) => {
  return (
    <div className="container-custom">
      {/* Desktop and up: inline pill bar */}
      <div className="flex items-center justify-between pt-[50px]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Storage with Soul</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectCategory(undefined)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                !activeCategorySlug
                  ? "bg-[hsl(var(--primary))] text-primary-foreground shadow"
                  : "bg-background border border-border text-foreground/80 hover:bg-primary/10"
              }`}
            >
              All
            </button>
            {categoryTree.map((node) => (
              <button
                key={node.slug}
                onClick={() => onSelectCategory(node.slug)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  activeCategorySlug === node.slug
                    ? "bg-[hsl(var(--primary))] text-primary-foreground shadow"
                    : "bg-background border border-border text-foreground/80 hover:bg-primary/10"
                }`}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopHero;
