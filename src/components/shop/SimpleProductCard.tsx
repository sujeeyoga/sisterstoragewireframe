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
    <article className="simple-product-card bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 grid gap-3 h-full">
      {/* Image */}
      <Link to={`/shop/${product.id}`} className="relative block overflow-hidden rounded-lg">
        <AspectRatio ratio={1}>
          <div 
            className="w-full h-full flex items-center justify-center text-white font-medium text-sm transition-transform duration-300 hover:scale-105"
            style={{ backgroundColor: product.color }}
          >
            <span className="line-clamp-1 text-center px-2">{product.name}</span>
          </div>
        </AspectRatio>
      </Link>
      
      {/* Title */}
      <Link to={`/shop/${product.id}`}>
        <h3 className="text-base font-semibold leading-tight text-foreground hover:text-foreground/70 transition-colors line-clamp-2">
          {product.name}
        </h3>
      </Link>
      
      {/* Bullets (optional) */}
      {bullets && bullets.length > 0 && (
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
          {bullets.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
      
      {/* Price and CTA */}
      <div className="flex items-baseline justify-between pt-1 mt-auto">
        <div className="space-x-2">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button 
          size="sm"
          className="h-9 px-3 text-xs rounded-lg"
          onClick={handleAddToCart}
        >
          <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
          Add
        </Button>
      </div>
    </article>
  );
};

export default SimpleProductCard;
