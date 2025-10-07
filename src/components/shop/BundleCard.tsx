import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "./ProductCard";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface BundleCardProps {
  product: Product;
  isBundle?: boolean;
}

const BundleCard = ({ product, isBundle = false }: BundleCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  // Extract bundle contents from funnelStage or caption
  const bundleContents = isBundle ? product.funnelStage : product.caption;

  return (
    <article className="ss-card group h-full flex flex-col rounded-2xl p-3.5 md:p-4 bg-card shadow-sm hover:shadow-md transition-all duration-300">
      {/* Media Section - 1:1 Aspect Ratio */}
      <Link to={`/shop/${product.id}`} className="ss-card__media block mb-3 relative overflow-hidden rounded-lg">
        <AspectRatio ratio={1}>
          <div 
            className="w-full h-full flex items-center justify-center text-white font-medium text-sm transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: product.color }}
          >
            {/* Badge for bundles */}
            {isBundle && (
              <span className="ss-badge absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                Bundle
              </span>
            )}
            <span className="line-clamp-1 text-center px-2">{product.name}</span>
          </div>
        </AspectRatio>
      </Link>
      
      {/* Body Section */}
      <div className="ss-card__body flex-1 flex flex-col gap-2">
        {/* Title */}
        <Link to={`/shop/${product.id}`}>
          <h3 className="ss-card__title font-medium text-base md:text-lg text-foreground group-hover:text-foreground/70 transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Meta/Contents Line */}
        {bundleContents && (
          <p className="ss-card__meta text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {bundleContents}
          </p>
        )}
        
        {/* Price Row */}
        <div className="ss-price flex items-baseline gap-2 mt-auto pt-2">
          <span className="ss-price__regular text-lg font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="ss-price__compare text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* CTA Row */}
        <div className="ss-cta flex items-center gap-2 mt-2">
          <Button 
            size="sm"
            className="ss-btn flex-1 h-9 text-xs rounded-lg"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
            Add to Cart
          </Button>
          <Link 
            to={`/shop/${product.id}`}
            className="ss-link text-xs text-primary hover:text-primary/80 font-medium whitespace-nowrap transition-colors"
          >
            View details →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BundleCard;
