import React from 'react';
import { Card } from '@/components/ui/card';
import PerformanceImage from '@/components/ui/performance-image';

const gridItems = [
  // Row 1
  { id: 1, image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=400&q=80", title: "Smart Organization", span: "normal" },
  { id: 2, image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?auto=format&fit=crop&w=800&q=80", title: "Natural Beauty", span: "horizontal" },
  
  // Row 2
  { id: 3, image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=400&q=80", title: "Flowing Solutions", span: "vertical" },
  { id: 4, image: "https://images.unsplash.com/photo-1558618666-fbd6c327e46f?auto=format&fit=crop&w=400&q=80", title: "Modern Minimalism", span: "normal" },
  { id: 5, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80", title: "Cultural Heritage", span: "normal" },
  
  // Row 3
  { id: 6, image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=400&q=80", title: "Elegant Storage", span: "normal" },
  { id: 7, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80", title: "Luxury Design", span: "normal" },
  
  // Row 4
  { id: 8, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80", title: "Clean Lines", span: "horizontal" },
  { id: 9, image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?auto=format&fit=crop&w=400&q=80", title: "Artistic Storage", span: "normal" },
  
  // Row 5
  { id: 10, image: "https://images.unsplash.com/photo-1527772482340-7895c3f2b3f7?auto=format&fit=crop&w=400&q=80", title: "Minimalist Design", span: "normal" },
  { id: 11, image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=400&q=80", title: "Urban Living", span: "vertical" },
  { id: 12, image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80", title: "Cozy Spaces", span: "normal" },
  
  // Row 6
  { id: 13, image: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=400&q=80", title: "Scandinavian Style", span: "normal" },
  { id: 14, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80", title: "Heritage Collection", span: "normal" },
  
  // Row 7
  { id: 15, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80", title: "Modern Aesthetics", span: "horizontal" },
  { id: 16, image: "https://images.unsplash.com/photo-1534889156217-d643df14f14f?auto=format&fit=crop&w=400&q=80", title: "Functional Beauty", span: "normal" },
  
  // Row 8
  { id: 17, image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80", title: "Creative Storage", span: "normal" },
  { id: 18, image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=400&q=80", title: "Smart Solutions", span: "vertical" },
  { id: 19, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", title: "Timeless Design", span: "normal" },
  
  // Row 9
  { id: 20, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80", title: "Elegant Solutions", span: "normal" },
  { id: 21, image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?auto=format&fit=crop&w=400&q=80", title: "Artistic Flair", span: "normal" },
  
  // Row 10
  { id: 22, image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=800&q=80", title: "Contemporary Living", span: "horizontal" },
  { id: 23, image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80", title: "Refined Storage", span: "normal" },
  
  // Row 11
  { id: 24, image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=400&q=80", title: "Sophisticated Style", span: "normal" },
  { id: 25, image: "https://images.unsplash.com/photo-1527772482340-7895c3f2b3f7?auto=format&fit=crop&w=400&q=80", title: "Pure Elegance", span: "vertical" },
  { id: 26, image: "https://images.unsplash.com/photo-1567225557594-88d73e55f2cb?auto=format&fit=crop&w=400&q=80", title: "Modern Heritage", span: "normal" },
  
  // Row 12
  { id: 27, image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=400&q=80", title: "Comfort Zone", span: "normal" },
  { id: 28, image: "https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=400&q=80", title: "Nordic Inspiration", span: "normal" },
  
  // Row 13
  { id: 29, image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80", title: "Future Forward", span: "horizontal" },
  { id: 30, image: "https://images.unsplash.com/photo-1534889156217-d643df14f14f?auto=format&fit=crop&w=400&q=80", title: "Practical Beauty", span: "normal" },
  
  // Row 14
  { id: 31, image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=400&q=80", title: "Innovation Hub", span: "normal" },
  { id: 32, image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=400&q=80", title: "Tech Integration", span: "vertical" },
  { id: 33, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", title: "Classic Touch", span: "normal" },
  
  // Row 15
  { id: 34, image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80", title: "Perfect Harmony", span: "normal" },
  { id: 35, image: "https://images.unsplash.com/photo-1493663284031-b7e3aaa4cab7?auto=format&fit=crop&w=400&q=80", title: "Final Touch", span: "normal" }
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
        
        <div className="grid grid-cols-3 gap-1 max-w-4xl mx-auto auto-rows-min">
          {gridItems.map((item) => {
            const getSpanClass = (span: string) => {
              switch (span) {
                case 'horizontal':
                  return 'col-span-2 aspect-[2/1]';
                case 'vertical':
                  return 'row-span-2 aspect-[1/2]';
                case 'normal':
                default:
                  return 'aspect-square';
              }
            };

            return (
              <div 
                key={item.id} 
                className={`relative overflow-hidden bg-gray-100 cursor-pointer group ${getSpanClass(item.span)}`}
              >
                <PerformanceImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGrid;