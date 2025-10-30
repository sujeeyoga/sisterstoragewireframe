import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay } from 'date-fns';

interface ShippingAnalytics {
  totalShippingRevenue: number;
  averageShippingCost: number;
  totalOrders: number;
  freeShippingOrders: number;
  countriesServed: number;
  shippingByCountry: { country: string; orders: number; revenue: number }[];
}

interface DateRange {
  start: Date;
  end: Date;
}

export function useShippingAnalytics({ start, end }: DateRange) {
  return useQuery({
    queryKey: ['shipping-analytics', start.toISOString(), end.toISOString()],
    queryFn: async (): Promise<ShippingAnalytics> => {
      const startDate = startOfDay(start).toISOString();
      const endDate = endOfDay(end).toISOString();

      // Fetch Stripe orders
      const { data: stripeOrders, error: stripeError } = await supabase
        .from('orders')
        .select('shipping, shipping_address')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (stripeError) throw stripeError;

      // Fetch WooCommerce orders
      const { data: wooOrders, error: wooError } = await supabase
        .from('woocommerce_orders')
        .select('total, shipping')
        .gte('date_created', startDate)
        .lte('date_created', endDate);

      if (wooError) throw wooError;

      // Process Stripe orders
      const stripeData = (stripeOrders || []).map(o => ({
        shipping: Number(o.shipping || 0),
        country: (o.shipping_address as any)?.country || 'Unknown'
      }));

      // Process WooCommerce orders
      const wooData = (wooOrders || []).map(o => ({
        shipping: Number((o.shipping as any)?.total || 0),
        country: (o.shipping as any)?.country || 'Unknown'
      }));

      const allOrders = [...stripeData, ...wooData];

      const totalShippingRevenue = allOrders.reduce((sum, o) => sum + o.shipping, 0);
      const totalOrders = allOrders.length;
      const averageShippingCost = totalOrders > 0 ? totalShippingRevenue / totalOrders : 0;
      const freeShippingOrders = allOrders.filter(o => o.shipping === 0).length;

      // Group by country
      const countryMap = new Map<string, { orders: number; revenue: number }>();
      allOrders.forEach(order => {
        const existing = countryMap.get(order.country) || { orders: 0, revenue: 0 };
        countryMap.set(order.country, {
          orders: existing.orders + 1,
          revenue: existing.revenue + order.shipping
        });
      });

      const shippingByCountry = Array.from(countryMap.entries())
        .map(([country, data]) => ({ country, ...data }))
        .sort((a, b) => b.orders - a.orders);

      const countriesServed = countryMap.size;

      return {
        totalShippingRevenue,
        averageShippingCost,
        totalOrders,
        freeShippingOrders,
        countriesServed,
        shippingByCountry
      };
    },
    refetchInterval: 60000,
  });
}
