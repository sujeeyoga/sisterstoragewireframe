import React from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const testimonialItems = [
  { 
    id: 1, 
    type: "quote",
    text: "These organizers changed my life! Now everything has a home.",
    author: "Priya S.",
    location: "Jewelry Collector"
  },
  { 
    id: 2, 
    type: "stat",
    number: "10k+",
    label: "Happy Sisters",
    subtext: "Organizing with love"
  },
  { 
    id: 3, 
    type: "quote",
    text: "Perfect blend of beauty and practicality.",
    author: "Anjali R.",
    location: "Interior Designer"
  },
  { 
    id: 4, 
    type: "quote",
    text: "Feels like it was made just for us.",
    author: "Meena K.",
    location: "Minimalist Enthusiast"
  },
  { 
    id: 5, 
    type: "stat",
    number: "50+",
    label: "Countries",
    subtext: "Sisters worldwide"
  },
  { 
    id: 6, 
    type: "quote",
    text: "Finally found storage solutions that celebrate our culture with elegance.",
    author: "Reema T.",
    location: "Art Collector"
  },
  { 
    id: 7, 
    type: "quote",
    text: "Finally, storage that honors my culture and keeps my bangles perfect!",
    author: "Priya K.",
    location: "Toronto"
  },
  { 
    id: 8, 
    type: "quote",
    text: "I love how Sister Storage celebrates my heritage while keeping everything beautifully organized.",
    author: "Meera S.",
    location: "London"
  },
  { 
    id: 9, 
    type: "stat",
    number: "25k+",
    label: "Products Sold",
    subtext: "Organizing dreams fulfilled"
  },
  { 
    id: 10, 
    type: "quote",
    text: "The attention to detail in every piece shows they understand our needs as South Asian women.",
    author: "Anjali P.",
    location: "Mumbai"
  }
];

export const SisterLoveCarousel = () => {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Sister Love</h3>
        <p className="text-muted-foreground">What our community is saying about organizing with culture</p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {testimonialItems.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <Card className="border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-500 h-full">
                {item.type === "quote" ? (
                  <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-primary/20 to-primary/5 flex flex-col justify-center p-6 text-center relative overflow-hidden">
                    <div className="absolute top-3 left-3 text-primary/20 text-4xl font-serif">"</div>
                    <blockquote className="text-base font-medium text-foreground/90 mb-4 leading-relaxed relative z-10">
                      {item.text}
                    </blockquote>
                    <cite className="text-sm text-muted-foreground">
                      <span className="font-semibold">{item.author}</span>
                      <br />
                      <span>{item.location}</span>
                    </cite>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-accent/20 to-accent/5 flex flex-col justify-center items-center p-6 text-center">
                    <div className="text-4xl font-black text-primary mb-3">{item.number}</div>
                    <div className="text-base font-semibold text-foreground mb-2">{item.label}</div>
                    <div className="text-sm text-muted-foreground">{item.subtext}</div>
                  </div>
                )}
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