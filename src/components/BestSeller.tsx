import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import AddToCartBar from '@/components/cart/AddToCartBar';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useIsMobile } from '@/hooks/use-mobile';
import starterSetImg from '@/assets/optimized/starter-set.jpg';
import familySetImg from '@/assets/optimized/family-set.jpg';
import sisterStaplesImg from '@/assets/optimized/sister-staples.jpg';
const buyCards = [{
  id: "bundle-1",
  name: 'Starter Set',
  price: 90.00,
  originalPrice: null,
  stripePriceId: "price_1SGKRwDkJNZeOpMwTtMXQrHE",
  image: starterSetImg,
  badge: "STARTER BUNDLE",
  description: "START. SAFE. STYLE.",
  rodCount: 11,
  bundleContents: "2 Large (4 rods each) + 1 Medium (2 rods) + 1 Small (1 rod)",
  rating: 5,
  reviews: 89
}, {
  id: "bundle-2",
  name: 'Sister Staples',
  price: 137.00,
  originalPrice: null,
  stripePriceId: "price_1SGKRxDkJNZeOpMwdoeKbQQN",
  image: sisterStaplesImg,
  badge: "SMART SET",
  description: "SMART. SET. READY.",
  rodCount: 17,
  bundleContents: "3 Large (4 rods each) + 2 Medium (2 rods each) + 1 Small (1 rod)",
  rating: 5,
  reviews: 124
}];
const BestSeller = () => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [errorImages, setErrorImages] = useState<Record<string, boolean>>({});
  const [showOverlay, setShowOverlay] = useState<Record<string, boolean>>({});
  
  const { ref, hasIntersected } = useIntersectionObserver({ 
    threshold: 0.3, 
    triggerOnce: true 
  });
  const isMobile = useIsMobile();
  
  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => ({
      ...prev,
      [itemId]: true
    }));
  };
  
  const handleImageError = (itemId: string) => {
    setErrorImages(prev => ({
      ...prev,
      [itemId]: true
    }));
    // Still mark as loaded to remove skeleton
    setLoadedImages(prev => ({
      ...prev,
      [itemId]: true
    }));
  };
  
  const handleMobileTap = (cardId: string) => {
    if (isMobile) {
      setShowOverlay(prev => ({ ...prev, [cardId]: true }));
      setTimeout(() => {
        setShowOverlay(prev => ({ ...prev, [cardId]: false }));
      }, 2000);
    }
  };
  
  // Animate overlay reveal on mobile after scroll-in
  useEffect(() => {
    if (hasIntersected && isMobile) {
      // Wait for expansion animation to complete
      setTimeout(() => {
        setShowOverlay({
          [buyCards[0].id]: true,
          [buyCards[1].id]: true
        });
        
        // Hide overlays after 2 seconds
        setTimeout(() => {
          setShowOverlay({});
        }, 2000);
      }, 600);
    }
  }, [hasIntersected, isMobile]);
  return <section ref={ref} className="pt-[60px] md:pt-[80px] lg:pt-[120px] pb-12 md:pb-16 lg:pb-20 bg-[hsl(var(--brand-pink))]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 items-center lg:items-center">
          {/* Text Content - Left Side */}
          <div className="text-center lg:text-left flex-shrink-0 w-full lg:w-[35%] max-w-md lg:max-w-none">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 md:mb-6 leading-[1.1] tracking-wide">
              <span className="font-script font-bold italic text-[2.5em] inline-block">Best</span>{' '}
              <span className="inline-block">SELLERS</span>
            </h2>
            <p className="text-white text-base md:text-lg leading-relaxed font-light max-w-sm mx-auto lg:mx-0">
              Everyone's go-to organizers — and for good reason.
            </p>
          </div>
        
        {/* Images Container - Right Side */}
        <div className="flex flex-col gap-6 md:gap-8 w-full lg:flex-1 items-center lg:items-start max-w-md md:max-w-lg lg:max-w-none mx-auto lg:mx-0">
            <Card className={cn(
              "group border-none shadow-lg bg-white relative rounded-3xl overflow-hidden w-full max-w-[280px] md:max-w-[320px] h-[350px] md:h-[400px]",
              "hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
              "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              isMobile && hasIntersected
                ? "opacity-100 scale-100" 
                : isMobile 
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            )}>
              <Link 
                to="/shop" 
                className="block h-full active:scale-95 md:active:scale-100 transition-transform"
                onClick={() => handleMobileTap(buyCards[0].id)}
              >
                <div className="relative h-full">
                  {!loadedImages[buyCards[0].id] && <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />}
                  
                  <img 
                    src={buyCards[0].image} 
                    alt={`${buyCards[0].name} - Bundle collection`} 
                    className={cn("w-full h-full object-cover transition-opacity duration-500 scale-125", loadedImages[buyCards[0].id] ? "opacity-100" : "opacity-0")} 
                    loading="eager"
                    decoding="async"
                    sizes="(min-width: 768px) 50vw, 280px"
                    onLoad={() => handleImageLoad(buyCards[0].id)}
                    onError={() => handleImageError(buyCards[0].id)}
                  />
                  
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    "md:opacity-0 md:group-hover:opacity-100",
                    isMobile 
                      ? (showOverlay[buyCards[0].id] ? "opacity-100" : "opacity-0")
                      : ""
                  )}>
                    <h3 className="text-white text-4xl md:text-5xl font-poppins font-thin drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">{buyCards[0].name}</h3>
                  </div>
                  
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
                      <div className="pointer-events-auto">
                        <AddToCartBar product={{
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
                    }} />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </Card>

            <Card className={cn(
              "group border-none shadow-lg bg-white relative rounded-3xl overflow-hidden w-full max-w-[280px] md:max-w-[320px] h-[350px] md:h-[400px]",
              "hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
              "transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] delay-150",
              isMobile && hasIntersected
                ? "opacity-100 scale-100" 
                : isMobile 
                ? "opacity-0 scale-90"
                : "opacity-100 scale-100"
            )}>
              <Link 
                to={`/shop/${buyCards[1].id}`} 
                className="block h-full active:scale-95 md:active:scale-100 transition-transform"
                onClick={() => handleMobileTap(buyCards[1].id)}
              >
                <div className="relative h-full">
                  {!loadedImages[buyCards[1].id] && <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />}
                  
                  <img src={buyCards[1].image} alt={`${buyCards[1].name} - Bundle collection`} className={cn("w-full h-full object-cover transition-opacity duration-500 scale-125", loadedImages[buyCards[1].id] ? "opacity-100" : "opacity-0")} loading="eager" decoding="async" onLoad={() => handleImageLoad(buyCards[1].id)} onError={() => handleImageError(buyCards[1].id)} />
                  
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-300",
                    "md:opacity-0 md:group-hover:opacity-100",
                    isMobile 
                      ? (showOverlay[buyCards[1].id] ? "opacity-100" : "opacity-0")
                      : ""
                  )}>
                    <h3 className="text-white text-4xl md:text-5xl font-poppins font-thin drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)]">{buyCards[1].name}</h3>
                  </div>
                  
                  {!isMobile && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 pointer-events-none">
                      <div className="pointer-events-auto">
                        <AddToCartBar product={{
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
                    }} />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </Card>
        </div>
        </div>
      </div>
    </section>;
};
export default BestSeller;