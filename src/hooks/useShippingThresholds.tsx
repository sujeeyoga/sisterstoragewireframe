import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ShippingThreshold {
  zone_name: string;
  description: string | null;
  priority: number;
  rules: Array<{
    type: string;
    value: string;
  }>;
  free_shipping_thresholds: Array<{
    method: string;
    threshold: number;
    rate: number;
  }>;
}

interface FallbackSettings {
  rate: number;
  method: string;
  enabled: boolean;
}

export function useShippingThresholds() {
  return useQuery({
    queryKey: ['shipping-thresholds'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-shipping-thresholds');
      
      if (error) throw error;
      
      return data as {
        thresholds: ShippingThreshold[];
        fallback: FallbackSettings | null;
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
