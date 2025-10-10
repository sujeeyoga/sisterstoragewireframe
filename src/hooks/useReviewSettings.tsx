import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ReviewSettings {
  enabled: boolean;
  requirePurchase: boolean;
  autoRequestDays: number;
  minRating: number;
}

export function useReviewSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-settings', 'product-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'product_reviews')
        .maybeSingle();

      if (error) throw error;

      const value = data?.setting_value as any;
      return {
        enabled: data?.enabled || false,
        requirePurchase: value?.requirePurchase !== false,
        autoRequestDays: value?.autoRequestDays || 7,
        minRating: value?.minRating || 1,
      } as ReviewSettings;
    },
    staleTime: 30000,
  });

  return {
    reviewSettings: data,
    isLoading,
  };
}
