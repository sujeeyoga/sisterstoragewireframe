import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SETTING_KEY = 'use_database_shipping_rates';

/**
 * Whether checkout quotes come from the shipping zones saved in the dashboard
 * (true) or from the built-in rules in the shipping function (false).
 * Defaults to false so a half-configured zone list can never go live by accident.
 */
export const useShippingRateSource = () => {
  const query = useQuery({
    queryKey: ['use-database-shipping-rates'],
    queryFn: async (): Promise<{ enabled: boolean; readable: boolean }> => {
      try {
        const { data, error } = await (supabase as any)
          .from('store_settings')
          .select('setting_value, enabled')
          .eq('setting_key', SETTING_KEY)
          .maybeSingle();

        if (error) return { enabled: false, readable: false };
        if (!data) return { enabled: false, readable: true };

        const value = data.setting_value;
        const enabled =
          typeof value === 'boolean' ? value : Boolean(value?.enabled ?? data.enabled);
        return { enabled, readable: true };
      } catch {
        return { enabled: false, readable: false };
      }
    },
    staleTime: 1000 * 60,
  });

  return {
    useDatabaseRates: query.data?.enabled ?? false,
    settingReadable: query.data?.readable ?? false,
    isLoading: query.isLoading,
  };
};

export const useSetShippingRateSource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (enabled: boolean) => {
      const { error } = await (supabase as any)
        .from('store_settings')
        .upsert(
          {
            setting_key: SETTING_KEY,
            setting_value: { enabled },
            enabled,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'setting_key' }
        );

      if (error) throw error;
      return enabled;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['use-database-shipping-rates'] });
    },
  });
};
