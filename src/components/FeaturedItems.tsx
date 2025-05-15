
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

// Mock data for our menu items
const menuCategories = [
  { id: 'ramen', label: 'Ramen' },
  { id: 'sides', label: 'Sides' },
  { id: 'drinks', label: 'Drinks' },
];

const menuItems = {
  ramen: [
    {
      id: 1,
      name: 'Tonkotsu Ramen',
      description: 'Rich pork broth, chashu, soft-boiled egg, green onions',
      price: '$16.99',
      image: 'https://images.unsplash.com/photo-1614563637806-1d0e645e0940?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 2,
      name: 'Shoyu Ramen',
      description: 'Soy sauce based broth, chicken, bamboo shoots, nori',
      price: '$15.99',
      image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 3,
      name: 'Spicy Miso Ramen',
      description: 'Spicy miso broth, ground pork, corn, bean sprouts',
      price: '$17.99',
      image: 'https://images.unsplash.com/photo-1623341214825-9f4f963727da?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 4,
      name: 'Vegetable Ramen',
      description: 'Vegetable broth, tofu, mushrooms, corn, bok choy',
      price: '$14.99',
      image: 'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?q=80&w=800&auto=format&fit=crop'
    },
  ],
  sides: [
    {
      id: 5,
      name: 'Gyoza',
      description: 'Pan-fried pork and vegetable dumplings (6 pcs)',
      price: '$8.99',
      image: 'https://images.unsplash.com/photo-1677180800622-6e8c4ac04b5e?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 6,
      name: 'Karaage',
      description: 'Japanese fried chicken with spicy mayo',
      price: '$10.99',
      image: 'https://images.unsplash.com/photo-1600891964599-f61f4d5e0ffb?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 7,
      name: 'Edamame',
      description: 'Steamed soy beans with sea salt',
      price: '$6.99',
      image: 'https://images.unsplash.com/photo-1622040806485-8227cb480a81?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 8,
      name: 'Takoyaki',
      description: 'Octopus balls topped with takoyaki sauce and bonito flakes',
      price: '$9.99',
      image: 'https://images.unsplash.com/photo-1617196701537-7329482cc9fe?q=80&w=800&auto=format&fit=crop'
    },
  ],
  drinks: [
    {
      id: 9,
      name: 'Asahi Beer',
      description: 'Japanese dry rice lager (500ml)',
      price: '$7.99',
      image: 'https://images.unsplash.com/photo-1600802935306-acb7dcf65b22?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 10,
      name: 'Sake',
      description: 'Premium Junmai Ginjo (180ml)',
      price: '$12.99',
      image: 'https://images.unsplash.com/photo-1610159071804-bfe39667a7b1?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 11,
      name: 'Green Tea',
      description: 'Hot Japanese green tea',
      price: '$3.99',
      image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 12,
      name: 'Ramune',
      description: 'Japanese soda with marble (Original)',
      price: '$4.99',
      image: 'https://images.unsplash.com/photo-1555949366-084937ff5001?q=80&w=800&auto=format&fit=crop'
    },
  ],
};

const FeaturedItems = () => {
  return (
    <section id="menu" className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-ramen-red font-medium">Our Menu</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Featured Items</h2>
          <p className="text-gray-600">
            Explore our signature dishes made with authentic Japanese techniques and the finest ingredients
          </p>
        </div>
        
        <Tabs defaultValue="ramen" className="w-full">
          <TabsList className="mx-auto flex justify-center mb-10 bg-transparent border-b border-gray-200">
            {menuCategories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:border-b-2 data-[state=active]:border-ramen-red data-[state=active]:text-ramen-red px-6 py-3 text-lg bg-transparent"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <span className="text-ramen-red font-bold">{item.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <Button 
                        className="w-full bg-ramen-black hover:bg-ramen-red text-white"
                      >
                        Add to Order
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            className="border-ramen-black text-ramen-black hover:bg-ramen-black hover:text-white px-8 py-6"
          >
            View Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
