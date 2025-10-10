import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

interface CheckoutButtonProps {
  priceId?: string;
  productName: string;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

export const CheckoutButton = ({ 
  priceId, 
  productName,
  className = "",
  size = "default" 
}: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!priceId) {
      toast({
        title: "Coming Soon",
        description: "Checkout is being set up for this product.",
        variant: "default",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.sessionId) {
        const stripeInstance = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51R0nZTRr65hCrEBwUlDPR9xQDI93cKJmEpz7GSmZ6JycAm0nOqq3M0DLQgEqsGG2wNZYpXCqyVFsgpW1Ei6nACmy00FJ5OmaPB');
        
        if (!stripeInstance) {
          throw new Error('Failed to load Stripe');
        }

        // @ts-ignore - redirectToCheckout exists in @stripe/stripe-js but types may be outdated
        const { error: redirectError } = await stripeInstance.redirectToCheckout({
          sessionId: data.sessionId
        });

        if (redirectError) {
          throw redirectError;
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={className}
      size={size}
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Buy Now"}
    </Button>
  );
};
