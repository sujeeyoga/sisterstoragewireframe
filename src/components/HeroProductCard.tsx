import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ShoppingBag } from 'lucide-react';

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
  const handleBuyNow = () => {
    window.location.href = href;
  };

  return (
    <Card className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white relative transform hover:-translate-y-1 hover:scale-[1.02] max-w-sm">
      {/* Bundle Badge */}
      <div className="absolute top-3 left-3 z-10">
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
        
        {/* Quick Buy Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button 
            variant="buy"
            size="buy"
            className="transform scale-90 group-hover:scale-100 shadow-2xl"
            onClick={handleBuyNow}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>
      
      <CardContent className="p-5 space-y-4">
        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="text-gray-500 text-xs font-medium">({reviews})</span>
        </div>
        
        {/* Product Title & Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
        
        {/* Pricing */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-gray-900">${price}</span>
              <span className="text-sm text-gray-400 line-through">${originalPrice}</span>
            </div>
            <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
              Save ${(originalPrice - price).toFixed(2)}
            </div>
          </div>
          
          <Button 
            variant="buy"
            size="buy"
            className="w-full font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleBuyNow}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            GET THIS PRODUCT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroProductCard;