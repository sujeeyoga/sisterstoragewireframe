import React from 'react';
import { Card } from '@/components/ui/card';
import PerformanceImage from '@/components/ui/performance-image';

const styledItems = [
  { id: 1, type: "color", color: "bg-primary", title: "Organize" },
  { id: 2, type: "image", image: "/lovable-uploads/0e5fe1c0-12f8-439f-94d5-ec1da8ca09c8.png", title: "Sister Style 1" },
  { id: 3, type: "image", image: "/lovable-uploads/e9628188-8ef0-426b-9858-08b2848fd690.png", title: "Sister Style 2" },
  { id: 4, type: "color", color: "bg-secondary", title: "Style" },
  { id: 5, type: "image", image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png", title: "Sister Style 3" },
  { id: 6, type: "image", image: "/lovable-uploads/8620f7af-c089-458c-bef9-78d6cd77f04e.png", title: "Sister Style 4" },
  { id: 7, type: "color", color: "bg-accent", title: "Inspire" },
  { id: 8, type: "image", image: "/lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png", title: "Sister Style 5" }
];

const StyledBySisters = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container-custom">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-bold mb-4">STYLED BY OUR SISTERS</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how our sister community styles their storage solutions in real spaces.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {styledItems.map((item) => (
            <Card 
              key={item.id} 
              className="relative overflow-hidden cursor-pointer group aspect-square border-0"
            >
              {item.type === "image" ? (
                <>
                  <PerformanceImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              ) : (
                <div className={`w-full h-full ${item.color} flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                  <h3 className="text-primary-foreground font-semibold text-lg md:text-xl text-center">{item.title}</h3>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StyledBySisters;