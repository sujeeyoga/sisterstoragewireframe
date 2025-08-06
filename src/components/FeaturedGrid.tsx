import React from 'react';
import { Card } from '@/components/ui/card';
import PerformanceImage from '@/components/ui/performance-image';

const gridItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80",
    title: "Smart Organization"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=400&q=80",
    title: "Natural Beauty"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=400&q=80",
    title: "Flowing Solutions"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1558618666-fbd6c327e46f?auto=format&fit=crop&w=400&q=80",
    title: "Modern Minimalism"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
    title: "Cultural Heritage"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80",
    title: "Elegant Storage"
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80",
    title: "Luxury Design"
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
    title: "Clean Lines"
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?auto=format&fit=crop&w=400&q=80",
    title: "Artistic Storage"
  }
];

const FeaturedGrid = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-bold mb-4">Featured Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of storage solutions designed for the modern sister.
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-1 max-w-4xl mx-auto">
          {gridItems.map((item) => (
            <div 
              key={item.id} 
              className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer group"
            >
              <PerformanceImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGrid;