import React from 'react';
import { Card } from '@/components/ui/card';
import PerformanceImage from '@/components/ui/performance-image';

const gridItems = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    title: "Smart Organization",
    description: "Technology meets tradition",
    size: "large" // Takes 2 rows
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80",
    title: "Natural Beauty",
    description: "Inspired by nature's harmony",
    size: "small" // Regular size
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    title: "Flowing Solutions",
    description: "Seamless storage systems",
    size: "medium" // Takes 1.5 rows
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1558618666-fbd6c327e46f?auto=format&fit=crop&w=800&q=80",
    title: "Modern Minimalism",
    description: "Clean lines, pure functionality",
    size: "small"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    title: "Cultural Heritage",
    description: "Honoring traditions with style",
    size: "medium"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    title: "Elegant Storage",
    description: "Beauty meets functionality",
    size: "large"
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
        
        <div className="columns-1 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {gridItems.map((item) => {
            const getSizeClass = (size: string) => {
              switch (size) {
                case 'large':
                  return 'h-96 md:h-80';
                case 'medium':
                  return 'h-80 md:h-64';
                case 'small':
                default:
                  return 'h-64 md:h-48';
              }
            };

            return (
              <Card 
                key={item.id} 
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer break-inside-avoid mb-4 md:mb-6"
              >
                <div className={`relative overflow-hidden ${getSizeClass(item.size)}`}>
                  <PerformanceImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-white/90">{item.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGrid;