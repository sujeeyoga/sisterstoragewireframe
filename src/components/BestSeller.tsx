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
];

const BestSeller = () => {
  const [loadedImages, setLoadedImages] = React.useState<Record<string, boolean>>({});
  
  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => ({ ...prev, [itemId]: true }));
  };

  return (
    <section className="pt-[60px] md:pt-[120px] pb-8 md:pb-12 bg-[hsl(var(--brand-pink))]">
      <div className="max-w-[2304px] mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="inline-block px-6 py-2.5 bg-white text-[hsl(var(--brand-pink))] text-sm font-bold rounded-full mb-6 shadow-lg">
            Shop Now
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-[0.95] tracking-wide">
            <span className="text-white">BEST SELLERS</span>
          </h2>
          <p className="text-white text-lg md:text-xl leading-relaxed font-light">
            Everyone's go-to organizers — and for good reason.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-7xl mx-auto my-8">
            <Card className="group border-none shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white relative rounded-3xl overflow-hidden aspect-square">
              <Link to={`/shop/${buyCards[0].id}`} className="block h-full">
                <div className="relative group-hover:overflow-visible h-full">
                  {!loadedImages[buyCards[0].id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  )}
                  
                  <img 
                    src={buyCards[0].image} 
                    alt={`${buyCards[0].name} - Bundle collection`}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700 scale-125",
                      loadedImages[buyCards[0].id] ? "opacity-100" : "opacity-0"
                    )}
                    loading="eager"
                    decoding="async"
                    onLoad={() => handleImageLoad(buyCards[0].id)}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                    <h3 className="text-sister-pink text-4xl md:text-5xl font-poppins font-thin">{buyCards[0].name}</h3>
                  </div>
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
...
                    <div className="pointer-events-auto">
                      <AddToCartBar 
                        product={{
                          id: buyCards[0].id,
                          name: buyCards[0].name,
                          price: buyCards[0].price,
                          originalPrice: buyCards[0].originalPrice,
                          stripePriceId: buyCards[0].stripePriceId,
                          description: buyCards[0].description,
                          category: 'bundle',
                          color: '#E90064',
                          images: [buyCards[0].image],
                          features: [],
                          material: '',
                          stock: 100,
                          bundleContents: buyCards[0].bundleContents
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="group border-none shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white relative rounded-3xl overflow-hidden aspect-[3/4]">
              <Link to={`/shop/${buyCards[1].id}`} className="block h-full">
                <div className="relative group-hover:overflow-visible h-full">
                  {!loadedImages[buyCards[1].id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  )}
                  
                  <img 
                    src={buyCards[1].image} 
                    alt={`${buyCards[1].name} - Bundle collection`}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700 scale-125",
                      loadedImages[buyCards[1].id] ? "opacity-100" : "opacity-0"
                    )}
                    loading="eager"
                    decoding="async"
                    onLoad={() => handleImageLoad(buyCards[1].id)}
                  />
                  
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                    <h3 className="text-sister-pink text-4xl md:text-5xl font-poppins font-thin">{buyCards[1].name}</h3>
                  </div>
                  
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
...
                    <div className="pointer-events-auto">
                      <AddToCartBar 
                        product={{
                          id: buyCards[1].id,
                          name: buyCards[1].name,
                          price: buyCards[1].price,
                          originalPrice: buyCards[1].originalPrice,
                          stripePriceId: buyCards[1].stripePriceId,
                          description: buyCards[1].description,
                          category: 'bundle',
                          color: '#E90064',
                          images: [buyCards[1].image],
                          features: [],
                          material: '',
                          stock: 100,
                          bundleContents: buyCards[1].bundleContents
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
        </div>
        
        <div className="text-center mt-16 md:mt-20">
          <Button 
            variant="outline" 
            className="px-10 py-6 text-lg border-2 border-white text-white hover:bg-white hover:text-[hsl(var(--brand-pink))] hover:scale-105 font-bold transition-all duration-300 shadow-lg"
            asChild
          >
            <Link to="/shop">
              View All Products
            </Link>
          </Button>
          <p className="text-white text-sm md:text-base mt-4 font-light">Free shipping on orders over $50 • 30-day returns</p>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
