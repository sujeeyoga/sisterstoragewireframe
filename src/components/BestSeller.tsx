import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AddToCartBar from '@/components/cart/AddToCartBar';

const buyCards = [
  {
    id: "bundle-1",
    name: 'Starter Set',
    price: 90.00,
    originalPrice: null,
    stripePriceId: "price_1SGKRwDkJNZeOpMwTtMXQrHE",
    image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Starter-Set-2x-Large-1x-Medium-Box-1x-Small-Box/1759980850863-5xgr2a.jpg',
    badge: "STARTER BUNDLE",
    description: "START. SAFE. STYLE.",
    rodCount: 11,
    bundleContents: "2 Large (4 rods each) + 1 Medium (2 rods) + 1 Small (1 rod)",
    rating: 5,
    reviews: 89
  },
  {
    id: "bundle-2", 
    name: 'Sister Staples',
    price: 137.00,
    originalPrice: null,
    stripePriceId: "price_1SGKRxDkJNZeOpMwdoeKbQQN",
    image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Together%20Bundle-%203%20Large%202%20Medium%201%20Travel/1759979157485-d2rva.jpg',
    badge: "SMART SET",
    description: "SMART. SET. READY.",
    rodCount: 17,
    bundleContents: "3 Large (4 rods each) + 2 Medium (2 rods each) + 1 Small (1 rod)",
    rating: 5,
    reviews: 124
  },
  {
    id: "bundle-3",
    name: 'Family Edition',
    price: 174.00,
    originalPrice: null,
    stripePriceId: "price_1SGKRyDkJNZeOpMwrEmPHrtg",
    image: 'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/The-Complete-Family-Set-4-Large-2-Medium-2-Travel/1759980920453-ezsfq.jpg',
    badge: "BEST SELLER",
    description: "BIG. BUNDLE. LOVE.",
    rodCount: 22,
    bundleContents: "4 Large (4 rods each) + 2 Medium (2 rods each) + 2 Small (1 rod each)",
    rating: 5,
    reviews: 167
  },
];

const BestSeller = () => {
  const [loadedImages, setLoadedImages] = React.useState<Record<string, boolean>>({});
  
  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => ({ ...prev, [itemId]: true }));
  };

  return (
    <section className="pt-[60px] md:pt-[120px] pb-8 md:pb-12 bg-gray-50">
      <div className="px-4 md:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-block px-4 py-2 bg-[#E90064] text-white text-sm font-bold rounded-full mb-4">
            Shop Now
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            <span className="text-[#E90064]">BEST SELLERS</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Everyone's go-to organizers — and for good reason.
          </p>
        </div>
        
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {buyCards.map((item, index) => (
            <Card key={item.id} className="group flex-shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white relative snap-center">
              {/* Bundle Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-lg ${
                  item.badge === 'STARTER BUNDLE' ? 'bg-white text-blue-600' :
                  item.badge === 'TRAVEL READY' ? 'bg-white text-emerald-600' :
                  item.badge === 'MOST POPULAR' ? 'bg-white text-pink-600' :
                  'bg-white text-purple-600'
                }`}>
                  {item.badge}
                </span>
              </div>
              
              {/* Product Image */}
              <Link to={`/shop/${item.id}`} className="block relative">
                <div className="relative overflow-hidden group-hover:overflow-visible">
                  {/* Loading skeleton */}
                  {!loadedImages[item.id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  )}
                  
                  <img 
                    src={item.image} 
                    alt={`${item.name} - Bundle collection`}
                    className={cn(
                      "w-full aspect-[4/5] object-cover transition-all duration-700",
                      loadedImages[item.id] ? "opacity-100" : "opacity-0"
                    )}
                    loading="eager"
                    decoding="async"
                    onLoad={() => handleImageLoad(item.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Card content overlay that appears on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4 pointer-events-none">
                    <h3 className="text-white text-2xl font-bold mb-2">{item.name}</h3>
                    <p className="text-white/90 text-sm mb-2">{item.description}</p>
                    <p className="text-white text-xl font-semibold">${item.price}</p>
                  </div>
                </div>
              </Link>
              
              <CardContent className="p-4 space-y-3">
                {/* Badge */}
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xl">
                  {item.badge}
                </span>
                
                {/* Bundle Title */}
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                
                {/* Pricing */}
                <p className="text-xl font-semibold text-gray-800 mb-4">${item.price}</p>
                
                {/* Description */}
                <p className="text-xl text-gray-700 mb-5">{item.description}</p>
                
                {/* Bundle Contents */}
                <div className="bg-gray-50 rounded p-3 border border-gray-200">
                  <p className="text-xs font-bold text-[hsl(var(--brand-pink))] uppercase tracking-wider mb-2">What's Included</p>
                  <p className="text-sm text-gray-600">{item.bundleContents}</p>
                </div>
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-xl">({item.reviews} reviews)</span>
                </div>
                
                {/* Buttons */}
                <AddToCartBar 
                  product={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    originalPrice: item.originalPrice,
                    stripePriceId: item.stripePriceId,
                    description: item.description,
                    category: 'bundle',
                    color: '#E90064',
                    images: [item.image],
                    features: [],
                    material: '',
                    stock: 100,
                    bundleContents: item.bundleContents
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 md:mt-16">
          <Button 
            variant="outline" 
            className="px-8 py-4 text-lg border-2 border-[#E90064] text-[#E90064] hover:bg-[#E90064] hover:text-white font-bold transition-all duration-300"
            asChild
          >
            <Link to="/shop">
              View All Products
            </Link>
          </Button>
          <p className="text-gray-500 text-sm mt-3">Free shipping on orders over $50 • 30-day returns</p>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
