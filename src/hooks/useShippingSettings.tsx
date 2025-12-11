import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ShippingSettingsData {
  toronto_flat_rate: {
    enabled: boolean;
    rate: number;
  };
  gta_free_shipping: {
    enabled: boolean;
    threshold: number;
  };
  default_shipping: {
    provider: string;
    fallback_rate: number;
  };
}

export const useShippingSettings = () => {
  const { data: shippingSettings, isLoading } = useQuery({
    queryKey: ['shipping-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'shipping_settings')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Default settings
        return {
          toronto_flat_rate: { enabled: true, rate: 3.99 },
          gta_free_shipping: { enabled: true, threshold: 60 },
          default_shipping: { provider: 'stallion', fallback_rate: 9.99 },
        } as ShippingSettingsData;
      }

      return data.setting_value as unknown as ShippingSettingsData;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    shippingSettings,
    isLoading,
  };
};
