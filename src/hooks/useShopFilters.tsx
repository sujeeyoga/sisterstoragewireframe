import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "@/data/products";
import { productTaxonomyMap } from "@/data/product-taxonomy";

export interface Filters {
  category?: string;
  rodCount: string[];
  size: string[];
  useCase: string[];
  bundleSize: string[];
}

export const useShopFilters = () => {
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

    // Category filter
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

  const updateFilters = (next: Filters) => {
    const params: Record<string, string> = {};
    if (next.category) params.category = next.category;
    if (next.rodCount && next.rodCount.length) params.rodCount = next.rodCount.join(",");
    if (next.size && next.size.length) params.size = next.size.join(",");
    if (next.useCase && next.useCase.length) params.useCase = next.useCase.join(",");
    if (next.bundleSize && next.bundleSize.length) params.bundleSize = next.bundleSize.join(",");
    if (sort && sort !== "relevance") params.sort = sort;
    setSearchParams(params);
  };

  const updateSort = (value: string) => {
    const params: Record<string, string> = {};
    if (filters.category) params.category = filters.category;
    if (filters.rodCount && filters.rodCount.length) params.rodCount = filters.rodCount.join(",");
    if (filters.size && filters.size.length) params.size = filters.size.join(",");
    if (filters.useCase && filters.useCase.length) params.useCase = filters.useCase.join(",");
    if (filters.bundleSize && filters.bundleSize.length) params.bundleSize = filters.bundleSize.join(",");
    if (value && value !== "relevance") params.sort = value;
    setSearchParams(params);
  };

  return {
    filters,
    sort,
    sortedProducts,
    updateFilters,
    updateSort,
  };
};