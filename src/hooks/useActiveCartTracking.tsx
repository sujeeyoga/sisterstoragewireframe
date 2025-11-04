import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "./useDebounce";
import { useSessionManagement } from "./useSessionManagement";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export const useActiveCartTracking = (
  items: CartItem[],
  subtotal: number,
  userEmail?: string
) => {
  const { sessionId, visitorId, hasInitialized } = useSessionManagement();

  // Debounce cart items and subtotal to avoid excessive DB writes
  const debouncedItems = useDebounce(items, 5000); // 5 second debounce
  const debouncedSubtotal = useDebounce(subtotal, 5000);

  // Track cart changes in database
  useEffect(() => {
    if (!hasInitialized || !sessionId) return;
    
    const trackCart = async () => {
      // Don't track empty carts
      if (debouncedItems.length === 0) {
        console.log("[Cart Tracking] Cart is empty, deleting from DB");
        // Delete the active cart if it exists
        try {
          await supabase
            .from("active_carts")
            .delete()
            .eq("session_id", sessionId);
        } catch (error) {
          console.error("Error deleting active cart:", error);
        }
        return;
      }

      try {
        const cartData = {
          session_id: sessionId,
          visitor_id: visitorId || null,
          email: userEmail || null,
          cart_items: debouncedItems as any,
          subtotal: debouncedSubtotal,
          last_updated: new Date().toISOString(),
        };

        console.log("[Cart Tracking] Upserting cart:", {
          session_id: sessionId,
          visitor_id: visitorId,
          items: debouncedItems.length,
          subtotal: debouncedSubtotal,
        });

        // Upsert the cart (insert or update)
        const { error } = await supabase
          .from("active_carts")
          .upsert([cartData], {
            onConflict: "session_id",
          });

        if (error) {
          console.error("Error tracking active cart:", error);
        } else {
          console.log("[Cart Tracking] Successfully tracked cart");
        }
      } catch (error) {
        console.error("Error in cart tracking:", error);
      }
    };

    trackCart();
  }, [debouncedItems, debouncedSubtotal, userEmail]);

  // Mark cart as converted when checkout is completed
  const markAsConverted = async () => {
    if (!sessionId) return;

    try {
      console.log("[Cart Tracking] Marking cart as converted:", sessionId);
      await supabase
        .from("active_carts")
        .update({ converted_at: new Date().toISOString() })
        .eq("session_id", sessionId);
    } catch (error) {
      console.error("Error marking cart as converted:", error);
    }
  };

  return { markAsConverted };
};
