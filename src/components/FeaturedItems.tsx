
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

// Mock data for our storage items
const menuCategories = [
  { id: 'boxes', label: 'Storage Boxes' },
  { id: 'jewelry', label: 'Jewelry Storage' },
  { id: 'sets', label: 'Storage Sets' },
];

const menuItems = {
  boxes: [
    {
      id: "box1",
      name: 'Velvet Bangle Organizer',
      description: 'Elegant, durable velvet organizer perfect for preserving your precious bangles and bracelets',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1595409825750-7b55f0c7b361?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "box2",
      name: 'Glass Lid Storage Box',
      description: 'Beautiful display box with glass lid perfect for showcasing your favorite accessories while keeping them dust-free',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "box3",
      name: 'Stackable Fabric Bins',
      description: 'Versatile fabric storage bins that beautifully stack to maximize your space with a clean, minimal aesthetic',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "box4",
      name: 'Minimalist Desk Organizer',
      description: 'Sleek desk organizer with multiple compartments to keep your workspace tidy and aesthetically pleasing',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&auto=format&fit=crop'
    },
  ],
  jewelry: [
    {
      id: "jewelry1",
      name: 'Ring Display Tower',
      description: 'Vertical ring organizer designed to showcase your collection while keeping each piece separate and protected',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1635767798638-3665c677a227?q=80&w=800&auto=format&fit=crop'
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
      name: 'Watch Display Box',
      description: 'Elegant watch organizer with padded slots to protect your timepieces while keeping them beautifully displayed',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?q=80&w=800&auto=format&fit=crop'
    },
  ],
  sets: [
    {
      id: "set1",
      name: 'Complete Dresser Set',
      description: 'Comprehensive matching storage set for your dresser, including jewelry, accessory, and makeup organizers',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "set2",
      name: 'Closet System Bundle',
      description: 'Transform your closet with our coordinated set of boxes, bins, and hangers for a cohesive organized space',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1595408043711-455f9386b41b?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "set3",
      name: 'Bathroom Counter Kit',
      description: 'Set of stylish containers and trays for organizing your bathroom essentials into an aesthetically pleasing display',
      price: 64.99,
      image: 'https://images.unsplash.com/photo-1595052428850-404c2026c1fe?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: "set4",
      name: 'Office Storage Collection',
      description: 'Coordinated desk organizers, file holders, and stationery containers to enhance your productivity and workspace beauty',
      price: 74.99,
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
    <section id="menu" className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-purple-600 font-medium">Find Your Match</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Featured Collections</h2>
          <p className="text-gray-600">
            Discover stylish storage solutions designed to bring beauty and organization to every corner of your life
          </p>
        </div>
        
        <Tabs defaultValue="boxes" className="w-full">
          <TabsList className="mx-auto flex justify-center mb-8 md:mb-10 bg-transparent border-b border-gray-200 overflow-x-auto no-scrollbar">
            {menuCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:text-purple-600 px-4 md:px-6 py-3 text-base md:text-lg bg-transparent whitespace-nowrap"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-[350px] mx-auto">
                    <div className="aspect-video w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-5 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg md:text-xl font-semibold">{item.name}</h3>
                        <span className="text-purple-600 font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                      <Button 
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
            className="px-6 py-5 text-base w-full sm:w-auto max-w-xs mx-auto"
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
