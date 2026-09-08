import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { US_SHIPPING_ENABLED } from '@/config/features';

const SETTING_KEY = 'us_shipping_enabled';

/**
 * Whether the store currently accepts United States orders.
 * Source of truth is store_settings.us_shipping_enabled; if the row is missing
 * or unreadable we fall back to the code default in src/config/features.ts.
 */
export const useUsShippingEnabled = () => {
  const query = useQuery({
    queryKey: ['us-shipping-enabled'],
    queryFn: async (): Promise<{ enabled: boolean; readable: boolean }> => {
      try {
        const { data, error } = await (supabase as any)
          .from('store_settings')
          .select('setting_value')
          .eq('setting_key', SETTING_KEY)
          .maybeSingle();

        if (error) return { enabled: US_SHIPPING_ENABLED, readable: false };
        if (!data) return { enabled: US_SHIPPING_ENABLED, readable: true };

        const value = data.setting_value;
        const enabled =
          typeof value === 'boolean' ? value : Boolean(value?.enabled);
        return { enabled, readable: true };
      } catch {
        return { enabled: US_SHIPPING_ENABLED, readable: false };
      }
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    usShippingEnabled: query.data?.enabled ?? US_SHIPPING_ENABLED,
    settingReadable: query.data?.readable ?? false,
    isLoading: query.isLoading,
  };
};

export const useSetUsShipping = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await (supabase as any)
        .from('store_settings')
        .upsert(
          {
            setting_key: SETTING_KEY,
            setting_value: { enabled },
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'setting_key' }
        );

      if (error) throw error;
      return enabled;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['us-shipping-enabled'] });
    },
  });
};
