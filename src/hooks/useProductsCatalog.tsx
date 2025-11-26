import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

/**
 * Hook to fetch all products from the database.
 * This replaces the static products import and uses the database as single source of truth.
 */
export const useProductsCatalog = () => {
  return useQuery({
    queryKey: ['products-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('visible', true)
        .eq('in_stock', true)
        .order('name');

      if (error) throw error;

      // Transform database products to match Product type
      const products: Product[] = (data || []).map((dbProduct) => {
        const images = Array.isArray(dbProduct.images) 
          ? dbProduct.images.map((img: any) => img.src || img)
          : [];

        const categories = Array.isArray(dbProduct.categories)
          ? dbProduct.categories.map((cat: any) => cat.slug || cat)
          : [];

        return {
          id: dbProduct.slug,
          name: dbProduct.name,
          description: dbProduct.description || '',
          shortDescription: dbProduct.short_description || '',
          price: Number(dbProduct.sale_price || dbProduct.regular_price || dbProduct.price || 0),
          category: categories[0] || 'organizers',
          categories: categories,
          slug: dbProduct.slug,
          images: images,
          stock: dbProduct.stock_quantity || 0,
          inStock: dbProduct.in_stock || false,
          sku: dbProduct.id.toString(),
          features: [],
          material: '',
          attributes: {},
          caption: dbProduct.short_description || '',
          funnelStage: '',
          color: '#c80056',
        } as Product;
      });

      return products;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to get a single product by slug from the catalog
 */
export const useProductBySlug = (slug: string) => {
  const { data: products, ...rest } = useProductsCatalog();
  
  return {
    ...rest,
    data: products?.find(p => p.slug === slug),
  };
};
