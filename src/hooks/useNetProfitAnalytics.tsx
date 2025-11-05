import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns";

export interface NetProfitAnalytics {
  grossRevenue: number;
  shippingCosts: number;
  refunds: number;
  taxCollected: number;
  netProfit: number;
  profitMargin: number;
  orderCount: number;
  avgProfitPerOrder: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

export const useNetProfitAnalytics = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ["net-profit-analytics", dateRange.start, dateRange.end],
    queryFn: async () => {
      const startDate = startOfDay(dateRange.start).toISOString();
      const endDate = endOfDay(dateRange.end).toISOString();

      // Fetch Stripe orders
      const { data: stripeOrders, error: stripeError } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startDate)
        .lte("created_at", endDate);

      if (stripeError) throw stripeError;

      // Fetch WooCommerce orders
      const { data: wooOrders, error: wooError } = await supabase
        .from("woocommerce_orders")
        .select("*")
        .gte("date_created", startDate)
        .lte("date_created", endDate);

      if (wooError) throw wooError;

      // Combine and calculate metrics
      const allOrders = [
        ...(stripeOrders || []).map(o => ({
          total: Number(o.total) || 0,
          shipping: Number(o.shipping) || 0,
          tax: Number(o.tax) || 0,
          stallionCost: Number(o.stallion_cost) || 0,
          refundAmount: Number(o.refund_amount) || 0,
        })),
        ...(wooOrders || []).map(o => {
          const shippingData = o.shipping as any;
          return {
            total: Number(o.total) || 0,
            shipping: Number(shippingData?.total || 0),
            tax: 0, // WooCommerce doesn't track tax separately in our schema
            stallionCost: Number(o.stallion_cost) || 0,
            refundAmount: Number(o.refund_amount) || 0,
          };
        })
      ];

      const grossRevenue = allOrders.reduce((sum, o) => sum + o.total, 0);
      const shippingCosts = allOrders.reduce((sum, o) => sum + o.stallionCost, 0);
      const refunds = allOrders.reduce((sum, o) => sum + o.refundAmount, 0);
      const taxCollected = allOrders.reduce((sum, o) => sum + o.tax, 0);
      
      const netProfit = grossRevenue - shippingCosts - refunds;
      const profitMargin = grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0;
      const orderCount = allOrders.length;
      const avgProfitPerOrder = orderCount > 0 ? netProfit / orderCount : 0;

      console.log('Profit Analytics Debug:', {
        stripeOrdersCount: stripeOrders?.length || 0,
        wooOrdersCount: wooOrders?.length || 0,
        totalOrders: orderCount,
        grossRevenue,
        shippingCosts,
        refunds,
        netProfit,
        profitMargin,
        sampleOrder: allOrders[0]
      });

      return {
        grossRevenue,
        shippingCosts,
        refunds,
        taxCollected,
        netProfit,
        profitMargin,
        orderCount,
        avgProfitPerOrder,
      } as NetProfitAnalytics;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};
