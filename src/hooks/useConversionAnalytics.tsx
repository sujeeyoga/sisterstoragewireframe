import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, format, eachDayOfInterval } from 'date-fns';

export interface DailyConversionData {
  date: string;
  visitors: number;
  uniqueVisitors: number;
  orders: number;
  revenue: number;
  conversionRate: number;
  viewsPerSale: number;
}

export interface ConversionAnalytics {
  totalVisitors: number;
  uniqueVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  overallConversionRate: number;
  averageViewsPerSale: number;
  averageOrderValue: number;
  dailyData: DailyConversionData[];
  bestDay: DailyConversionData | null;
  worstDay: DailyConversionData | null;
}

interface DateRange {
  start: Date;
  end: Date;
}

export function useConversionAnalytics({ start, end }: DateRange) {
  return useQuery({
    queryKey: ['conversion-analytics', start.toISOString(), end.toISOString()],
    queryFn: async (): Promise<ConversionAnalytics> => {
      const startDate = startOfDay(start).toISOString();
      const endDate = endOfDay(end).toISOString();

      // Fetch visitor data
      const { data: visitors, error: visitorError } = await supabase
        .from('visitor_analytics')
        .select('visitor_id, visited_at')
        .gte('visited_at', startDate)
        .lte('visited_at', endDate);

      if (visitorError) throw visitorError;

      // Fetch WooCommerce orders
      const { data: wooOrders, error: wooError } = await supabase
        .from('woocommerce_orders')
        .select('total, date_created')
        .gte('date_created', startDate)
        .lte('date_created', endDate);

      if (wooError) throw wooError;

      // Fetch Stripe orders
      const { data: stripeOrders, error: stripeError } = await supabase
        .from('orders')
        .select('total, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (stripeError) throw stripeError;

      // Generate all dates in range
      const daysInRange = eachDayOfInterval({ start, end });
      
      // Initialize daily data structure
      const dailyDataMap: Record<string, {
        visitors: Set<string>;
        totalVisits: number;
        orders: number;
        revenue: number;
      }> = {};

      daysInRange.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        dailyDataMap[dateKey] = {
          visitors: new Set(),
          totalVisits: 0,
          orders: 0,
          revenue: 0
        };
      });

      // Process visitor data
      visitors?.forEach(visitor => {
        const dateKey = format(startOfDay(new Date(visitor.visited_at)), 'yyyy-MM-dd');
        if (dailyDataMap[dateKey]) {
          dailyDataMap[dateKey].visitors.add(visitor.visitor_id);
          dailyDataMap[dateKey].totalVisits += 1;
        }
      });

      // Process WooCommerce orders
      wooOrders?.forEach(order => {
        const dateKey = format(startOfDay(new Date(order.date_created)), 'yyyy-MM-dd');
        if (dailyDataMap[dateKey]) {
          dailyDataMap[dateKey].orders += 1;
          dailyDataMap[dateKey].revenue += Number(order.total || 0);
        }
      });

      // Process Stripe orders
      stripeOrders?.forEach(order => {
        const dateKey = format(startOfDay(new Date(order.created_at)), 'yyyy-MM-dd');
        if (dailyDataMap[dateKey]) {
          dailyDataMap[dateKey].orders += 1;
          dailyDataMap[dateKey].revenue += Number(order.total || 0);
        }
      });

      // Convert to array and calculate metrics
      const dailyData: DailyConversionData[] = Object.entries(dailyDataMap)
        .map(([date, data]) => {
          const uniqueVisitors = data.visitors.size;
          const conversionRate = uniqueVisitors > 0 
            ? (data.orders / uniqueVisitors) * 100 
            : 0;
          const viewsPerSale = data.orders > 0 
            ? data.totalVisits / data.orders 
            : 0;

          return {
            date,
            visitors: data.totalVisits,
            uniqueVisitors,
            orders: data.orders,
            revenue: data.revenue,
            conversionRate: Math.round(conversionRate * 100) / 100,
            viewsPerSale: Math.round(viewsPerSale * 100) / 100,
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      // Calculate overall metrics
      const totalVisitors = visitors?.length || 0;
      const uniqueVisitorsSet = new Set(visitors?.map(v => v.visitor_id) || []);
      const uniqueVisitors = uniqueVisitorsSet.size;
      const totalOrders = (wooOrders?.length || 0) + (stripeOrders?.length || 0);
      const totalRevenue = [
        ...(wooOrders || []).map(o => Number(o.total || 0)),
        ...(stripeOrders || []).map(o => Number(o.total || 0))
      ].reduce((sum, total) => sum + total, 0);

      const overallConversionRate = uniqueVisitors > 0 
        ? (totalOrders / uniqueVisitors) * 100 
        : 0;
      const averageViewsPerSale = totalOrders > 0 
        ? totalVisitors / totalOrders 
        : 0;
      const averageOrderValue = totalOrders > 0 
        ? totalRevenue / totalOrders 
        : 0;

      // Find best and worst performing days (by conversion rate, excluding days with 0 orders)
      const daysWithOrders = dailyData.filter(d => d.orders > 0);
      const bestDay = daysWithOrders.length > 0
        ? daysWithOrders.reduce((best, current) => 
            current.conversionRate > best.conversionRate ? current : best
          )
        : null;
      const worstDay = daysWithOrders.length > 0
        ? daysWithOrders.reduce((worst, current) => 
            current.conversionRate < worst.conversionRate ? current : worst
          )
        : null;

      return {
        totalVisitors,
        uniqueVisitors,
        totalOrders,
        totalRevenue,
        overallConversionRate: Math.round(overallConversionRate * 100) / 100,
        averageViewsPerSale: Math.round(averageViewsPerSale * 100) / 100,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        dailyData,
        bestDay,
        worstDay,
      };
    },
    staleTime: 60000,
    refetchInterval: 60000,
  });
}
