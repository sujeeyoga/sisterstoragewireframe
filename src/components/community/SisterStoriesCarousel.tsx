import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

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
  },
  { 
    id: 5, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/sisterlove_morning.mp4", 
    title: "Morning Routine",
    author: "@sisterlove",
    description: "Starting the day organized"
  },
  { 
    id: 6, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/cultural_jewelry.mp4", 
    title: "Cultural Beauty",
    author: "@culturalsisters",
    description: "Celebrating heritage through organization"
  },
  { 
    id: 7, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/weekend_prep.mp4", 
    title: "Weekend Prep",
    author: "@weekendvibes",
    description: "Getting ready for special occasions"
  },
  { 
    id: 8, 
    video: "https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/sisterhood_goals.mp4", 
    title: "Sisterhood Goals",
    author: "@sistergoals",
    description: "Organizing with friends and family"
  }
];

export const SisterStoriesCarousel = () => {
  const [loadingVideos, setLoadingVideos] = useState<Record<number, boolean>>(
    Object.fromEntries(videoStories.map(story => [story.id, true]))
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const ROTATION_INTERVAL = 5000; // 5 seconds
  const PROGRESS_UPDATE_INTERVAL = 50; // Update progress every 50ms for smooth animation

  // Intersection observer to only auto-rotate when visible
  const { ref: carouselRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: false
  });

  const handleVideoLoad = (storyId: number) => {
    setLoadingVideos(prev => ({ ...prev, [storyId]: false }));
  };

  const startAutoRotation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setProgress(0);
    let progressValue = 0;
    
    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      progressValue += (PROGRESS_UPDATE_INTERVAL / ROTATION_INTERVAL) * 100;
      if (progressValue >= 100) {
        progressValue = 100;
      }
      setProgress(progressValue);
    }, PROGRESS_UPDATE_INTERVAL);

    // Auto-rotation
    intervalRef.current = setInterval(() => {
      if (api) {
        api.scrollNext();
        setProgress(0);
      }
    }, ROTATION_INTERVAL);
  }, [api, ROTATION_INTERVAL, PROGRESS_UPDATE_INTERVAL]);

  const stopAutoRotation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  // Handle API changes and current slide tracking
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap());
      // Restart progress when slide changes
      if (isIntersecting && !isHovered) {
        startAutoRotation();
      }
    };

    api.on("select", handleSelect);
    return () => {
      api?.off("select", handleSelect);
    };
  }, [api, isIntersecting, isHovered, startAutoRotation]);

  // Auto-rotation logic
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (isIntersecting && !isHovered && api) {
      startAutoRotation();
    } else {
      stopAutoRotation();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isIntersecting, isHovered, api, startAutoRotation, stopAutoRotation]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div ref={carouselRef} className="w-full">
      {/* Header Container */}
      <div className="container-custom">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Sister Stories</h3>
          <p className="text-muted-foreground">Real sisters sharing their organization journeys</p>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        <div 
          className="container-custom"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {videoStories.map((story) => (
                <CarouselItem key={story.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-500">
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
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="font-semibold text-sm mb-1">{story.title}</h4>
                        <p className="text-xs opacity-90 mb-1">{story.author}</p>
                        <p className="text-xs opacity-75">{story.description}</p>
                      </div>
                      <div className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>

          {/* Progress Indicators Container */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            {videoStories.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className="relative w-8 h-1 bg-muted rounded-full overflow-hidden transition-all duration-300 hover:bg-muted-foreground/30"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div 
                  className={`absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-300 ${
                    index === current ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    width: index === current ? `${progress}%` : '0%',
                    transition: index === current ? 'width 0.05s linear' : 'width 0.3s ease'
                  }}
                />
                {index === current && (
                  <div className="absolute top-0 left-0 w-full h-full bg-primary/30 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Pause indicator when hovered */}
          {isHovered && (
            <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm animate-fade-in">
              ⏸️ Paused
            </div>
          )}
        </div>
      </div>
    </div>
  );
};