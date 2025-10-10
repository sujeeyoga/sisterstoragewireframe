import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import { Play } from 'lucide-react';

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
  const [visibleVideos, setVisibleVideos] = useState<Set<string>>(new Set());
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

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

      console.log('SisterStoriesCarousel: Fetched video URLs:', stories.map(s => ({ 
        id: s.id.substring(0, 8), 
        url: s.video,
        title: s.title 
      })));

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

  // Set up Intersection Observer for lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const videoId = entry.target.getAttribute('data-video-id');
        if (!videoId) return;

        if (entry.isIntersecting) {
          setVisibleVideos(prev => new Set([...prev, videoId]));
          setLoadingVideos(prev => ({ ...prev, [videoId]: false }));
          const video = videoRefs.current[videoId];
          if (video && video.paused) {
            video.play().catch(() => {
              // Ignore autoplay errors on mobile/incognito
            });
          }
        }
      });
    }, options);

    // Observe all video containers
    const containers = document.querySelectorAll('[data-video-id]');
    containers.forEach(container => observer.observe(container));

    return () => observer.disconnect();
  }, [videoStories]);

  const handleVideoLoad = (storyId: string) => {
    console.log(`Video ${storyId} loaded successfully`);
    setLoadingVideos(prev => ({ ...prev, [storyId]: false }));
  };

  const handleVideoClick = async (storyId: string, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const video = videoRefs.current[storyId];
    if (!video) return;

    // If video isn't playing yet, start it
    if (!playingVideos.has(storyId)) {
      try {
        // Reset video to start if it was paused
        video.currentTime = 0;
        
        // Important for iOS - must be muted for programmatic play
        video.muted = true;
        
        // Attempt to play
        const playPromise = video.play();
        if (playPromise !== undefined) {
          await playPromise;
          setPlayingVideos(prev => new Set([...prev, storyId]));
          console.log(`Video ${storyId} playing successfully`);
        }
      } catch (error) {
        console.error('Failed to play video:', error);
        // Try one more time after a brief delay (iOS quirk)
        setTimeout(async () => {
          try {
            await video.play();
            setPlayingVideos(prev => new Set([...prev, storyId]));
          } catch (retryError) {
            console.error('Retry failed:', retryError);
          }
        }, 100);
      }
    } else {
      // Toggle mute
      setUnmutedVideo(prev => prev === storyId ? null : storyId);
    }
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
    <div className="w-full overflow-hidden relative flex justify-center items-center">
      {/* Left fade gradient - 5% */}
      <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-gradient-to-r from-[hsl(var(--brand-gray))] to-transparent z-10 pointer-events-none" />
      
      {/* Right fade gradient - 5% */}
      <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-gradient-to-l from-[hsl(var(--brand-gray))] to-transparent z-10 pointer-events-none" />
      
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
          <CarouselContent className="flex justify-center items-center">
            {videoStories.map((story) => (
              <CarouselItem key={story.id} className="px-8 basis-auto flex-shrink-0 flex justify-center items-center">
                <Card 
                  className="overflow-hidden border-0 bg-transparent group cursor-pointer transition-transform duration-300 hover:scale-105 h-full"
                >
                  <div 
                    className="relative w-[263px] h-[540px] overflow-hidden bg-black cursor-pointer rounded-2xl shadow-xl"
                    data-video-id={story.id}
                    onClick={(e) => {
                      if (playingVideos.has(story.id)) {
                        setUnmutedVideo(prev => prev === story.id ? null : story.id);
                      }
                    }}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[story.id] = el;
                      }}
                      src={story.video}
                      crossOrigin="anonymous"
                      muted={unmutedVideo !== story.id}
                      loop
                      playsInline
                      webkit-playsinline="true"
                      x5-playsinline="true"
                      preload="metadata"
                      controlsList="nodownload nofullscreen noremoteplayback"
                      disablePictureInPicture
                      onLoadedData={() => handleVideoLoad(story.id)}
                      onLoadedMetadata={() => handleVideoLoad(story.id)}
                      onPlay={() => setPlayingVideos(prev => new Set([...prev, story.id]))}
                      onPause={() => setPlayingVideos(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(story.id);
                        return newSet;
                      })}
                      onError={(e) => {
                        console.error(`Video ${story.id} failed to load:`, {
                          error: e.currentTarget.error,
                          src: story.video,
                          readyState: e.currentTarget.readyState
                        });
                        setLoadingVideos(prev => ({ ...prev, [story.id]: false }));
                      }}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                      style={{ backgroundColor: '#000' }}
                    >
                      <source src={story.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    {/* Tap to unmute indicator */}
                    {playingVideos.has(story.id) && unmutedVideo !== story.id && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                      >
                        <div className="bg-black/50 text-white text-2xl px-6 py-3 rounded-full backdrop-blur-sm font-semibold">
                          Tap to unmute
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/0 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-20 group-hover:translate-y-0 transition-all duration-300 ease-out">
                      <h4 className="font-semibold text-sm mb-1">{story.title}</h4>
                      <p className="text-xs opacity-90 mb-1">{story.author}</p>
                      <p className="text-xs opacity-75">{story.description}</p>
                    </div>
                    {/* Mute/Unmute button */}
                    {playingVideos.has(story.id) && (
                      <div 
                        className="absolute top-3 right-3 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm cursor-pointer z-20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUnmutedVideo(prev => prev === story.id ? null : story.id);
                        }}
                      >
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
                    )}
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