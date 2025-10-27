import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';

interface OrderAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  pendingOrders: number;
  fulfilledOrders: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

export function useOrderAnalytics({ start, end }: DateRange) {
  return useQuery({
    queryKey: ['order-analytics', start.toISOString(), end.toISOString()],
    queryFn: async (): Promise<OrderAnalytics> => {
      const startDate = startOfDay(start).toISOString();
      const endDate = endOfDay(end).toISOString();

      // Fetch WooCommerce orders
      const { data: wooOrders, error: wooError } = await supabase
        .from('woocommerce_orders')
        .select('total, status, date_created')
        .gte('date_created', startDate)
        .lte('date_created', endDate);

      if (wooError) throw wooError;

      // Fetch Stripe orders
      const { data: stripeOrders, error: stripeError } = await supabase
        .from('orders')
        .select('total, status, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (stripeError) throw stripeError;

      // Combine and calculate metrics
      const allOrders = [
        ...(wooOrders || []).map(o => ({ 
          total: Number(o.total), 
          status: o.status 
        })),
        ...(stripeOrders || []).map(o => ({ 
          total: Number(o.total), 
          status: o.status 
        }))
      ];

      const totalOrders = allOrders.length;
      const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      
      const pendingOrders = allOrders.filter(o => 
        o.status === 'pending' || o.status === 'processing'
      ).length;
      
      const fulfilledOrders = allOrders.filter(o => 
        o.status === 'completed'
      ).length;

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        pendingOrders,
        fulfilledOrders
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });
}
