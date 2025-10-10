import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NewsletterSettings {
  enabled: boolean;
  incentiveText: string;
  defaultChecked: boolean;
}

export function useNewsletterSettings() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-settings', 'newsletter-optin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .eq('setting_key', 'newsletter_optin')
        .maybeSingle();

      if (error) throw error;

      const value = data?.setting_value as any;
      return {
        enabled: data?.enabled || false,
        incentiveText: value?.incentiveText || 'Get 10% off your next order!',
        defaultChecked: value?.defaultChecked || false,
      } as NewsletterSettings;
    },
    staleTime: 30000,
  });

  return {
    newsletter: data,
    isLoading,
  };
}
