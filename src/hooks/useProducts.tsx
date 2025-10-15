import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseProduct, transformProduct, Product } from '@/types/product';

// Fetch all products from database
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('in_stock', true)
        .eq('visible', true)
        .neq('slug', 'multipurpose-box-1-large-box')
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('No products in database');
        return [];
      }

      // Transform products
      return data.map((dbProduct: any) => transformProduct(dbProduct));
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

// Fetch single product by ID or slug
export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: ['product', idOrSlug],
    queryFn: async () => {
      // Try to find by ID first (if numeric)
      const isNumeric = /^\d+$/.test(idOrSlug);
      
      let query = supabase.from('woocommerce_products').select('*');
      
      if (isNumeric) {
        query = query.eq('id', parseInt(idOrSlug));
      } else {
        query = query.eq('slug', idOrSlug);
      }

      const { data, error } = await query.maybeSingle();

      if (error || !data) {
        console.error('Error fetching product:', error);
        throw new Error('Product not found');
      }

      return transformProduct(data as any);
    },
    enabled: !!idOrSlug,
    staleTime: 1000 * 60 * 5,
  });
}

// Fetch products by category
export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      if (category === 'all') {
        const { data, error } = await supabase
          .from('woocommerce_products')
          .select('*')
          .eq('in_stock', true)
          .eq('visible', true)
          .neq('slug', 'multipurpose-box-1-large-box')
          .order('name');

      if (error || !data) {
        return [];
      }

      return data.map((dbProduct: any) => transformProduct(dbProduct));
      }

      // Query products by checking if category slug exists in categories array
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('in_stock', true)
        .eq('visible', true)
        .neq('slug', 'multipurpose-box-1-large-box')
        .order('name');

      if (error || !data) {
        console.error('Error fetching products by category:', error);
        return [];
      }

      // Filter products by category slug on the client side
      const filteredData = data.filter((product: any) => {
        const categories = product.categories || [];
        return categories.some((cat: any) => cat.slug === category);
      });

      return filteredData.map((dbProduct: any) => transformProduct(dbProduct));
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Get best sellers (can be filtered by meta_data or just popular products)
export function useBestSellers(limit: number = 4) {
  return useQuery({
    queryKey: ['products', 'bestsellers', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('in_stock', true)
        .eq('visible', true)
        .neq('slug', 'multipurpose-box-1-large-box')
        .order('id')
        .limit(limit);

      if (error || !data) {
        console.error('Error fetching best sellers:', error);
        return [];
      }

      return data.map((dbProduct: any) => transformProduct(dbProduct));
    },
    staleTime: 1000 * 60 * 5,
  });
}
