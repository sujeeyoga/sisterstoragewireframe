import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface OrderNotification {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  itemCount: number;
}

export const useOrderNotifications = () => {
  const [notification, setNotification] = useState<OrderNotification | null>(null);

  // Play cha-ching sound using Web Audio API
  const playChaChing = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a simple "cha-ching" sound with two tones
    const playTone = (frequency: number, duration: number, delay: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      
      const now = audioContext.currentTime + delay;
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    };

    // "Cha" - higher pitched
    playTone(800, 0.1, 0);
    // "Ching" - even higher with slight delay
    playTone(1200, 0.15, 0.08);
  };

  useEffect(() => {
    console.log("🔔 Setting up order notifications listener...");

    const channel = supabase
      .channel("order-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("🎉 New order received!", payload);
          
          const order = payload.new as any;
          const items = Array.isArray(order.items) ? order.items : [];
          
          const newNotification: OrderNotification = {
            id: order.id,
            orderNumber: order.order_number || "Unknown",
            customerName: order.customer_name || order.customer_email || "Customer",
            total: order.total || 0,
            itemCount: items.length,
          };

          // Play sound
          playChaChing();

          // Show notification
          setNotification(newNotification);
        }
      )
      .subscribe((status) => {
        console.log("📡 Order notifications channel status:", status);
      });

    return () => {
      console.log("🔕 Cleaning up order notifications listener");
      supabase.removeChannel(channel);
    };
  }, []);

  const clearNotification = () => {
    setNotification(null);
  };

  return { notification, clearNotification };
};
