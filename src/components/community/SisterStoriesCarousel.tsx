import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

const videoStories = [
  { 
    id: 1, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/rishegaselva_.mp4", 
    title: "Sister Stories",
    author: "@rishegaselva_",
    description: "Daily organization rituals"
  },
  { 
    id: 2, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/nxtsisterduo_.mp4", 
    title: "Community Love",
    author: "@nxtsisterduo_",
    description: "Sister duo organizing together"
  },
  { 
    id: 3, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/rishegaselva.mp4", 
    title: "Daily Ritual",
    author: "@rishegaselva",
    description: "Morning jewelry organization"
  },
  { 
    id: 4, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/bingewithanbu_.mp4", 
    title: "Style Goals",
    author: "@bingewithanbu_",
    description: "Perfect accessory storage"
  }
];

export const SisterStoriesCarousel = () => {
  const [loadingVideos, setLoadingVideos] = useState<Record<number, boolean>>(
    Object.fromEntries(videoStories.map(story => [story.id, true]))
  );

  const handleVideoLoad = (storyId: number) => {
    setLoadingVideos(prev => ({ ...prev, [storyId]: false }));
  };

  return (
    <div className="w-full">
      {/* Header Container */}
      <div className="container-custom">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Sister Stories</h3>
          <p className="text-muted-foreground">Real sisters sharing their organization journeys</p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        <div className="container-custom">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {videoStories.map((story) => (
                <CarouselItem key={story.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-300">
                    <div className="relative aspect-[9/16] overflow-hidden">
                      {loadingVideos[story.id] && (
                        <div className="absolute inset-0 z-10">
                          <Skeleton className="w-full h-full" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="animate-pulse text-primary">Loading...</div>
                          </div>
                        </div>
                      )}
                      <video
                        src={story.video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadedData={() => handleVideoLoad(story.id)}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-semibold text-sm mb-1">{story.title}</h4>
                        <p className="text-xs opacity-90 mb-1">{story.author}</p>
                        <p className="text-xs opacity-75">{story.description}</p>
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
      </div>
    </div>
  );
};