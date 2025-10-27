import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, format, eachDayOfInterval } from 'date-fns';

interface DailyOrderData {
  date: string;
  revenue: number;
  orders: number;
  averageOrderValue: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

export function useOrderTimeSeriesAnalytics({ start, end }: DateRange) {
  return useQuery({
    queryKey: ['order-time-series', start.toISOString(), end.toISOString()],
    queryFn: async (): Promise<DailyOrderData[]> => {
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

      // Combine orders with dates
      const allOrders = [
        ...(wooOrders || []).map(o => ({ 
          total: Number(o.total), 
          date: new Date(o.date_created)
        })),
        ...(stripeOrders || []).map(o => ({ 
          total: Number(o.total), 
          date: new Date(o.created_at)
        }))
      ];

      // Generate all dates in range
      const daysInRange = eachDayOfInterval({ start, end });
      
      // Group orders by day
      const dailyData: Record<string, { revenue: number; orders: number }> = {};
      
      daysInRange.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        dailyData[dateKey] = { revenue: 0, orders: 0 };
      });

      allOrders.forEach(order => {
        const dateKey = format(startOfDay(order.date), 'yyyy-MM-dd');
        if (dailyData[dateKey]) {
          dailyData[dateKey].revenue += order.total;
          dailyData[dateKey].orders += 1;
        }
      });

      // Convert to array format for charts
      return Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          revenue: Math.round(data.revenue * 100) / 100,
          orders: data.orders,
          averageOrderValue: data.orders > 0 ? Math.round((data.revenue / data.orders) * 100) / 100 : 0,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
    refetchInterval: 60000,
  });
}
