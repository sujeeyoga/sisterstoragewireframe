
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Star, Heart, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const buyCards = [
  {
    id: "buy1",
    name: 'Velvet Bangle Organizer',
    price: 29.99,
    originalPrice: 39.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg',
    badge: "BESTSELLER",
    description: "Perfect for organizing bangles and bracelets",
    rating: 5,
    reviews: 124
  },
  {
    id: "buy2", 
    name: 'Glass Lid Jewelry Box',
    price: 42.99,
    originalPrice: 54.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg',
    badge: "POPULAR",
    description: "Elegant glass display for precious jewelry",
    rating: 5,
    reviews: 89
  },
  {
    id: "buy3",
    name: 'Cultural Keepsake Box', 
    price: 64.99,
    originalPrice: 79.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-13-scaled.jpg',
    badge: "LIMITED",
    description: "Honor your heritage with beautiful storage",
    rating: 5,
    reviews: 156
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {buyCards.map((item, index) => (
            <Card key={item.id} className="group overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white relative transform hover:-translate-y-2">
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  item.badge === 'BESTSELLER' ? 'bg-[#E90064] text-white' :
                  item.badge === 'POPULAR' ? 'bg-orange-500 text-white' :
                  'bg-purple-600 text-white'
                }`}>
                  {item.badge}
                </span>
              </div>

              {/* Favorite Heart */}
              <div className="absolute top-4 right-4 z-10">
                <Heart className="h-6 w-6 text-white fill-[#E90064] drop-shadow-lg" />
              </div>
              
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={`${item.name} - Buy now`}
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Quick Buy Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button 
                    variant="buy"
                    size="buy"
                    className="transform scale-95 group-hover:scale-100"
                    onClick={() => handleBuyNow(item)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Quick Buy
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">({item.reviews} reviews)</span>
                </div>
                
                {/* Product Info */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{item.description}</p>
                
                {/* Pricing */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black text-[#E90064]">${item.price}</span>
                  <span className="text-lg text-gray-400 line-through">${item.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                    SAVE ${(item.originalPrice - item.price).toFixed(2)}
                  </span>
                </div>
                
                {/* Buy Button */}
                <Button 
                  variant="buy"
                  size="buy"
                  onClick={() => handleBuyNow(item)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  BUY NOW
                </Button>
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
