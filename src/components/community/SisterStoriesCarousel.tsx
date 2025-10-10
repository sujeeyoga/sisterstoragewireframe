import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';

interface VideoStory {
  id: string;
  video: string;
  title: string;
  author: string;
  description: string | null;
}

export const SisterStoriesCarousel = () => {
  const [videoStories, setVideoStories] = useState<VideoStory[]>([]);
  const [loadingVideos, setLoadingVideos] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [unmutedVideo, setUnmutedVideo] = useState<string | null>(null);

  console.log('SisterStoriesCarousel: Rendering with', videoStories.length, 'videos, loading:', isLoading);

  // Fetch videos from database
  const fetchVideos = useCallback(async () => {
    try {
      console.log('SisterStoriesCarousel: Starting video fetch...');
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('sister_stories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching videos:', error);
        console.log('SisterStoriesCarousel: Using fallback - no videos available');
        setVideoStories([]);
        return;
      }

      const stories: VideoStory[] = (data || []).map((story) => ({
        id: story.id,
        video: story.video_url,
        title: story.title,
        author: story.author,
        description: story.description || 'Organization journey shared with love'
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
      setVideoStories([]);
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

  const handleVideoClick = (storyId: string) => {
    setUnmutedVideo(prev => prev === storyId ? null : storyId);
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
    <div className="w-full overflow-hidden">
      {/* Carousel Container */}
      <div className="w-full max-w-[100vw]">
        <Carousel
          opts={{
            align: "start",
            loop: false,
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="ml-4 md:ml-8">
            {videoStories.map((story) => (
              <CarouselItem key={story.id} className="pl-4 basis-[280px] md:basis-[320px]">
                <Card 
                  className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm group cursor-pointer hover:bg-card/80 transition-all duration-300 h-full"
                  onClick={() => handleVideoClick(story.id)}
                >
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
                      muted={unmutedVideo !== story.id}
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
                      {unmutedVideo === story.id ? (
                        <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};