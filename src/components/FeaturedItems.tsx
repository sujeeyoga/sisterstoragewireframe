import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

// Mock data for our storage items
const menuCategories = [
  { id: 'bangles', label: 'Bangle Storage' },
  { id: 'jewelry', label: 'Jewelry Storage' },
  { id: 'keepsakes', label: 'Keepsake Storage' },
];

const menuItems = {
  bangles: [
    {
      id: "box1",
      name: 'Velvet Bangle Organizer',
      description: 'Preserve your bangles with care in our soft-touch velvet box.',
      price: 29.99,
      image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-31-scaled.jpg'
    },
    {
      id: "box2",
      name: 'Glass Lid Bangle Box',
      description: 'Beautiful display box with glass lid perfect for showcasing your bangles while keeping them dust-free',
      price: 34.99,
      image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg'
    },
    {
      id: "box3",
      name: 'Stackable Bangle Trays',
      description: 'Versatile stackable trays that beautifully organize your bangles with a clean, minimal aesthetic',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "box4",
      name: 'Travel Bangle Case',
      description: 'Elegant travel case designed to keep your bangles safe and organized while on the go',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&auto=format&fit=crop'
    },
  ],
  jewelry: [
    {
      id: "jewelry1",
      name: 'Glass Lid Jewelry Box',
      description: 'Showcase and protect your collection with style and intention.',
      price: 42.99,
      image: 'https://sisterstorage.com/wp-content/uploads/2025/06/Sister-Storage-Lifestyle-Home-Shoot-23-scaled.jpg'
    },
    {
      id: "jewelry2",
      name: 'Earring Storage Case',
      description: 'Multi-compartment earring organizer perfect for studs, hoops, and dangly earrings with clear display',
      price: 26.99,
      image: 'https://images.unsplash.com/photo-1619119069152-a2b331eb392a?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "jewelry3",
      name: 'Necklace Hanger Frame',
      description: 'Beautiful frame with hooks to hang your necklaces tangle-free while creating a stunning wall display',
      price: 32.99,
      image: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "jewelry4",
      name: 'Ring Display Tower',
      description: 'Elegant tower designed to showcase your ring collection while keeping each piece separate and protected',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=800&auto=format&fit=crop'
    },
  ],
  keepsakes: [
    {
      id: "set1",
      name: 'Heirloom Storage Box',
      description: 'Beautifully crafted box designed to preserve your most treasured cultural heirlooms',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "set2",
      name: 'Memory Collection Case',
      description: 'Elegant case with compartments designed to organize and protect your precious memories',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "set3",
      name: 'Cultural Keepsake Box',
      description: 'Specially designed box that honors and preserves cultural artifacts and keepsakes',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1595052428850-404c2026c1fe?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "set4",
      name: 'Celebration Memory Box',
      description: 'Beautiful storage box designed to preserve mementos from special cultural celebrations',
      price: 54.99,
      image: 'https://images.unsplash.com/photo-1554232456-8727aae0cfa4?q=80&w=800&auto=format&fit=crop'
    },
  ],
};

const FeaturedItems = () => {
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
    <section id="menu" className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-[#E6007E] font-medium">Find Your Match</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Featured Collections</h2>
          <p className="text-gray-600">
            Discover storage that's designed for your bangles, jewelry, and keepsakes — made with the details that matter most.
          </p>
        </div>
        
        <Tabs defaultValue="bangles" className="w-full">
          <TabsList className="mx-auto flex justify-center mb-8 md:mb-10 bg-transparent border-b border-gray-200 overflow-x-auto no-scrollbar">
            {menuCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-[#E6007E] data-[state=active]:text-[#E6007E] px-4 md:px-6 py-3 text-base md:text-lg bg-transparent whitespace-nowrap"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={['Velvet Bangle Organizer', 'Glass Lid Bangle Box', 'Glass Lid Jewelry Box'].includes(item.name) ? `Sister Storage ${item.name.toLowerCase()} showcasing elegant jewelry storage solutions` : item.name}
                        className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg md:text-xl font-semibold">{item.name}</h3>
                        <span className="text-[#E6007E] font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                      <Button 
                        variant="default"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="text-center mt-10 md:mt-12">
          <Button 
            variant="secondary" 
            className="px-6 py-5 text-base w-full sm:w-auto max-w-xs mx-auto hover:bg-[#E6007E] hover:text-white hover:border-[#E6007E]"
            asChild
          >
            <Link to="/shop">
              View All Collections
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
