import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useActiveCartAnalytics = () => {
  return useQuery({
    queryKey: ["active-cart-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("active_carts")
        .select("*")
        .is("converted_at", null);

      if (error) throw error;

      const totalCarts = data?.length || 0;
      const totalValue = data?.reduce((sum, cart) => sum + Number(cart.subtotal), 0) || 0;
      const averageValue = totalCarts > 0 ? totalValue / totalCarts : 0;

      return {
        totalCarts,
        totalValue,
        averageValue,
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};
