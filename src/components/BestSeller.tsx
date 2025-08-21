
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Star, Heart, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const buyCards = [
  {
    id: "bundle1",
    name: 'First Sister Set',
    price: 89.99,
    originalPrice: 120.99,
    image: '/lovable-uploads/2a4c457a-7695-47d3-9912-ab2900c6ea25.png',
    badge: "STARTER BUNDLE",
    description: "Perfect starter collection for new Sister Storage lovers",
    rodCount: 11,
    bundleContents: "2 Large (4 rods each) + 1 Medium (2 rods) + 1 Travel (1 rod)",
    rating: 5,
    reviews: 89
  },
  {
    id: "bundle2", 
    name: 'Small & Travel',
    price: 49.99,
    originalPrice: 60.99,
    image: '/lovable-uploads/76c5f6ac-f27b-4f26-8377-759dfc17c71d.png',
    badge: "TRAVEL READY",
    description: "Compact, on-the-go storage for your adventures",
    rodCount: 3,
    bundleContents: "3 Travel boxes (1 rod each)",
    rating: 5,
    reviews: 124
  },
  {
    id: "bundle3",
    name: 'Everyday Sister Staples', 
    price: 79.99,
    originalPrice: 95.99,
    image: '/lovable-uploads/b32a7860-b957-41e7-9c5c-cbd348260cf2.png',
    badge: "MOST POPULAR",
    description: "Mid-range, daily-use essentials for the organized sister",
    rodCount: 10,
    bundleContents: "2 Large (4 rods each) + 1 Medium (2 rods)",
    rating: 5,
    reviews: 203
  },
  {
    id: "bundle4",
    name: 'Forever Sister Collection',
    price: 149.99,
    originalPrice: 200.99,
    image: '/lovable-uploads/03cc68a5-5bfc-4417-bf01-d43578ffa321.png',
    badge: "BEST VALUE",
    description: "High-value premium bundle for the ultimate Sister experience",
    rodCount: 22,
    bundleContents: "4 Large (4 rods each) + 2 Medium (2 rods) + 2 Travel (1 rod)",
    rating: 5,
    reviews: 167
  },
];

const BestSeller = () => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const handleBuyNow = (item: { id: string; name: string; price: number; image: string }) => {
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

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4">
          <span className="inline-block px-4 py-2 bg-[#E90064] text-white text-sm font-bold rounded-full mb-4">
            Shop Now
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
            BUY SISTER<br />
            <span className="text-[#E90064]">FAVORITES</span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Get the storage solutions our community loves most. 
            Limited stock, unlimited style.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-6 px-4">
          {buyCards.map((item, index) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-500 bg-white relative transform hover:-translate-y-1 hover:scale-[1.02]">
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
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={`${item.name} - Bundle collection`}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Quick Buy Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="buy"
                    size="buy"
                    className="transform scale-90 group-hover:scale-100 shadow-2xl"
                    onClick={() => handleBuyNow(item)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Add
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-5 space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-gray-500 text-xs font-medium">({item.reviews})</span>
                </div>
                
                {/* Bundle Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
                
                {/* Bundle Contents */}
                <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Bundle Includes</p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">{item.bundleContents}</p>
                </div>
                
                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">${item.price}</span>
                      <span className="text-sm text-gray-400 line-through">${item.originalPrice}</span>
                    </div>
                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                      Save ${(item.originalPrice - item.price).toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Rod Count & Buy Button Row */}
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-lg flex-shrink-0">
                      <div className="text-center">
                        <span className="text-xs font-bold uppercase tracking-wider block">Rods</span>
                        <span className="text-2xl font-thin">{item.rodCount}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="buy"
                      size="buy"
                      className="flex-1 font-bold text-sm py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={() => handleBuyNow(item)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      GET THIS BUNDLE
                    </Button>
                  </div>
                </div>
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
