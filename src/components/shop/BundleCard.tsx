import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import AddToCartBar from "@/components/cart/AddToCartBar";

interface BundleCardProps {
  product: Product;
  isBundle?: boolean;
}

const BundleCard = ({ product, isBundle = false }: BundleCardProps) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Cart actions are handled by AddToCartBar component

  // Extract bundle contents and rod count
  const bundleContents = product.bundleContents || product.funnelStage || product.caption;
  const rodCount = product.attributes?.rodCount?.[0];
  const rating = 5;
  // Generate consistent review count based on product ID
  const reviews = React.useMemo(() => {
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 200) + 100;
  }, [product.id]);

  return (
    <Card 
      className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white relative transform hover:-translate-y-1 hover:scale-[1.02] h-full"
    >
      {/* Bundle Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-3 py-1.5 text-xs font-bold rounded-full shadow-lg bg-white text-pink-600">
          BUNDLE
        </span>
      </div>
      
      {/* Product Image */}
      <div className="block relative">
        <div className="relative overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          
          {product.images && product.images[0] ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={cn(
                "w-full aspect-[4/5] object-cover transition-all duration-700 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div 
              className={cn(
                "w-full aspect-[4/5] object-cover transition-all duration-700 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              style={{ 
                background: `linear-gradient(135deg, ${product.color}30, ${product.color})`,
              }}
              onLoad={() => setImageLoaded(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick Buy removed to avoid overlay click issues */}
        </div>
      </div>
      
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
        
        {/* Bundle Title & Description */}
        <div className="space-y-2">
          <Link 
            to={`/shop/${product.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2 hover:text-pink-600 transition-colors uppercase">{product.name}</h3>
          </Link>
          {product.description && (
            <div 
              className="text-gray-600 text-lg leading-relaxed line-clamp-2"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
        
        {/* Bundle Contents */}
        {bundleContents && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
              What's Included
            </h3>
            <ul className="space-y-2">
              {(() => {
                let totalRods = 0;
                const items = bundleContents.split(',').map((item, i) => {
                  const match = item.trim().match(/^(\d+)\s+(.+?)(?:\s+Boxes?)?$/i);
                  if (match) {
                    const [, qty, label] = match;
                    // Determine rod count based on size
                    let rodsEach = 1;
                    if (label.toLowerCase().includes('large')) rodsEach = 4;
                    else if (label.toLowerCase().includes('medium')) rodsEach = 2;
                    else if (label.toLowerCase().includes('small')) rodsEach = 1;
                    
                    totalRods += parseInt(qty) * rodsEach;
                    
                    return (
                      <li key={i}>
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-2">
                            <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">
                              {qty}×
                            </span>
                            <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                              {label}
                            </span>
                          </span>
                          <span className="text-gray-600 text-2xl">
                            ({rodsEach} rod{rodsEach > 1 ? 's' : ''} each)
                          </span>
                        </div>
                      </li>
                    );
                  }
                  return null;
                });
                
                return (
                  <>
                    {items}
                  </>
                );
              })()}
            </ul>
          </div>
        )}
        
        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price && product.slug !== 'multipurpose-box' && product.id !== 'multipurpose-box' && (
                <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && product.slug !== 'multipurpose-box' && product.id !== 'multipurpose-box' && (
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </div>
            )}
          </div>
          
          {/* Rod Count Display */}
          {rodCount && (
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider block">Rods</span>
                <span className="text-2xl font-thin">{rodCount}</span>
              </div>
            </div>
          )}
          
          {/* Action Buttons Row */}
          <AddToCartBar product={product} />
        </div>
      </CardContent>
    </Card>
  );
};

export default BundleCard;
