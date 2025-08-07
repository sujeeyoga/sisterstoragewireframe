import React from 'react';
import { Card } from '@/components/ui/card';
import PerformanceImage from '@/components/ui/performance-image';

const gridItems = [
  // Row 1 - Start with normal normal
  { id: 1, image: "/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png", title: "Bangle Collection", span: "normal" },
  { id: 2, image: "/lovable-uploads/c44d4b5c-0104-4077-99dd-904d87ec4d8b.png", title: "Jewelry Organization", span: "normal" },
  
  // Row 2
  { id: 3, image: "/lovable-uploads/3e91b1f2-e5b6-4cee-a7b7-806a5815546b.png", title: "Sister Collection", span: "horizontal" },
  
  // Row 3
  { id: 4, image: "/lovable-uploads/56a20345-d9f3-47ac-a645-23d19194af78.png", title: "Instagram Inspiration", span: "vertical" },
  { id: 5, image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png", title: "Social Showcase", span: "normal" },
  { id: 6, image: "/lovable-uploads/e1ae51b5-7916-4137-825e-7f197dff06a3.png", title: "Golden Treasures", span: "normal" },
  
  // Row 4
  { id: 7, image: "/lovable-uploads/8620f7af-c089-458c-bef9-78d6cd77f04e.png", title: "Storage Solutions", span: "normal" },
  { id: 8, image: "/lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png", title: "Bangle Display", span: "normal" },
  
  // Row 5
  { id: 9, image: "/lovable-uploads/160b5d30-ba2c-4e66-8423-c4a6288d1af0.png", title: "Friend Goals", span: "horizontal" },
  
  // Row 6 - End with normal normal
  { id: 10, image: "/lovable-uploads/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png", title: "Jewelry Party", span: "normal" },
  { id: 11, image: "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png", title: "Golden Elegance", span: "normal" }
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
        
        <div className="grid grid-cols-2 gap-0 max-w-3xl mx-auto auto-rows-min">
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