import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

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
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  console.log('SisterStoriesCarousel: Rendering with', videoStories.length, 'videos, loading:', isLoading);

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
        (file.name.endsWith('.mp4') || 
        file.name.endsWith('.webm') || 
        file.name.endsWith('.mov')) &&
        file.name !== 'Video-345.mp4'
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
    <div className="w-full py-8 md:py-12">
      {/* Header */}
      <div className="container-custom mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Sister Stories</h3>
        <p className="text-muted-foreground">Real sisters sharing their organization journeys ({videoStories.length} stories)</p>
      </div>

      {/* Horizontal Scrolling Container */}
      <div className="relative w-full overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto overscroll-x-contain touch-pan-y snap-x snap-mandatory scrollbar-hide pb-4 px-4 md:px-6 lg:px-8 scroll-smooth"
        >
          {videoStories.map((story) => (
            <div 
              key={story.id} 
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            >
              <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-300 h-full">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-300" />
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
            </div>
          ))}
        </div>
        
        {/* Scroll fade indicators */}
        <div className="absolute top-0 left-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
};