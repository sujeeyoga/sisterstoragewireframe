import { Card, CardContent } from '@/components/ui/card';
import { Star, Tag } from 'lucide-react';
import AddToCartBar from '@/components/cart/AddToCartBar';
import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { Badge } from '@/components/ui/badge';

interface HeroProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  badge: string;
  description: string;
  rating: number;
  reviews: number;
  href: string;
}

const HeroProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  description,
  rating,
  reviews,
  href
}: HeroProductCardProps) => {
  const { discount, applyDiscount } = useStoreDiscount();
  
  // Check if product has its own sale price
  const hasProductSalePrice = price && originalPrice && price < originalPrice;
  const shouldApplyStoreDiscount = discount?.enabled && !hasProductSalePrice && id !== 'multipurpose-box';

  const discountedPrice = shouldApplyStoreDiscount ? applyDiscount(price) : price;
  const displayOriginalPrice = hasProductSalePrice ? originalPrice : (shouldApplyStoreDiscount ? price : undefined);
  const hasDiscount = (hasProductSalePrice || shouldApplyStoreDiscount) && discountedPrice < (displayOriginalPrice || price);

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white relative transform hover:-translate-y-1 hover:scale-[1.02] max-w-sm">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {hasDiscount && (
          <Badge className="bg-green-600 text-white px-2.5 py-1">
            <Tag className="h-3 w-3 mr-1" />
            {discount.percentage}% OFF
          </Badge>
        )}
        <span className="px-3 py-1.5 text-xs font-bold rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white">
          {badge}
        </span>
      </div>
      
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={`${name} - Featured product`}
          className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-5 flex flex-col h-full">
        {/* Rating - Fixed Height */}
        <div className="flex items-center justify-between h-6 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-gray-500 text-xs font-medium">({reviews})</span>
        </div>
        
        {/* Product Title - Fixed Min Height */}
        <div className="min-h-[3rem] mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{name}</h3>
        </div>
        
        {/* Description - Fixed Height */}
        <div className="h-[3rem] mb-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{description}</p>
        </div>
        
        {/* Pricing & Action - Fixed Height */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between min-h-[2rem]">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-green-600">${discountedPrice.toFixed(2)}</span>
              {displayOriginalPrice && (
                <span className="text-sm text-gray-400 line-through">${displayOriginalPrice.toFixed(2)}</span>
              )}
            </div>
            {hasDiscount && displayOriginalPrice && (displayOriginalPrice - discountedPrice) > 0 && (
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg min-w-[4rem] text-center">
                Save ${(displayOriginalPrice - discountedPrice).toFixed(2)}
              </div>
            )}
          </div>
          
          <AddToCartBar 
            product={{
              id,
              name,
              price: discountedPrice,
              originalPrice: displayOriginalPrice,
              description,
              category: 'bundle',
              color: '#E90064',
              images: [image],
              features: [],
              material: '',
              stock: 100
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroProductCard;
