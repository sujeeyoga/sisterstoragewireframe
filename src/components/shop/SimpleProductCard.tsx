import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface SimpleProductCardProps {
  product: Product;
  bullets?: string[];
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, bullets }) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
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
  const rating = 5;
  const reviews = Math.floor(Math.random() * 150) + 30;

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white relative transform hover:-translate-y-1 hover:scale-[1.02] h-full">
      {/* Product Image */}
      <Link to={`/shop/${product.id}`} className="block relative">
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          
          <div 
            className={cn(
              "w-full aspect-square flex items-center justify-center text-white font-bold text-xs uppercase transition-all duration-700 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{ backgroundColor: product.color }}
            onLoad={() => setImageLoaded(true)}
          >
            <span className="line-clamp-1 text-center px-2 tracking-wide">Sister Storage</span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick Buy Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button 
              variant="buy"
              size="buy"
              className="transform scale-90 group-hover:scale-100 shadow-2xl"
              onClick={handleAddToCart}
            >
              <Plus className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-3 space-y-3">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-gray-500 text-xs font-medium">({reviews})</span>
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <Link to={`/shop/${product.id}`}>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2 hover:text-pink-600 transition-colors uppercase">{product.name}</h3>
          </Link>
          <p className="text-gray-600 text-lg leading-relaxed line-clamp-2">{product.description}</p>
        </div>
        
        {/* What's Included */}
        {(bullets || rodCount) && (
          <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider mb-2">
              What's Included
            </h3>
            <ul className="space-y-2">
              {rodCount && (
                <li>
                  <p className="text-gray-600 text-2xl leading-relaxed font-medium">
                    {rodCount} Rod{rodCount !== '1' ? 's' : ''}
                  </p>
                </li>
              )}
              {bullets && bullets.map((line, i) => (
                <li key={i}>
                  <p className="text-gray-600 text-2xl leading-relaxed font-medium">{line}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Buy Button */}
          <Button 
            variant="buy"
            size="buy"
            className="w-full font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            ADD TO CART
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleProductCard;
