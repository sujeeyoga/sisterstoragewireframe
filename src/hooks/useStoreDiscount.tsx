import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StoreDiscount {
  enabled: boolean;
  percentage: number;
  name: string;
}

export function useStoreDiscount() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-discount'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'store_wide_discount')
        .single();

      if (error) throw error;

      const value = data.setting_value as any;
      return {
        enabled: data.enabled,
        percentage: value?.percentage || 0,
        name: value?.name || 'Store-Wide Sale',
      } as StoreDiscount;
    },
    staleTime: 30000, // Cache for 30 seconds
  });

  const applyDiscount = (price: number): number => {
    if (!data?.enabled || !data?.percentage) return price;
    return price * (1 - data.percentage / 100);
  };

  const getDiscountAmount = (price: number): number => {
    if (!data?.enabled || !data?.percentage) return 0;
    return price * (data.percentage / 100);
  };

  return {
    discount: data,
    isLoading,
    applyDiscount,
    getDiscountAmount,
  };
}
