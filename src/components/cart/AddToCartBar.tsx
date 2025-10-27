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

  const [isAdding, setIsAdding] = useState(false); // prevent double-add

  const safePrice =
    typeof product.price === "number" && !Number.isNaN(product.price)
      ? product.price
      : 0;

  const imageSrc =
    product.images?.[0] ||
    (typeof product.color === "string" ? product.color : "") ||
    "";

  const handleAddToCart = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (isAdding) return;
    setIsAdding(true);

    try {
      addItem({
        id: String(product.id),
        name: String(product.name ?? "Untitled"),
        price: safePrice,
        image: imageSrc, // supports http URL or color hex; drawer handles both
      });

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart`,
      });

      // Open drawer (drawer now has higher z-index than the fab)
      setIsOpen(true);
    } catch (error) {
      console.error("[AddToCartBar] Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      // small delay to avoid rapid double-clicks on slow devices
      setTimeout(() => setIsAdding(false), 250);
    }
  };

  const handleBuyNow = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      // Add item to cart and proceed to checkout
      addItem({
        id: String(product.id),
        name: String(product.name ?? "Untitled"),
        price: safePrice,
        image: imageSrc,
      });
      
      // Ensure cart drawer is closed
      setIsOpen(false);
      
      // Navigate to checkout/shipping info page
      navigate("/checkout");
    } catch (error) {
      console.error("[AddToCartBar] Error in Buy Now:", error);
      toast({
        title: "Error",
        description: "Failed to proceed to checkout",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        // keep this below the drawer/backdrop (which is z-[100000])
        "flex flex-row items-center gap-2 md:gap-3 relative z-0",
        className
      )}
    >
      <Button
        variant="outline"
        className="flex-1 min-w-[120px] font-bold text-sm py-3 shadow-md hover:shadow-lg transition-all duration-300"
        onClick={handleAddToCart}
        type="button"
        disabled={isAdding}
      >
        <ShoppingBag className="h-4 w-4 mr-2" />
        {isAdding ? "Adding…" : "Add to Cart"}
      </Button>

      <Button
        variant="buy"
        size="buy"
        className="flex-1 min-w-[100px] font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300"
        onClick={handleBuyNow}
        type="button"
      >
        Buy Now
      </Button>
    </div>
  );
};

export default AddToCartBar;
