import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Zap } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import BundleContentsList from "@/components/product/BundleContentsList";

interface BundleCardProps {
  product: Product;
  isBundle?: boolean;
}

const BundleCard = ({ product, isBundle = false }: BundleCardProps) => {
  const { addItem, setIsOpen } = useCart();
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

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.color
    });
    
    toast({
      title: "Added to cart",
      description: "Opening cart for checkout...",
    });
    
    setIsOpen(true);
  };

  // Extract bundle contents - prioritize bundleContents field
  const bundleContents = product.bundleContents || product.funnelStage || product.caption;

  return (
    <article className="bundle-card overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow h-full flex flex-col" style={{ borderRadius: '0px' }}>
      {/* Header with Badge */}
      {isBundle && (
        <div className="flex items-center gap-2 px-4 pt-4">
          <span className="text-xs px-3 py-1.5 bg-brand-pink text-white font-bold uppercase tracking-wider" style={{ borderRadius: '0px' }}>
            BUNDLE
          </span>
        </div>
      )}
      
      {/* Image */}
      <div className="p-4 pb-0">
        <Link to={`/shop/${product.id}`} className="block">
          <AspectRatio ratio={16 / 9}>
            <div 
              className="w-full h-full shadow-sm transition-transform duration-300 hover:scale-[1.02]"
              style={{ 
                background: `linear-gradient(135deg, ${product.color}20, ${product.color}60)`,
                borderRadius: '0px'
              }}
            />
          </AspectRatio>
        </Link>
      </div>

      {/* Details */}
      <div className="px-4 py-4 grid gap-3 flex-1">
        <div className="grid gap-2">
          <Link to={`/shop/${product.id}`}>
            <h3 className="text-sm font-bold leading-tight text-foreground hover:text-brand-pink transition-colors uppercase tracking-wide">
              {product.name}
            </h3>
          </Link>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Bundle Contents */}
        {isBundle && bundleContents ? (
          <BundleContentsList contents={bundleContents} variant="card" showTotals={true} />
        ) : bundleContents ? (
          <p className="text-xs text-muted-foreground line-clamp-2 uppercase tracking-wide">
            {bundleContents}
          </p>
        ) : null}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 grid gap-2 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm"
            variant="outline"
            className="h-9 text-xs font-bold uppercase tracking-wide hover:bg-brand-black hover:text-white hover:border-brand-black transition-colors"
            onClick={handleAddToCart}
            style={{ borderRadius: '0px' }}
          >
            <ShoppingBag className="h-3.5 w-3.5 mr-1" />
            Add
          </Button>
          <Button 
            size="sm"
            className="h-9 text-xs font-bold uppercase tracking-wide bg-brand-black hover:bg-brand-pink text-white transition-colors"
            onClick={handleBuyNow}
            style={{ borderRadius: '0px' }}
          >
            <Zap className="h-3.5 w-3.5 mr-1" />
            Buy Now
          </Button>
        </div>
        <Link 
          to={`/shop/${product.id}`}
          className="text-xs text-brand-pink hover:text-brand-orange font-bold uppercase tracking-wide justify-self-end transition-colors"
        >
          View details →
        </Link>
      </div>
    </article>
  );
};

export default BundleCard;
