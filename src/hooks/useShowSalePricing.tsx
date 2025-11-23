import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useShowSalePricing() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-settings', 'show-sale-pricing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('enabled')
        .eq('setting_key', 'show_sale_pricing')
        .single();

      if (error) throw error;
      return data.enabled;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  return {
    showSalePricing: data ?? true, // Default to true if not set
    isLoading,
  };
}
