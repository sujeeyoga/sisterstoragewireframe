
import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BaseLayout from "@/components/layout/BaseLayout";
import Section from "@/components/layout/Section";
import ShopHero from "@/components/shop/ShopHero";
import ProductsGrid from "@/components/shop/ProductsGrid";
import BenefitsSection from "@/components/shop/BenefitsSection";
import TestimonialSection from "@/components/shop/TestimonialSection";
import ShopFilters, { type Filters } from "@/components/shop/ShopFilters";
import { products, categories, benefits } from "@/data/products";
import { productTaxonomyMap } from "@/data/product-taxonomy";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
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

  const augmentedProducts = useMemo(() => {
    return products.map((p) => ({
      ...p,
      taxonomy: productTaxonomyMap[p.id] ?? { categorySlugs: [], attributes: {} },
    }));
  }, []);

  const filteredProducts = useMemo(() => {
    let items = selectedCategory === "all" ? augmentedProducts : augmentedProducts.filter((p) => p.category === selectedCategory);

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
  }, [augmentedProducts, selectedCategory, filters]);

  const handleFiltersChange = (next: Filters) => {
    const params: Record<string, string> = {};
    if (next.category) params.category = next.category;
    if (next.rodCount && next.rodCount.length) params.rodCount = next.rodCount.join(",");
    if (next.size && next.size.length) params.size = next.size.join(",");
    if (next.useCase && next.useCase.length) params.useCase = next.useCase.join(",");
    if (next.bundleSize && next.bundleSize.length) params.bundleSize = next.bundleSize.join(",");
    setSearchParams(params);
  };

  return (
    <BaseLayout variant="standard" pageId="shop" spacing="normal">
      <ShopHero 
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />
      
      <Section spacing="lg" width="contained" background="white">
        <div className="mb-6">
          <ShopFilters filters={filters} onChange={handleFiltersChange} />
        </div>
        <ProductsGrid products={filteredProducts} />
        
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
