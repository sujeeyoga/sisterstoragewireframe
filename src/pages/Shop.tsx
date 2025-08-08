
import React, { useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import ShopHero from "@/components/shop/ShopHero";
import ProductsGrid from "@/components/shop/ProductsGrid";
import BenefitsSection from "@/components/shop/BenefitsSection";
import TestimonialSection from "@/components/shop/TestimonialSection";
import ShopFilters, { type Filters } from "@/components/shop/ShopFilters";
import { products, benefits } from "@/data/products";
import { productTaxonomyMap } from "@/data/product-taxonomy";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const Shop = () => {
  
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: Filters = useMemo(() => {
    const getArr = (k: string) => (searchParams.get(k)?.split(",").filter(Boolean) ?? []);
    return {
      category: searchParams.get("category") ?? undefined,
      rodCount: getArr("rodCount"),
      size: getArr("size"),
      useCase: getArr("useCase"),
      bundleSize: getArr("bundleSize"),
    };
  }, [searchParams]);

  const sort = searchParams.get("sort") ?? "relevance";

  const augmentedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      taxonomy: productTaxonomyMap[p.id] ?? { categorySlugs: [], attributes: {} },
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    let items = augmentedProducts;

    // Category slug filter
    if (filters.category) {
      items = items.filter((p) => p.taxonomy?.categorySlugs?.includes(filters.category!));
    }

    // Attribute filters
    const hasSelected = (arr?: string[]) => Array.isArray(arr) && arr.length > 0;

    if (hasSelected(filters.rodCount)) {
      items = items.filter((p) => {
        const v = p.taxonomy?.attributes?.rodCount;
        const values = Array.isArray(v) ? v : v ? [v] : [];
        return values.some((x) => filters.rodCount!.includes(String(x)));
      });
    }

    if (hasSelected(filters.size)) {
      items = items.filter((p) => {
        const v = p.taxonomy?.attributes?.size;
        const values = Array.isArray(v) ? v : v ? [v] : [];
        return values.some((x) => filters.size!.includes(String(x)));
      });
    }

    if (hasSelected(filters.useCase)) {
      items = items.filter((p) => {
        const values = p.taxonomy?.attributes?.useCase ?? [];
        return values.some((x) => filters.useCase!.includes(String(x)));
      });
    }

    if (hasSelected(filters.bundleSize)) {
      items = items.filter((p) => {
        const v = p.taxonomy?.attributes?.bundleSize;
        return v ? filters.bundleSize!.includes(String(v)) : false;
      });
    }

    return items;
  }, [augmentedProducts, filters]);

  const sortedProducts = useMemo(() => {
    const arr = [...filteredProducts];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [filteredProducts, sort]);

  const handleFiltersChange = (next: Filters) => {
    const params: Record<string, string> = {};
    if (next.category) params.category = next.category;
    if (next.rodCount && next.rodCount.length) params.rodCount = next.rodCount.join(",");
    if (next.size && next.size.length) params.size = next.size.join(",");
    if (next.useCase && next.useCase.length) params.useCase = next.useCase.join(",");
    if (next.bundleSize && next.bundleSize.length) params.bundleSize = next.bundleSize.join(",");
    if (sort && sort !== "relevance") params.sort = sort;
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.rodCount && filters.rodCount.length) params.rodCount = filters.rodCount.join(",");
    if (filters.size && filters.size.length) params.size = filters.size.join(",");
    if (filters.useCase && filters.useCase.length) params.useCase = filters.useCase.join(",");
    if (filters.bundleSize && filters.bundleSize.length) params.bundleSize = filters.bundleSize.join(",");
    if (value && value !== "relevance") params.sort = value;
    setSearchParams(params);
  };

  // SEO meta + JSON-LD
  useEffect(() => {
    document.title = "Shop Organizers & Bangle Boxes | Sister Storage";
    // Meta description
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = "Shop bangle boxes, bundles, and organizers. Filter by rod count, size, and use case.";

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = `${window.location.origin}/shop`;

    // JSON-LD ItemList
    const id = "ld-shop";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    const itemList = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: sortedProducts.slice(0, 24).map((p, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        item: {
          "@type": "Product",
          name: p.name,
          brand: "Sister Storage",
          offers: {
            "@type": "Offer",
            price: p.price,
            priceCurrency: "USD",
            availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          },
        },
      })),
    };
    script.textContent = JSON.stringify(itemList);
    document.head.appendChild(script);
  }, [sortedProducts]);
  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <ShopHero 
        activeCategorySlug={filters.category || undefined}
        onSelectCategory={(slug) => handleFiltersChange({ ...filters, category: slug })}
      />
      
      <Section spacing="lg" width="contained" background="white">
        {/* Mobile: Filters + Sort sticky bar */}
        <div className="md:hidden sticky top-16 z-40 bg-background/90 backdrop-blur p-2 border-b mb-4">
          <div className="flex gap-2">
            <Drawer>
              <DrawerTrigger className="flex-1 rounded-md border px-3 py-2">Filters</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filters</DrawerTitle>
                </DrawerHeader>
                <div className="p-4">
                  <ShopFilters filters={filters} onChange={handleFiltersChange} />
                </div>
                <DrawerFooter>
                  <DrawerClose className="rounded-md border px-3 py-2">Apply</DrawerClose>
                  <button
                    className="text-sm text-muted-foreground"
                    onClick={() =>
                      handleFiltersChange({ category: undefined, rodCount: [], size: [], useCase: [], bundleSize: [] })
                    }
                  >
                    Clear all
                  </button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Desktop: Filters sidebar + Sort control */}
        <div className="hidden md:flex items-center justify-end mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort</span>
            <Select value={sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-6 hidden md:block">
          <ShopFilters filters={filters} onChange={handleFiltersChange} />
        </div>

        <ProductsGrid products={sortedProducts} />
        
        <div className="mt-10 flex justify-center">
          <button className="px-6 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition-colors">
            Load more
          </button>
        </div>
        
        <BenefitsSection benefits={benefits} />
        <TestimonialSection />
      </Section>
    </BaseLayout>
  );
};

export default Shop;
