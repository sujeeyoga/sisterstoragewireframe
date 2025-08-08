
import { useState } from 'react';
import HeroContent from './hero/HeroContent';
import ScrollIndicator from './hero/ScrollIndicator';
import { useOptimizedScroll } from '@/hooks/use-optimized-scroll';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';

const bestSellerItems = [
  {
    id: "bestseller1",
    name: 'Velvet Bangle Organizer',
    price: 29.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg',
    rating: 5
  },
  {
    id: "bestseller2", 
    name: 'Glass Lid Jewelry Box',
    price: 42.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg',
    rating: 5
  },
  {
    id: "bestseller3",
    name: 'Cultural Keepsake Box', 
    price: 64.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-13-scaled.jpg',
    rating: 5
  },
];

const Hero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: { id: string; name: string; price: number; image: string }) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} added to your cart`,
    });
  };

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Use optimized scroll hook only if motion is allowed
  useOptimizedScroll({
    onScroll: prefersReducedMotion ? () => {} : setScrollPosition,
    throttle: 16,
    passive: true
  });

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#E90064]" aria-label="Hero section">
      <div className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center pt-40 pb-32 lg:pt-48 lg:pb-20 z-20 gap-24 lg:gap-40 px-4">
        {/* Hero Content - Centered with proper spacing */}
        <div className="w-full flex flex-col justify-center items-center lg:items-start">
          <div className="w-full space-y-8 text-center lg:text-left">
            <HeroContent scrollPosition={scrollPosition} />
          </div>
        </div>
        
        {/* Hero Image with White Container - Proper spacing and sizing */}
        <div className="flex-1 flex justify-center lg:justify-end items-center px-6 lg:px-8 max-w-xl animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-lg transform hover:scale-[1.02] transition-all duration-500 ease-out hover:shadow-[0_35px_60px_-12px_rgba(0,0,0,0.4)]">
            <div className="aspect-square overflow-hidden rounded-2xl mb-8 lg:mb-10 shadow-lg relative group">
              <img
                src="https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-27-scaled.jpg"
                alt="Sister Storage lifestyle organization"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-xl lg:text-2xl font-black text-[#E90064] tracking-tight leading-tight">BEAUTIFUL ORGANIZATION</h3>
              <p className="text-gray-700 text-sm lg:text-base leading-relaxed font-medium">
                Transform your space with our thoughtfully designed storage solutions. Made by sisters, for sisters.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Best Seller Cards Section */}
      <div className="relative z-20 px-4 pb-16">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">SISTER FAVORITES</h3>
            <p className="text-white/90 text-sm">Our most loved storage solutions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {bestSellerItems.map((item, index) => (
              <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={`${item.name} - Sister Storage best seller`}
                    className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <Heart className="h-4 w-4 text-white fill-[#E90064]" />
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 leading-tight">{item.name}</h4>
                    <span className="text-[#E90064] font-bold text-sm">${item.price.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    variant="default"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1 bg-[#E90064] hover:bg-[#c50058] text-xs py-2"
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingBag className="h-3 w-3" />
                    BUY
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <ScrollIndicator scrollPosition={scrollPosition} />
      
      {/* Enhanced bottom gradient for seamless transition to parallax */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#E90064] via-[#E90064]/95 to-transparent z-10 pointer-events-none" />
    </section>
  );
};

export default Hero;
