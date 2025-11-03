import React from "react";
import { Link } from "react-router-dom";
import { Star, Package, Tag } from "lucide-react";
import { Product } from "@/types/product";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AddToCartBar from "@/components/cart/AddToCartBar";
import { useStoreDiscount } from "@/hooks/useStoreDiscount";

interface SimpleProductCardProps {
  product: Product;
  bullets?: string[];
}

const SimpleProductCard: React.FC<SimpleProductCardProps> = ({ product, bullets }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const { discount, applyDiscount } = useStoreDiscount();

  // Extract rod count from attributes
  const rodCount = product.attributes?.rodCount?.[0];
  const rating = 5;
  // Generate consistent review count based on product ID
  const reviews = React.useMemo(() => {
    const hash = product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (hash % 150) + 50;
  }, [product.id]);

  // Parse open box product details
  const openBoxDetails = React.useMemo(() => {
    if (product.category !== 'open-box') return null;
    
    const rodMatch = product.name.match(/\((\d+)\s*Rods?\)/i);
    const rodsCount = rodMatch ? rodMatch[1] : null;
    
    const dimensionsMatch = product.shortDescription?.match(/(\d+cm.*?×.*?\d+cm.*?×.*?\d+cm)/i);
    const dimensions = dimensionsMatch ? dimensionsMatch[1].trim() : null;
    
    const capacityMatch = product.shortDescription?.match(/~(\d+)\s*bangles/i);
    const capacity = capacityMatch ? `~${capacityMatch[1]} bangles` : null;
    
    const boxType = product.name.includes('Large') ? 'Large Bangle Box' : 
                   product.name.includes('Medium') ? 'Medium Bangle Box' : 'Bangle Box';
    
    return rodsCount ? {
      qty: 1,
      label: boxType,
      rodsEach: parseInt(rodsCount),
      dimensions,
      capacity
    } : null;
  }, [product]);
  
  const discountedPrice = discount?.enabled ? applyDiscount(product.price) : product.price;
  const hasDiscount = discount?.enabled && discount.percentage > 0;

  return (
    <Card className={cn(
      "group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 relative transform hover:-translate-y-1 hover:scale-[1.02] h-full",
      product.category === 'open-box' ? "bg-gradient-to-br from-orange-50 to-red-50" : "bg-white"
    )}>
      {/* Product Image */}
      <Link to={`/shop/${product.id}`} className="block relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {hasDiscount && product.category !== 'open-box' && (
            <Badge className="bg-green-600 text-white border-none px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-lg">
              <Tag className="w-3 h-3 mr-1 inline-block" />
              {discount.percentage}% OFF
            </Badge>
          )}
          {product.category === 'open-box' && (
            <Badge className="bg-[#ff6b35] text-white border-none px-2.5 py-1 text-xs font-bold uppercase tracking-wider shadow-lg">
              <Package className="w-3 h-3 mr-1 inline-block" />
              OPEN BOX
            </Badge>
          )}
        </div>
        
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
                "w-full aspect-square object-cover transition-all duration-700 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
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
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </Link>
      
      <CardContent className="p-3 space-y-3 flex flex-col h-full">
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
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight line-clamp-2 hover:text-pink-600 transition-colors uppercase">{product.name.replace(/\bSmall\b/gi, '').trim()}</h3>
          </Link>
        </div>
        
        {/* What's Included */}
        {(bullets || rodCount || product.originalPrice || product.bundleContents || openBoxDetails) && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider">
              What's Included
            </h3>
            <ul className="space-y-1.5">
              {openBoxDetails ? (
                <li>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-[hsl(var(--brand-pink))] font-bold text-3xl">
                          {openBoxDetails.qty}×
                        </span>
                        <span className="font-bold text-gray-900 text-base uppercase tracking-wide">
                          {openBoxDetails.label}
                        </span>
                      </span>
                      <span className="text-gray-600 text-2xl">
                        with {openBoxDetails.rodsEach} Rods
                      </span>
                    </div>
                    {openBoxDetails.dimensions && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Dimensions:</span> {openBoxDetails.dimensions}
                      </p>
                    )}
                    {openBoxDetails.capacity && (
                      <p className="text-gray-600 text-sm">
                        <span className="font-semibold">Capacity:</span> {openBoxDetails.capacity}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs italic">
                      Condition: Open Box (may have minor scuffs)
                    </p>
                  </div>
                </li>
              ) : product.bundleContents ? (
                <li>
                  <div 
                    className="text-gray-600 text-2xl leading-relaxed font-medium prose prose-sm max-w-none [&_strong]:font-bold [&_strong]:text-gray-900 [&_em]:italic [&_p]:mb-2 [&_p:last-child]:mb-0 [&_br]:block [&_ul]:list-none [&_ul]:space-y-1 [&_li]:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: product.bundleContents }}
                  />
                </li>
              ) : rodCount ? (
                <li className="flex justify-center">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg">
                    <div className="text-center">
                      <span className="text-xs font-bold uppercase tracking-wider block">Rods</span>
                      <span className="text-2xl font-thin">{rodCount}</span>
                    </div>
                  </div>
                </li>
              ) : null}
              {bullets && bullets.map((line, i) => (
                <li key={i}>
                  <p className="text-gray-600 text-sm leading-relaxed">• {line}</p>
                </li>
              ))}
              {!openBoxDetails && product.features && product.features.slice(0, 3).map((feature, i) => (
                <li key={`feature-${i}`}>
                  <p className="text-gray-600 text-sm leading-relaxed">• {feature}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Pricing */}
        <div className="space-y-3 mt-auto">
          {/* Price Display */}
          <div className="flex items-center justify-between">
            {product.category === 'open-box' ? (
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-[#ff6b35]" />
                <span className="text-3xl font-bold text-[#ff6b35] uppercase">Open Box</span>
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  {hasDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-green-600">${discountedPrice.toFixed(2)}</span>
                      <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </>
                  )}
                </div>
                {hasDiscount ? (
                  <Badge className="bg-green-600 text-white">
                    SAVE ${(product.price - discountedPrice).toFixed(2)}
                  </Badge>
                ) : product.originalPrice ? (
                  <Badge variant="destructive" className="bg-red-500 text-white">
                    SAVE ${(product.originalPrice - product.price).toFixed(2)}
                  </Badge>
                ) : null}
              </>
            )}
          </div>
          
          {/* Buy Button */}
          {product.category === 'open-box' ? (
            <Link to={`/shop/${product.id}`} className="block w-full">
              <button className="w-full font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#ff6b35] text-white rounded-lg flex items-center justify-center gap-2">
                <Package className="h-4 w-4" />
                SEE WHAT'S AVAILABLE
              </button>
            </Link>
          ) : (
            <AddToCartBar product={{ ...product, price: discountedPrice }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleProductCard;
