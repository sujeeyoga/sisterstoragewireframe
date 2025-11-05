import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DateRange {
  start: Date;
  end: Date;
}

interface ProductProfit {
  name: string;
  quantity: number;
  revenue: number;
  shippingCost: number;
  refunds: number;
  profit: number;
  profitMargin: number;
}

export const useProductProfitAnalytics = (dateRange: DateRange) => {
  return useQuery({
    queryKey: ['product-profit-analytics', dateRange],
    queryFn: async () => {
      // Fetch WooCommerce orders with shipping costs
      const { data: wooOrders } = await supabase
        .from('woocommerce_orders')
        .select('line_items, total, shipping, refund_amount, stallion_cost')
        .gte('date_created', dateRange.start.toISOString())
        .lte('date_created', dateRange.end.toISOString());

      // Fetch Stripe orders with shipping costs
      const { data: stripeOrders } = await supabase
        .from('orders')
        .select('items, subtotal, shipping, refund_amount, stallion_cost')
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString())
        .eq('payment_status', 'paid');

      const productMap = new Map<string, ProductProfit>();

      // Process WooCommerce orders
      wooOrders?.forEach(order => {
        const items = order.line_items as any[];
        const orderTotal = Number(order.total || 0);
        const orderShipping = Number(order.stallion_cost || 0);
        const orderRefund = Number(order.refund_amount || 0);

        items?.forEach(item => {
          const itemRevenue = Number(item.total || 0);
          const itemProportion = orderTotal > 0 ? itemRevenue / orderTotal : 0;
          const allocatedShipping = itemProportion * orderShipping;
          const allocatedRefund = itemProportion * orderRefund;
          const itemProfit = itemRevenue - allocatedShipping - allocatedRefund;
          const itemMargin = itemRevenue > 0 ? (itemProfit / itemRevenue) * 100 : 0;

          const existing = productMap.get(item.name) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
            shippingCost: 0,
            refunds: 0,
            profit: 0,
            profitMargin: 0
          };

          const newQuantity = existing.quantity + item.quantity;
          const newRevenue = existing.revenue + itemRevenue;
          const newShipping = existing.shippingCost + allocatedShipping;
          const newRefunds = existing.refunds + allocatedRefund;
          const newProfit = existing.profit + itemProfit;
          const newMargin = newRevenue > 0 ? (newProfit / newRevenue) * 100 : 0;

          productMap.set(item.name, {
            name: item.name,
            quantity: newQuantity,
            revenue: newRevenue,
            shippingCost: newShipping,
            refunds: newRefunds,
            profit: newProfit,
            profitMargin: newMargin
          });
        });
      });

      // Process Stripe orders
      stripeOrders?.forEach(order => {
        const items = order.items as any[];
        const orderSubtotal = Number(order.subtotal || 0);
        const orderShipping = Number(order.stallion_cost || 0);
        const orderRefund = Number(order.refund_amount || 0);

        items?.forEach(item => {
          const itemRevenue = Number(item.price || 0) * (item.quantity || 1);
          const itemProportion = orderSubtotal > 0 ? itemRevenue / orderSubtotal : 0;
          const allocatedShipping = itemProportion * orderShipping;
          const allocatedRefund = itemProportion * orderRefund;
          const itemProfit = itemRevenue - allocatedShipping - allocatedRefund;

          const existing = productMap.get(item.name) || {
            name: item.name,
            quantity: 0,
            revenue: 0,
            shippingCost: 0,
            refunds: 0,
            profit: 0,
            profitMargin: 0
          };

          const newQuantity = existing.quantity + (item.quantity || 1);
          const newRevenue = existing.revenue + itemRevenue;
          const newShipping = existing.shippingCost + allocatedShipping;
          const newRefunds = existing.refunds + allocatedRefund;
          const newProfit = existing.profit + itemProfit;
          const newMargin = newRevenue > 0 ? (newProfit / newRevenue) * 100 : 0;

          productMap.set(item.name, {
            name: item.name,
            quantity: newQuantity,
            revenue: newRevenue,
            shippingCost: newShipping,
            refunds: newRefunds,
            profit: newProfit,
            profitMargin: newMargin
          });
        });
      });

      const products = Array.from(productMap.values());
      
      // Calculate aggregate metrics
      const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);
      const totalProfit = products.reduce((sum, p) => sum + p.profit, 0);
      const averageProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

      return {
        products: products.sort((a, b) => b.revenue - a.revenue),
        totalRevenue,
        totalProfit,
        averageProfitMargin,
        mostProfitable: products.sort((a, b) => b.profit - a.profit)[0] || null,
        highestMargin: products.sort((a, b) => b.profitMargin - a.profitMargin)[0] || null
      };
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
