import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface SimpleProductCardProps {
  product: Product;
  bullets?: string[];
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, bullets }) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Extract rod count from attributes
  const rodCount = product.attributes?.rodCount?.[0];

  return (
    <article className="simple-product-card bg-card shadow-sm hover:shadow-md transition-shadow p-4 grid gap-3 h-full" style={{ borderRadius: '0px' }}>
      {/* Image */}
      <Link to={`/shop/${product.id}`} className="relative block overflow-hidden" style={{ borderRadius: '0px' }}>
        <AspectRatio ratio={1}>
          <div 
            className="w-full h-full flex items-center justify-center text-white font-bold text-xs uppercase transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: product.color }}
          >
            <span className="line-clamp-1 text-center px-2 tracking-wide">{product.name}</span>
          </div>
        </AspectRatio>
      </Link>
      
      {/* Title */}
      <Link to={`/shop/${product.id}`}>
        <h3 className="text-3xl font-bold leading-tight text-foreground hover:text-brand-pink transition-colors line-clamp-2 uppercase tracking-wide">
          {product.name}
        </h3>
      </Link>
      
      {/* What's Included */}
      {(bullets || rodCount) && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
            What's Included
          </h4>
          {rodCount && (
            <div className="flex items-baseline gap-2">
              <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">
                {rodCount}×
              </span>
              <span className="text-gray-600 text-2xl">
                Rod{rodCount !== '1' ? 's' : ''}
              </span>
            </div>
          )}
          {bullets && bullets.length > 0 && (
            <ul className="space-y-2">
              {bullets.map((line, i) => {
                // Parse if starts with number (e.g., "7 zip pouches")
                const match = line.match(/^(\d+)\s+(.+)$/);
                if (match) {
                  return (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">
                        {match[1]}×
                      </span>
                      <span className="text-gray-600 text-2xl">
                        {match[2]}
                      </span>
                    </li>
                  );
                }
                return (
                  <li key={i} className="text-gray-900 text-2xl font-medium">
                    {line}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
      
      {/* Price and CTA */}
      <div className="flex items-baseline justify-between pt-2 mt-auto border-t border-border">
        <div className="space-x-2">
          <span className="text-2xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-base text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          size="sm"
          className="h-10 px-4 text-sm bg-brand-black hover:bg-brand-orange text-white font-bold uppercase tracking-wide transition-colors"
          onClick={handleAddToCart}
          style={{ borderRadius: '0px' }}
        >
          <ShoppingBag className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
    </article>
  );
};

export default SimpleProductCard;
