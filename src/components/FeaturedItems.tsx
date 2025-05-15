
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';

// Mock data for our menu items
const menuCategories = [
  { id: 'ramen', label: 'Signature Ramen' },
  { id: 'sides', label: 'Side Dishes' },
  { id: 'drinks', label: 'Beverages' },
];

const menuItems = {
  ramen: [
    {
      id: 1,
      name: 'Tonkotsu Supreme',
      description: 'Our signature 20-hour pork broth with marinated chashu, ajitama egg, green onions, and premium nori',
      price: '$16.99',
      image: 'https://images.unsplash.com/photo-1614563637806-1d0e645e0940?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Shoyu Classic',
      description: 'Traditional soy-based broth with tender chicken, bamboo shoots, nori, and house-made noodles',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Spicy Miso Deluxe',
      description: 'Bold miso broth with spicy chili oil, ground pork, sweet corn, bean sprouts, and garlic chips',
      price: '$17.99',
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Garden Vegetable',
      description: 'Hearty vegetable broth with marinated tofu, seasonal mushrooms, corn, and bok choy on silky noodles',
      price: '$14.99',
      image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=800&auto=format&fit=crop'
    },
  ],
  sides: [
    {
      id: 5,
      name: 'Crispy Gyoza',
      description: 'Hand-folded dumplings filled with seasoned pork and vegetables, pan-fried to perfection (6 pcs)',
      price: '$8.99',
      image: 'https://images.unsplash.com/photo-1677180800622-6e8c4ac04b5e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      name: 'Karaage Chicken',
      description: 'Japanese-style fried chicken marinated in ginger, garlic, and soy, served with yuzu mayo',
      price: '$10.99',
      image: 'https://images.unsplash.com/photo-1600891964599-f61f4d5e0ffb?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 7,
      name: 'Truffle Edamame',
      description: 'Steamed young soybeans tossed in truffle oil and Himalayan sea salt for an elevated flavor experience',
      price: '$6.99',
      image: 'https://images.unsplash.com/photo-1622040806485-8227cb480a81?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 8,
      name: 'Takoyaki Balls',
      description: 'Traditional octopus-filled dough balls topped with takoyaki sauce, mayo, and bonito flakes',
      price: '$9.99',
      image: 'https://images.unsplash.com/photo-1617196701537-7329482cc9fe?q=80&w=800&auto=format&fit=crop'
    },
  ],
  drinks: [
    {
      id: 9,
      name: 'Asahi Super Dry',
      description: 'Japan's #1 beer – crisp, refreshing dry rice lager that pairs perfectly with ramen (500ml)',
      price: '$7.99',
      image: 'https://images.unsplash.com/photo-1600802935306-acb7dcf65b22?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 10,
      name: 'Premium Junmai Sake',
      description: 'Smooth, hand-selected sake with notes of pear and gentle rice aromatics (180ml)',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1610159071804-bfe39667a7b1?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 11,
      name: 'Organic Sencha',
      description: 'Traditional Japanese green tea with grassy notes and a clean finish, brewed to perfection',
      price: '$3.99',
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 12,
      name: 'Original Ramune',
      description: 'Iconic Japanese marble soda with a sweet, refreshing taste and nostalgic pop-top bottle',
      price: '$4.99',
      image: 'https://images.unsplash.com/photo-1555949366-084937ff5001?q=80&w=800&auto=format&fit=crop'
    },
  ],
};

const FeaturedItems = () => {
  return (
    <section id="menu" className="py-16 md:py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-lg mx-auto mb-10 md:mb-12 px-4">
          <span className="text-ramen-red font-medium">Discover Our Menu</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-3">Featured Selections</h2>
          <p className="text-gray-600">
            Each dish is crafted with authentic Japanese techniques using carefully sourced ingredients that honor tradition while embracing innovation
          </p>
        </div>
        
        <Tabs defaultValue="ramen" className="w-full">
          <TabsList className="mx-auto flex justify-center mb-8 md:mb-10 bg-transparent border-b border-gray-200 overflow-x-auto no-scrollbar">
            {menuCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-ramen-red data-[state=active]:text-ramen-red px-4 md:px-6 py-3 text-base md:text-lg bg-transparent whitespace-nowrap"
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
                        <span className="text-ramen-red font-bold">{item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                      <Button 
                        className="w-full bg-ramen-black hover:bg-ramen-red text-white flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Order
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
            variant="outline" 
            className="border-ramen-black text-ramen-black hover:bg-ramen-black hover:text-white px-6 py-5 text-base w-full sm:w-auto max-w-xs mx-auto"
          >
            View Complete Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
