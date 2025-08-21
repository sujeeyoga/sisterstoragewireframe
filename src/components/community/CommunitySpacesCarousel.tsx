import React from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import PerformanceImage from '@/components/ui/performance-image';

const spaceImages = [
  { 
    id: 1, 
    image: "/lovable-uploads/f9cf4a8d-2f00-4b1f-bbb3-4322491012ad.png", 
    title: "Elegant Display",
    description: "Beautifully organized jewelry collection"
  },
  { 
    id: 2, 
    image: "/lovable-uploads/ce6528ec-56be-4176-919f-4285946c18b2.png", 
    title: "Daily Ritual",
    description: "Morning organization setup"
  },
  { 
    id: 3, 
    image: "/lovable-uploads/c6544fac-3f2f-4a6a-a01e-5ca149720fcb.png", 
    title: "Perfect Setup",
    description: "Functional and beautiful storage"
  },
  { 
    id: 4, 
    image: "/lovable-uploads/b0963b41-dee1-4ccb-b8bc-7144c4ea6285.png", 
    title: "Cultural Pride",
    description: "Traditional pieces organized with love"
  },
  { 
    id: 5, 
    image: "/lovable-uploads/3e91b1f2-e5b6-4cee-a7b7-806a5815546b.png", 
    title: "Inspiration",
    description: "Inspiring organization ideas"
  }
];

export const CommunitySpacesCarousel = () => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Community Spaces</h3>
        <p className="text-muted-foreground">Beautiful organization setups from our sister community</p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {spaceImages.map((space) => (
            <CarouselItem key={space.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-500">
                <div className="relative aspect-square overflow-hidden">
                  <PerformanceImage
                    src={space.image}
                    alt={space.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-semibold text-base mb-1">{space.title}</h4>
                    <p className="text-sm opacity-90">{space.description}</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    ✨
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};