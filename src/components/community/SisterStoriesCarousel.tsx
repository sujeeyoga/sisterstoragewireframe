import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface VideoStory {
  id: string;
  video: string;
  title: string;
  author: string;
  description: string;
}

export const SisterStoriesCarousel = () => {
  const [videoStories, setVideoStories] = useState<VideoStory[]>([]);
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const ROTATION_INTERVAL = 4000; // 4 seconds
  const PROGRESS_UPDATE_INTERVAL = 50;

  console.log('SisterStoriesCarousel: Rendering with', videoStories.length, 'videos, loading:', isLoading);

  // Intersection observer to only auto-rotate when visible
  const { ref: carouselRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: false
  });

  // Fetch videos from Supabase storage
  const fetchVideos = useCallback(async () => {
    try {
      console.log('SisterStoriesCarousel: Starting video fetch...');
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('sister')
        .list('', { limit: 100 });

      if (error) {
        console.error('Error fetching videos:', error);
        console.log('SisterStoriesCarousel: Using fallback - no videos available');
        setVideoStories([]); // Explicitly set empty array
        return;
      }

      const videoFiles = data?.filter(file => 
        file.name.endsWith('.mp4') || 
        file.name.endsWith('.webm') || 
        file.name.endsWith('.mov')
      ) || [];

      const stories: VideoStory[] = videoFiles.map((file, index) => ({
        id: file.name,
        video: `https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/sister/${file.name}`,
        title: `Sister Story ${index + 1}`,
        author: `@${file.name.split('.')[0].replace(/_/g, '')}`,
        description: 'Organization journey shared with love'
      }));

      setVideoStories(stories);
      
      // Initialize loading state for all videos
      const loadingState = Object.fromEntries(
        stories.map(story => [story.id, true])
      );
      setLoadingVideos(loadingState);
      
    } catch (error) {
      console.error('Error fetching videos:', error);
      console.log('SisterStoriesCarousel: Catch block - setting empty stories');
      setVideoStories([]); // Ensure empty state
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleVideoLoad = (storyId: string) => {
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

    if (isIntersecting && !isHovered && api && videoStories.length > 0) {
      startAutoRotation();
    } else {
      stopAutoRotation();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isIntersecting, isHovered, api, videoStories.length, startAutoRotation, stopAutoRotation]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="container-custom">
          <div className="mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Sister Stories</h3>
            <p className="text-muted-foreground">Loading sister stories...</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="aspect-[9/16] w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (videoStories.length === 0) {
    console.log('SisterStoriesCarousel: No videos available, hiding component');
    return null; // Hide component instead of showing error
  }

  return (
    <div ref={carouselRef} className="w-full">
      {/* Header Container */}
      <div className="container-custom">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Sister Stories</h3>
          <p className="text-muted-foreground">Real sisters sharing their organization journeys ({videoStories.length} stories)</p>
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

          {/* Progress Indicators */}
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