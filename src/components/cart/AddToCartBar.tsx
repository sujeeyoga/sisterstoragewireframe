import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface AddToCartBarProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    color?: string;
    stripePriceId?: string;
    [key: string]: any;
  };
  className?: string;
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({ product, className }) => {
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price, // Price should already be discounted when passed to this component
        image: product.images?.[0] || product.color || '',
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      setIsOpen(true);
    } catch (error) {
      console.error("[AddToCartBar] Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    // If product has Stripe price ID, use Stripe checkout
    if (product.stripePriceId) {
      setIsCheckoutLoading(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: { priceId: product.stripePriceId }
        });

        if (error) throw error;

        if (data?.url) {
          window.open(data.url, '_blank');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        toast({
          title: "Checkout Error",
          description: "Failed to start checkout. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsCheckoutLoading(false);
      }
    } else {
      // Fallback to cart checkout for products without Stripe integration
      try {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.color || '',
        });

        navigate("/checkout");
      } catch (error) {
        console.error("[AddToCartBar] Error in Buy Now:", error);
        toast({
          title: "Error",
          description: "Failed to proceed to checkout",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 relative z-10", className)}>
      <Button
        variant="outline"
        className="flex-1 font-bold text-sm py-3 shadow-md hover:shadow-lg transition-all duration-300 pointer-events-auto"
        onClick={handleAddToCart}
        type="button"
      >
        <ShoppingBag className="h-4 w-4 mr-2" />
        Add to Cart
      </Button>

      <Button
        variant="buy"
        size="buy"
        className="flex-1 font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300 pointer-events-auto"
        onClick={handleBuyNow}
        disabled={isCheckoutLoading}
        type="button"
      >
        {isCheckoutLoading ? "Loading..." : "Buy Now"}
      </Button>
    </div>
  );
};

export default AddToCartBar;
