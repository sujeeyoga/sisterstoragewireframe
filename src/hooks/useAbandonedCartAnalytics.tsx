import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';

interface AbandonedCartAnalytics {
  totalAbandoned: number;
  totalValue: number;
  recoveredCount: number;
  remindersSent: number;
  recoveryRate: number;
  pendingValue: number;
}

export const useAbandonedCartAnalytics = (dateRange: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: ['abandoned-cart-analytics', dateRange],
    queryFn: async (): Promise<AbandonedCartAnalytics> => {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .gte('created_at', startOfDay(dateRange.start).toISOString())
        .lte('created_at', endOfDay(dateRange.end).toISOString())
        .is('closed_at', null); // Exclude closed carts from analytics

      if (error) throw error;

      const totalAbandoned = data?.length || 0;
      const totalValue = data?.reduce((sum, cart) => sum + Number(cart.subtotal || 0), 0) || 0;
      const recoveredCount = data?.filter(cart => cart.recovered_at).length || 0;
      const remindersSent = data?.filter(cart => cart.reminder_sent_at).length || 0;
      const recoveryRate = totalAbandoned > 0 ? (recoveredCount / totalAbandoned) * 100 : 0;
      const pendingValue = data
        ?.filter(cart => !cart.recovered_at && !cart.closed_at)
        .reduce((sum, cart) => sum + Number(cart.subtotal || 0), 0) || 0;

      return {
        totalAbandoned,
        totalValue,
        recoveredCount,
        remindersSent,
        recoveryRate,
        pendingValue,
      };
    },
  });
};
