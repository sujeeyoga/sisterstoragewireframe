
import React from "react";
import { categoryTree } from "@/data/catalog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface ShopHeroProps {
  activeCategorySlug?: string;
  onSelectCategory: (slug?: string) => void;
}

const ShopHero = ({ activeCategorySlug, onSelectCategory }: ShopHeroProps) => {
  return (
    <div className="bg-transparent py-3">
      <div className="container-custom">
        {/* Mobile: compact dropdown */}
        <div className="flex items-center justify-center md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-full border border-border bg-background px-4 py-2 text-sm shadow-sm hover:bg-muted"
              aria-label="Open storage categories"
            >
              Storage with Soul
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-[60] w-[min(92vw,680px)] p-0 bg-background border border-border shadow-xl">
              <div className="p-4 border-b">
                <h3 className="text-base font-semibold">Storage with Soul</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Discover storage that's designed for your bangles, jewelry, and keepsakes — made with the details that matter most to your cultural heritage.
                </p>
                <p className="text-xs text-[hsl(var(--primary))] mt-2">Handcrafted with love, designed with intention.</p>
              </div>
              <div className="p-3">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop and up: inline pill bar */}
        <div className="hidden md:flex items-center justify-between">
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
    </div>
  );
};

export default ShopHero;
