import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FreeGiftPromotion {
  enabled: boolean;
  min_order_amount: number;
  gift_product_id: number;
  countries: string[];
  display_message: string;
}

export function useFreeGiftPromotion() {
  const { data, isLoading } = useQuery({
    queryKey: ['free-gift-promotion'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'us_free_gift_promotion')
        .single();

      if (error) {
        // If setting doesn't exist yet, return default disabled state
        if (error.code === 'PGRST116') {
          return {
            enabled: false,
            min_order_amount: 100,
            gift_product_id: 25814005,
            countries: ['US'],
            display_message: 'Free Medium Bangle Box with orders over $100! 🎁',
          } as FreeGiftPromotion;
        }
        throw error;
      }

      const value = data.setting_value as any;
      return {
        enabled: data.enabled,
        min_order_amount: value?.min_order_amount || 100,
        gift_product_id: value?.gift_product_id || 25814005,
        countries: value?.countries || ['US'],
        display_message: value?.display_message || 'Free Medium Bangle Box with orders over $100! 🎁',
      } as FreeGiftPromotion;
    },
    staleTime: 30000,
  });

  const qualifiesForGift = (country: string, subtotal: number): boolean => {
    if (!data?.enabled) return false;
    if (!data.countries.includes(country)) return false;
    return subtotal >= data.min_order_amount;
  };

  return {
    promotion: data,
    isLoading,
    qualifiesForGift,
  };
}
