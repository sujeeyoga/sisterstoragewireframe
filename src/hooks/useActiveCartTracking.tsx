import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "./useDebounce";

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
  const sessionId = useRef<string>("");
  const hasInitialized = useRef(false);

  // Get or create session ID from visitor analytics
  useEffect(() => {
    const getSessionId = async () => {
      // Try to get from localStorage first
      let storedSessionId = localStorage.getItem("visitor_session_id");
      
      if (!storedSessionId) {
        // Generate new session ID
        storedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("visitor_session_id", storedSessionId);
      }
      
      sessionId.current = storedSessionId;
      hasInitialized.current = true;
    };

    getSessionId();
  }, []);

  // Debounce cart items and subtotal to avoid excessive DB writes
  const debouncedItems = useDebounce(items, 5000); // 5 second debounce
  const debouncedSubtotal = useDebounce(subtotal, 5000);

  // Track cart changes in database
  useEffect(() => {
    if (!hasInitialized.current || !sessionId.current) return;
    
    const trackCart = async () => {
      // Don't track empty carts
      if (debouncedItems.length === 0) {
        // Delete the active cart if it exists
        try {
          await supabase
            .from("active_carts")
            .delete()
            .eq("session_id", sessionId.current);
        } catch (error) {
          console.error("Error deleting active cart:", error);
        }
        return;
      }

      try {
        // Try to get visitor_id from visitor_analytics
        const { data: visitorData } = await supabase
          .from("visitor_analytics")
          .select("visitor_id")
          .eq("session_id", sessionId.current)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const cartData = {
          session_id: sessionId.current,
          visitor_id: visitorData?.visitor_id || null,
          email: userEmail || null,
          cart_items: debouncedItems as any,
          subtotal: debouncedSubtotal,
          last_updated: new Date().toISOString(),
        };

        // Upsert the cart (insert or update)
        const { error } = await supabase
          .from("active_carts")
          .upsert([cartData], {
            onConflict: "session_id",
          });

        if (error) {
          console.error("Error tracking active cart:", error);
        }
      } catch (error) {
        console.error("Error in cart tracking:", error);
      }
    };

    trackCart();
  }, [debouncedItems, debouncedSubtotal, userEmail]);

  // Mark cart as converted when checkout is completed
  const markAsConverted = async () => {
    if (!sessionId.current) return;

    try {
      await supabase
        .from("active_carts")
        .update({ converted_at: new Date().toISOString() })
        .eq("session_id", sessionId.current);
    } catch (error) {
      console.error("Error marking cart as converted:", error);
    }
  };

  return { markAsConverted };
};
