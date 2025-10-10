import { useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

const ABANDONED_CART_DELAY = 30 * 60 * 1000; // 30 minutes in milliseconds
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface AbandonedCartData {
  email: string;
  cartItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  sessionId: string;
}

export const useAbandonedCart = (userEmail?: string) => {
  const { items, subtotal } = useCart();
  const abandonedCartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Clear any existing timer
    if (abandonedCartTimerRef.current) {
      clearTimeout(abandonedCartTimerRef.current);
    }

    // Only track if cart has items and we have an email
    if (items.length > 0 && userEmail) {
      hasTrackedRef.current = false;

      // Set timer to track abandoned cart
      abandonedCartTimerRef.current = setTimeout(async () => {
        if (!hasTrackedRef.current) {
          console.log("Cart abandoned, sending reminder...");
          await trackAbandonedCart(userEmail, items, subtotal);
          hasTrackedRef.current = true;
        }
      }, ABANDONED_CART_DELAY);
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (abandonedCartTimerRef.current) {
        clearTimeout(abandonedCartTimerRef.current);
      }
    };
  }, [items, subtotal, userEmail]);

  const trackAbandonedCart = async (
    email: string,
    cartItems: typeof items,
    total: number
  ) => {
    try {
      const abandonedCartData: AbandonedCartData = {
        email,
        cartItems: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: total,
        sessionId: SESSION_ID,
      };

      const { error } = await supabase.functions.invoke("send-abandoned-cart-email", {
        body: abandonedCartData,
      });

      if (error) {
        console.error("Failed to send abandoned cart email:", error);
      } else {
        console.log("Abandoned cart tracked successfully");
      }
    } catch (error) {
      console.error("Error tracking abandoned cart:", error);
    }
  };

  const markAsRecovered = async () => {
    // Mark cart as recovered when user completes checkout
    try {
      const { error } = await supabase
        .from("abandoned_carts")
        .update({ recovered_at: new Date().toISOString() })
        .eq("session_id", SESSION_ID)
        .is("recovered_at", null);

      if (error) {
        console.error("Failed to mark cart as recovered:", error);
      }
    } catch (error) {
      console.error("Error marking cart as recovered:", error);
    }
  };

  return { markAsRecovered };
};
