import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface GiftOptions {
  enabled: boolean;
  charLimit: number;
  wrappingEnabled: boolean;
  wrappingPrice: number;
}

export function useGiftOptions() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-settings', 'gift-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'gift_messages')
        .maybeSingle();

      if (error) throw error;

      const value = data?.setting_value as any;
      return {
        enabled: data?.enabled || false,
        charLimit: value?.charLimit || 250,
        wrappingEnabled: value?.wrappingEnabled || false,
        wrappingPrice: value?.wrappingPrice || 5.00,
      } as GiftOptions;
    },
    staleTime: 30000,
  });

  return {
    giftOptions: data,
    isLoading,
  };
}
