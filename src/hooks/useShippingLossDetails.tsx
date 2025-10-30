import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { matchAddressToZone } from "@/lib/shippingZoneEngine";
import type { ShippingZone } from "@/lib/shippingZoneEngine";

interface ShippingLossOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  country: string;
  city: string;
  zone: string | null;
  actualCost: number;
  charged: number;
  difference: number;
  createdAt: string;
  shippingAddress: any;
  hasStallionCost: boolean;
  wasFreeShipping: boolean;
  discountApplied: number;
  originalRate: number;
  meetsThreshold: boolean;
  freeShippingThreshold: number | null;
  subtotal: number;
  fulfillmentStatus: string;
}

interface ShippingLossStats {
  totalLoss: number;
  ordersWithLoss: number;
  averageLoss: number;
  biggestLoss: number;
  torontoGTALoss: number;
  torontoGTAOrders: number;
  totalDiscountsGiven: number;
  freeShippingOrders: number;
  avgDiscount: number;
}

interface ShippingLossData {
  orders: ShippingLossOrder[];
  stats: ShippingLossStats;
}

interface UseShippingLossDetailsParams {
  startDate: Date;
  endDate: Date;
  zoneFilter?: string;
  lossFilter?: "all" | "loss" | "gain";
  searchQuery?: string;
}

export const useShippingLossDetails = (params: UseShippingLossDetailsParams) => {
  const { startDate, endDate, zoneFilter, lossFilter, searchQuery } = params;

  return useQuery({
    queryKey: ["shipping-loss-details", startDate, endDate, zoneFilter, lossFilter, searchQuery],
    queryFn: async (): Promise<ShippingLossData> => {
      // Fetch shipping zones for matching
      const { data: zonesData } = await supabase
        .from("shipping_zones")
        .select(`
          *,
          rules:shipping_zone_rules(*),
          rates:shipping_zone_rates(*)
        `)
        .eq("enabled", true);

      const zones = (zonesData || []) as ShippingZone[];

      // Fetch Stripe orders (including those without stallion_cost)
      const { data: stripeOrders } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      // Fetch WooCommerce orders (including those without stallion_cost)
      const { data: wooOrders } = await supabase
        .from("woocommerce_orders")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString())
        .order("created_at", { ascending: false });

      // Process orders
      const allOrders: ShippingLossOrder[] = [];

      // Process Stripe orders
      if (stripeOrders) {
        stripeOrders.forEach((order) => {
          const shippingAddr = order.shipping_address as any;
          if (!shippingAddr) return;

          const address = {
            country: shippingAddr.country || "",
            region: shippingAddr.state || "",
            city: shippingAddr.city || "",
            postalCode: shippingAddr.postal_code || "",
          };

          const matchedZone = matchAddressToZone(address, zones);
          const hasStallionCost = order.stallion_cost != null;
          const actualCost = Number(order.stallion_cost || 0);
          const charged = Number(order.shipping || 0);
          const difference = actualCost - charged;

          // Calculate discount information
          const subtotal = Number(order.subtotal || 0);
          const zoneRate = matchedZone?.rates?.[0];
          const freeThreshold = zoneRate?.free_threshold || null;
          const originalRate = Number(zoneRate?.rate_amount || 0);
          const meetsThreshold = freeThreshold !== null && subtotal >= freeThreshold;
          const wasFreeShipping = charged === 0 && meetsThreshold;
          const discountApplied = wasFreeShipping ? originalRate : 0;

          allOrders.push({
            id: order.id,
            orderNumber: order.order_number,
            customerName: order.customer_name || "Unknown",
            customerEmail: order.customer_email,
            country: address.country,
            city: address.city,
            zone: matchedZone?.name || "Unknown Zone",
            actualCost,
            charged,
            difference,
            createdAt: order.created_at!,
            shippingAddress: shippingAddr,
            hasStallionCost,
            wasFreeShipping,
            discountApplied,
            originalRate,
            meetsThreshold,
            freeShippingThreshold: freeThreshold,
            subtotal,
            fulfillmentStatus: order.fulfillment_status || "unfulfilled",
          });
        });
      }

      // Process WooCommerce orders
      if (wooOrders) {
        wooOrders.forEach((order) => {
          const shippingAddr = order.shipping as any;
          if (!shippingAddr) return;

          const address = {
            country: shippingAddr.country || "",
            region: shippingAddr.state || "",
            city: shippingAddr.city || "",
            postalCode: shippingAddr.postcode || "",
          };

          const matchedZone = matchAddressToZone(address, zones);
          const hasStallionCost = order.stallion_cost != null;
          const actualCost = Number(order.stallion_cost || 0);
          
          // Extract shipping cost from line_items or meta_data
          let charged = 0;
          const lineItems = order.line_items as any[];
          if (lineItems) {
            const shippingItem = lineItems.find((item: any) => 
              item.name?.toLowerCase().includes("shipping")
            );
            if (shippingItem) {
              charged = Number(shippingItem.total || 0);
            }
          }

          const difference = actualCost - charged;
          const billingAddr = order.billing as any;

          // Calculate discount information
          const subtotal = Number(order.total || 0) - charged; // Approximate subtotal
          const zoneRate = matchedZone?.rates?.[0];
          const freeThreshold = zoneRate?.free_threshold || null;
          const originalRate = Number(zoneRate?.rate_amount || 0);
          const meetsThreshold = freeThreshold !== null && subtotal >= freeThreshold;
          const wasFreeShipping = charged === 0 && meetsThreshold;
          const discountApplied = wasFreeShipping ? originalRate : 0;

          allOrders.push({
            id: order.id.toString(),
            orderNumber: `WC-${order.id}`,
            customerName: `${billingAddr?.first_name || ""} ${billingAddr?.last_name || ""}`.trim() || "Unknown",
            customerEmail: billingAddr?.email || "Unknown",
            country: address.country,
            city: address.city,
            zone: matchedZone?.name || "Unknown Zone",
            actualCost,
            charged,
            difference,
            createdAt: order.created_at!,
            shippingAddress: shippingAddr,
            hasStallionCost,
            wasFreeShipping,
            discountApplied,
            originalRate,
            meetsThreshold,
            freeShippingThreshold: freeThreshold,
            subtotal,
            fulfillmentStatus: order.fulfillment_status || "unfulfilled",
          });
        });
      }

      // Apply filters
      let filteredOrders = allOrders;

      if (zoneFilter && zoneFilter !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.zone === zoneFilter
        );
      }

      if (lossFilter === "loss") {
        filteredOrders = filteredOrders.filter((order) => order.difference > 0);
      } else if (lossFilter === "gain") {
        filteredOrders = filteredOrders.filter((order) => order.difference < 0);
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.orderNumber.toLowerCase().includes(query) ||
            order.customerEmail.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query)
        );
      }

      // Sort by latest orders first
      filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Calculate stats
      const ordersWithLoss = filteredOrders.filter((o) => o.difference > 0);
      const totalLoss = ordersWithLoss.reduce((sum, o) => sum + o.difference, 0);
      const averageLoss = ordersWithLoss.length > 0 ? totalLoss / ordersWithLoss.length : 0;
      const biggestLoss = ordersWithLoss.length > 0 
        ? Math.max(...ordersWithLoss.map((o) => o.difference)) 
        : 0;

      // Toronto/GTA specific stats
      const torontoOrders = allOrders.filter((o) => 
        o.zone?.toLowerCase().includes("toronto") || 
        o.zone?.toLowerCase().includes("gta")
      );
      const torontoLossOrders = torontoOrders.filter((o) => o.difference > 0);
      const torontoGTALoss = torontoLossOrders.reduce((sum, o) => sum + o.difference, 0);

      // Free shipping stats
      const freeShippingOrders = allOrders.filter((o) => o.wasFreeShipping);
      const totalDiscountsGiven = freeShippingOrders.reduce((sum, o) => sum + o.discountApplied, 0);
      const avgDiscount = freeShippingOrders.length > 0 ? totalDiscountsGiven / freeShippingOrders.length : 0;

      return {
        orders: filteredOrders,
        stats: {
          totalLoss,
          ordersWithLoss: ordersWithLoss.length,
          averageLoss,
          biggestLoss,
          torontoGTALoss,
          torontoGTAOrders: torontoLossOrders.length,
          totalDiscountsGiven,
          freeShippingOrders: freeShippingOrders.length,
          avgDiscount,
        },
      };
    },
    refetchInterval: 60000, // Refresh every 60 seconds
  });
};
