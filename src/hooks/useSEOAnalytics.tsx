import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, subDays } from "date-fns";

export interface SEOMetric {
  page_path: string;
  page_title: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  avg_position: number;
  recorded_at: string;
}

export interface KeywordRanking {
  id: string;
  keyword: string;
  page_path: string;
  position: number;
  search_volume: number;
  difficulty: number;
  tracked_at: string;
}

export interface PagePerformance {
  page_path: string;
  seo_score: number | null;
  performance_score: number | null;
  accessibility_score: number | null;
  load_time_ms: number | null;
  recorded_at: string;
}

export const useSEOAnalytics = (dateRange: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ["seo-analytics", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_analytics")
        .select("*")
        .gte("recorded_at", startOfDay(dateRange.from).toISOString())
        .lte("recorded_at", endOfDay(dateRange.to).toISOString())
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      return data as SEOMetric[];
    },
  });
};

export const useKeywordRankings = () => {
  return useQuery({
    queryKey: ["keyword-rankings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("keyword_rankings")
        .select("*")
        .order("tracked_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as KeywordRanking[];
    },
  });
};

export const usePagePerformance = () => {
  return useQuery({
    queryKey: ["page-performance"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_performance")
        .select("*")
        .order("recorded_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as PagePerformance[];
    },
  });
};

export const useSEOSummary = (dateRange: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ["seo-summary", dateRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seo_analytics")
        .select("impressions, clicks, ctr, avg_position")
        .gte("recorded_at", startOfDay(dateRange.from).toISOString())
        .lte("recorded_at", endOfDay(dateRange.to).toISOString());

      if (error) throw error;

      // Calculate totals and averages
      const summary = data.reduce(
        (acc, curr) => ({
          totalImpressions: acc.totalImpressions + (curr.impressions || 0),
          totalClicks: acc.totalClicks + (curr.clicks || 0),
          avgCTR: acc.avgCTR + (curr.ctr || 0),
          avgPosition: acc.avgPosition + (curr.avg_position || 0),
          count: acc.count + 1,
        }),
        { totalImpressions: 0, totalClicks: 0, avgCTR: 0, avgPosition: 0, count: 0 }
      );

      return {
        totalImpressions: summary.totalImpressions,
        totalClicks: summary.totalClicks,
        avgCTR: summary.count > 0 ? summary.avgCTR / summary.count : 0,
        avgPosition: summary.count > 0 ? summary.avgPosition / summary.count : 0,
      };
    },
  });
};
