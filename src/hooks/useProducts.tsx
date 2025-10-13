import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DatabaseProduct, transformProduct, Product } from '@/types/product';
import { products as fallbackProducts } from '@/data/products';

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
        .order('name');

      if (error) {
        console.error('Error fetching products:', error);
        // Fallback to static products if database fails
        return fallbackProducts;
      }

      if (!data || data.length === 0) {
        console.warn('No products in database, using fallback');
        return fallbackProducts;
      }

      // Transform products and merge with static data for missing images
      return data.map((dbProduct: any) => {
        const transformed = transformProduct(dbProduct);
        
        // If product has no images or empty images array, use static data as fallback
        if (!transformed.images || transformed.images.length === 0 || !transformed.images[0]) {
          const staticProduct = fallbackProducts.find(p => 
            p.id === transformed.id || 
            p.sku === transformed.sku ||
            p.slug === transformed.slug
          );
          
          if (staticProduct?.images && staticProduct.images.length > 0) {
            return { ...transformed, images: staticProduct.images };
          }
        }
        
        return transformed;
      });
    },
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
        // Fallback to static products
        const fallback = fallbackProducts.find(p => p.id === idOrSlug || p.sku === idOrSlug || p.slug === idOrSlug);
        if (!fallback) throw new Error('Product not found');
        return fallback;
      }

      const transformed = transformProduct(data as any);
      
      // If product has no images, use static data as fallback
      if (!transformed.images || transformed.images.length === 0 || !transformed.images[0]) {
        const staticProduct = fallbackProducts.find(p => 
          p.id === transformed.id || 
          p.sku === transformed.sku ||
          p.slug === transformed.slug
        );
        
        if (staticProduct?.images && staticProduct.images.length > 0) {
          return { ...transformed, images: staticProduct.images };
        }
      }
      
      return transformed;
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
          .order('name');

      if (error || !data) {
        return fallbackProducts;
      }

      return data.map((dbProduct: any) => {
        const transformed = transformProduct(dbProduct);
        
        // If product has no images, use static data as fallback
        if (!transformed.images || transformed.images.length === 0 || !transformed.images[0]) {
          const staticProduct = fallbackProducts.find(p => 
            p.id === transformed.id || 
            p.sku === transformed.sku ||
            p.slug === transformed.slug
          );
          
          if (staticProduct?.images && staticProduct.images.length > 0) {
            return { ...transformed, images: staticProduct.images };
          }
        }
        
        return transformed;
      });
      }

      // Query products by checking if category slug exists in categories array
      const { data, error } = await supabase
        .from('woocommerce_products')
        .select('*')
        .eq('in_stock', true)
        .eq('visible', true)
        .order('name');

      if (error || !data) {
        console.error('Error fetching products by category:', error);
        return fallbackProducts.filter(p => p.category === category);
      }

      // Filter products by category slug on the client side
      const filteredData = data.filter((product: any) => {
        const categories = product.categories || [];
        return categories.some((cat: any) => cat.slug === category);
      });

      return filteredData.map((dbProduct: any) => {
        const transformed = transformProduct(dbProduct);
        
        // If product has no images, use static data as fallback
        if (!transformed.images || transformed.images.length === 0 || !transformed.images[0]) {
          const staticProduct = fallbackProducts.find(p => 
            p.id === transformed.id || 
            p.sku === transformed.sku ||
            p.slug === transformed.slug
          );
          
          if (staticProduct?.images && staticProduct.images.length > 0) {
            return { ...transformed, images: staticProduct.images };
          }
        }
        
        return transformed;
      });
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
        .order('id')
        .limit(limit);

      if (error || !data) {
        console.error('Error fetching best sellers:', error);
        return fallbackProducts.filter(p => p.bestSeller).slice(0, limit);
      }

      return data.map((dbProduct: any) => {
        const transformed = transformProduct(dbProduct);
        
        // If product has no images, use static data as fallback
        if (!transformed.images || transformed.images.length === 0 || !transformed.images[0]) {
          const staticProduct = fallbackProducts.find(p => 
            p.id === transformed.id || 
            p.sku === transformed.sku ||
            p.slug === transformed.slug
          );
          
          if (staticProduct?.images && staticProduct.images.length > 0) {
            return { ...transformed, images: staticProduct.images };
          }
        }
        
        return transformed;
      });
    },
    staleTime: 1000 * 60 * 5,
  });
}
