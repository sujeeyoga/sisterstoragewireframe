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
      
      {/* Bullets (optional) */}
      {bullets && bullets.length > 0 && (
        <ul className="space-y-3">
          {bullets.map((line, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[hsl(var(--brand-orange))] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-900 text-sm font-medium">{line}</span>
            </li>
          ))}
        </ul>
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
