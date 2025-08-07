
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const bestSellerItems = [
  {
    id: "bestseller1",
    name: 'Velvet Bangle Organizer',
    price: 29.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg',
    customerName: 'Thanuja P.',
    customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
    testimonial: "This organizer changed how I store my bangles. Everything has its perfect place now!",
    socialProof: "Sister-Approved Favorite",
    rating: 5
  },
  {
    id: "bestseller2", 
    name: 'Glass Lid Jewelry Box',
    price: 42.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg',
    customerName: 'Richase M.',
    customerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    testimonial: "Beautiful design meets perfect functionality. My jewelry has never looked better organized.",
    socialProof: "Community Favorite",
    rating: 5
  },
  {
    id: "bestseller3",
    name: 'Cultural Keepsake Box', 
    price: 64.99,
    image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-13-scaled.jpg',
    customerName: 'Tanya R.',
    customerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    testimonial: "Finally found storage that honors my cultural pieces with the respect they deserve.",
    socialProof: "Most Loved by Sisters",
    rating: 5
  },
];

const BestSeller = () => {
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

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-[#E6007E] font-medium">Sister Favorites</span>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-thin font-poppins tracking-wide mt-2 mb-3 uppercase">Our Best Sellers</h2>
          <p className="text-gray-600 font-poppins">
            Discover why these storage solutions are most loved by our community of organized sisters.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4">
          {bestSellerItems.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={`${item.name} - Sister Storage best seller`}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[#E6007E] text-white text-xs font-bold px-2 py-1 font-poppins">
                    {item.socialProof}
                  </span>
                </div>
              </div>
              
              <CardContent className="p-4 md:p-6">
                {/* Customer Testimonial Section */}
                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                  <img 
                    src={item.customerImage}
                    alt={item.customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 italic font-poppins leading-relaxed">
                      "{item.testimonial}"
                    </p>
                    <p className="text-xs font-semibold text-gray-600 mt-1 font-poppins">
                      — {item.customerName}
                    </p>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold font-poppins">{item.name}</h3>
                  <span className="text-[#E6007E] font-bold text-lg font-poppins">${item.price.toFixed(2)}</span>
                </div>
                
                {/* CTA Button */}
                <Button 
                  variant="default"
                  className="w-full flex items-center justify-center gap-2 bg-[#E6007E] hover:bg-[#c50058] font-poppins"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add Sister Favorite
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10 md:mt-12">
          <Button 
            variant="secondary" 
            className="px-6 py-5 text-base w-full sm:w-auto max-w-xs mx-auto hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E] font-poppins"
            asChild
          >
            <Link to="/shop">
              Shop All Sister Favorites
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
