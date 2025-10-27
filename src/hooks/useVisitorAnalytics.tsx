import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, subDays, format, startOfMonth, startOfYear } from 'date-fns';

export type TimeGranularity = 'hour' | 'day' | 'month' | 'year';

interface VisitorAnalyticsData {
  totalVisitors: number;
  uniqueVisitors: number;
  averageDuration: number;
  topCountries: Array<{ country: string; country_name: string; count: number; percentage: number }>;
  topPages: Array<{ page: string; views: number }>;
  timeSeriesData: Array<{ date: string; visitors: number; unique_visitors: number }>;
  hourlyHeatmap: Array<{ day: number; hour: number; visitors: number }>;
  referrerData: Array<{ referrer: string; count: number }>;
}

export const useVisitorAnalytics = (
  dateRange: number = 7,
  granularity: TimeGranularity = 'day'
) => {
  return useQuery({
    queryKey: ['visitor-analytics', dateRange, granularity],
    queryFn: async () => {
      const endDate = new Date();
      const startDate = subDays(endDate, dateRange);

      // Fetch all visitor data for the date range
      const { data: visitors, error } = await supabase
        .from('visitor_analytics')
        .select('*')
        .gte('visited_at', startDate.toISOString())
        .lte('visited_at', endDate.toISOString())
        .order('visited_at', { ascending: true });

      if (error) throw error;
      if (!visitors) return null;

      // Calculate metrics
      const totalVisitors = visitors.length;
      const uniqueVisitors = new Set(visitors.map(v => v.visitor_id)).size;
      const averageDuration = visitors.reduce((sum, v) => sum + (v.duration_seconds || 0), 0) / totalVisitors;

      // Top countries
      const countryMap = new Map<string, { country: string; country_name: string; count: number }>();
      visitors.forEach(v => {
        const key = v.country || 'Unknown';
        const existing = countryMap.get(key);
        if (existing) {
          existing.count++;
        } else {
          countryMap.set(key, {
            country: v.country || 'Unknown',
            country_name: v.country_name || 'Unknown',
            count: 1,
          });
        }
      });
      const topCountries = Array.from(countryMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)
        .map(c => ({
          ...c,
          percentage: (c.count / totalVisitors) * 100,
        }));

      // Top pages
      const pageMap = new Map<string, number>();
      visitors.forEach(v => {
        const page = v.page_path || '/';
        pageMap.set(page, (pageMap.get(page) || 0) + 1);
      });
      const topPages = Array.from(pageMap.entries())
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Time series data
      const timeSeriesMap = new Map<string, { visitors: Set<string>; count: number }>();
      visitors.forEach(v => {
        let dateKey: string;
        const visitDate = new Date(v.visited_at);
        
        switch (granularity) {
          case 'hour':
            dateKey = format(visitDate, 'yyyy-MM-dd HH:00');
            break;
          case 'month':
            dateKey = format(startOfMonth(visitDate), 'yyyy-MM');
            break;
          case 'year':
            dateKey = format(startOfYear(visitDate), 'yyyy');
            break;
          default: // day
            dateKey = format(startOfDay(visitDate), 'yyyy-MM-dd');
        }

        const existing = timeSeriesMap.get(dateKey);
        if (existing) {
          existing.count++;
          existing.visitors.add(v.visitor_id);
        } else {
          timeSeriesMap.set(dateKey, {
            count: 1,
            visitors: new Set([v.visitor_id]),
          });
        }
      });

      const timeSeriesData = Array.from(timeSeriesMap.entries())
        .map(([date, data]) => ({
          date,
          visitors: data.count,
          unique_visitors: data.visitors.size,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Hourly heatmap (day of week vs hour)
      const heatmapMap = new Map<string, number>();
      visitors.forEach(v => {
        const date = new Date(v.visited_at);
        const day = date.getDay(); // 0-6
        const hour = date.getHours(); // 0-23
        const key = `${day}-${hour}`;
        heatmapMap.set(key, (heatmapMap.get(key) || 0) + 1);
      });

      const hourlyHeatmap = [];
      for (let day = 0; day < 7; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const key = `${day}-${hour}`;
          hourlyHeatmap.push({
            day,
            hour,
            visitors: heatmapMap.get(key) || 0,
          });
        }
      }

      // Referrer data
      const referrerMap = new Map<string, number>();
      visitors.forEach(v => {
        const referrer = v.referrer || 'Direct';
        referrerMap.set(referrer, (referrerMap.get(referrer) || 0) + 1);
      });
      const referrerData = Array.from(referrerMap.entries())
        .map(([referrer, count]) => ({ referrer, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const analyticsData: VisitorAnalyticsData = {
        totalVisitors,
        uniqueVisitors,
        averageDuration,
        topCountries,
        topPages,
        timeSeriesData,
        hourlyHeatmap,
        referrerData,
      };

      return analyticsData;
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
};
