import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AddToCartBarProps {
  product: {
    id: string;
    name: string;
    price: number;
    images?: string[];
    color?: string;
    [key: string]: any;
  };
  className?: string;
}

const AddToCartBar: React.FC<AddToCartBarProps> = ({ product, className }) => {
  const { addItem, setIsOpen } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
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

  const handleBuyNow = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

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
        type="button"
      >
        Buy Now
      </Button>
    </div>
  );
};

export default AddToCartBar;
