import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ShippingInfo {
  zoneName: string | null;
  zoneDescription: string | null;
  matchedRule: {
    type: string;
    value: string;
  } | null;
  rateDetails: {
    methodName: string;
    rateAmount: number;
    isFree: boolean;
    freeThreshold: number | null;
    source?: string;
  } | null;
  calculatedShipping: number;
}

export const useOrderShippingInfo = (shippingAddress: any, orderTotal: number) => {
  return useQuery({
    queryKey: ['order-shipping-info', shippingAddress, orderTotal],
    queryFn: async (): Promise<ShippingInfo> => {
      if (!shippingAddress) {
        return {
          zoneName: null,
          zoneDescription: null,
          matchedRule: null,
          rateDetails: null,
          calculatedShipping: 0,
        };
      }

      try {
        // Calculate shipping using the edge function
        const { data, error } = await supabase.functions.invoke('calculate-shipping-zones', {
          body: {
            address: {
              city: shippingAddress.city,
              province: shippingAddress.state || shippingAddress.province,
              country: shippingAddress.country,
              postalCode: shippingAddress.postcode || shippingAddress.postal_code,
            },
            subtotal: orderTotal,
          },
        });

        if (error) throw error;

        return {
          zoneName: data.zone?.name || null,
          zoneDescription: data.zone?.description || null,
          matchedRule: data.matchedRule ? {
            type: data.matchedRule.rule_type,
            value: data.matchedRule.rule_value,
          } : null,
          rateDetails: data.appliedRate ? {
            methodName: data.appliedRate.method_name,
            rateAmount: data.appliedRate.rate_amount,
            isFree: data.appliedRate.is_free,
            freeThreshold: data.appliedRate.free_threshold || null,
            source: data.source || 'database',
          } : null,
          calculatedShipping: data.appliedRate?.rate_amount || 0,
        };
      } catch (error) {
        console.error('Error fetching shipping info:', error);
        return {
          zoneName: null,
          zoneDescription: null,
          matchedRule: null,
          rateDetails: null,
          calculatedShipping: 0,
        };
      }
    },
    enabled: !!shippingAddress,
  });
};
