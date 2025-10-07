import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface HeroProductPriceProps {
  price: number;
  compareAt?: number;
  onAddToCart: () => void;
  hideCompareAt?: boolean;
}

const HeroProductPrice: React.FC<HeroProductPriceProps> = ({ 
  price, 
  compareAt, 
  onAddToCart,
  hideCompareAt = false
}) => {
  return (
    <div>
      <div className="bg-brand-gray p-5" style={{ borderRadius: '0px' }}>
        <div className="flex items-baseline space-x-3">
          <p className="text-3xl md:text-4xl font-bold text-foreground">${price.toFixed(2)}</p>
          {compareAt && !hideCompareAt && (
            <p className="text-lg text-muted-foreground line-through">
              ${compareAt.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3 mt-4">
        <Button 
          className="w-full h-12 bg-brand-black hover:bg-brand-pink text-white font-bold uppercase tracking-wide transition-colors"
          onClick={onAddToCart}
          style={{ borderRadius: '0px' }}
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          ADD TO CART
        </Button>
        
        <Button 
          variant="outline"
          className="w-full h-12 border-2 border-brand-black hover:bg-brand-black hover:text-white font-bold uppercase tracking-wide transition-colors"
          onClick={onAddToCart}
          style={{ borderRadius: '0px' }}
        >
          BUY NOW
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground text-center mt-3 uppercase tracking-wide">
        Free shipping on orders $75+
      </p>
    </div>
  );
};

export default HeroProductPrice;
