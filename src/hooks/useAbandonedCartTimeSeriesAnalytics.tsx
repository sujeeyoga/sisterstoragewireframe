import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, format, eachDayOfInterval } from 'date-fns';

interface DailyAbandonedCartData {
  date: string;
  abandoned: number;
  recovered: number;
  recoveryRate: number;
  value: number;
}

export const useAbandonedCartTimeSeriesAnalytics = (dateRange: { start: Date; end: Date }) => {
  return useQuery({
    queryKey: ['abandoned-cart-time-series', dateRange],
    queryFn: async (): Promise<DailyAbandonedCartData[]> => {
      const { data, error } = await supabase
        .from('abandoned_carts')
        .select('*')
        .gte('created_at', startOfDay(dateRange.start).toISOString())
        .lte('created_at', endOfDay(dateRange.end).toISOString());

      if (error) throw error;

      // Generate all dates in range
      const daysInRange = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
      
      // Group carts by day
      const dailyData: Record<string, { abandoned: number; recovered: number; value: number }> = {};
      
      daysInRange.forEach(day => {
        const dateKey = format(day, 'yyyy-MM-dd');
        dailyData[dateKey] = { abandoned: 0, recovered: 0, value: 0 };
      });

      data?.forEach(cart => {
        const dateKey = format(startOfDay(new Date(cart.created_at)), 'yyyy-MM-dd');
        if (dailyData[dateKey]) {
          dailyData[dateKey].abandoned += 1;
          dailyData[dateKey].value += Number(cart.subtotal || 0);
          if (cart.recovered_at) {
            dailyData[dateKey].recovered += 1;
          }
        }
      });

      // Convert to array format for charts
      return Object.entries(dailyData)
        .map(([date, data]) => ({
          date,
          abandoned: data.abandoned,
          recovered: data.recovered,
          recoveryRate: data.abandoned > 0 ? Math.round((data.recovered / data.abandoned) * 100) : 0,
          value: Math.round(data.value * 100) / 100,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));
    },
  });
};
