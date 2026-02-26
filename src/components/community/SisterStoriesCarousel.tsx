import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';
import { Play, RotateCcw, Loader2 } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { StoriesCarouselSkeleton } from '@/components/skeletons/StoriesCarouselSkeleton';

interface VideoStory {
  id: string;
  video: string;
  title: string;
  author: string;
  description: string | null;
}

type PlaybackState = 'idle' | 'loading' | 'playing' | 'blocked' | 'error';

/** Normalize video URLs: relative paths resolved against origin, absolute kept as-is */
const normalizeVideoUrl = (url: string): string => {
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `${window.location.origin}${url}`;
  return url;
};

const VideoCard = ({ story, isFirst }: { story: VideoStory; isFirst: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [unmuted, setUnmuted] = useState(false);
  const normalizedUrl = normalizeVideoUrl(story.video);

  // Intersection observer: attempt autoplay when visible, pause when not
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (entry.isIntersecting) {
          // Only attempt play if idle or blocked (retry on re-enter)
          if (playbackState === 'idle' || playbackState === 'blocked') {
            setPlaybackState('loading');
            const playPromise = video.play();
            if (playPromise) {
              playPromise
                .then(() => setPlaybackState('playing'))
                .catch(() => setPlaybackState('blocked'));
            }
          }
        } else {
          // Just pause, don't reset currentTime to reduce thrash
          if (playbackState === 'playing') {
            video.pause();
            setPlaybackState('idle');
          }
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [playbackState]);

  const handleTapToPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setPlaybackState('loading');
    video.play()
      .then(() => setPlaybackState('playing'))
      .catch(() => setPlaybackState('error'));
  }, []);

  const handleRetry = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.load();
    setPlaybackState('loading');
    video.play()
      .then(() => setPlaybackState('playing'))
      .catch(() => setPlaybackState('error'));
  }, []);

  return (
    <Card className="overflow-hidden border-0 bg-transparent h-full w-full">
      <div
        ref={containerRef}
        className="relative w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] lg:max-w-[540px] overflow-hidden bg-[hsl(var(--brand-pink))] rounded-2xl shadow-xl"
        style={{ aspectRatio: '9 / 16' }}
      >
        <video
          ref={videoRef}
          src={normalizedUrl}
          crossOrigin="anonymous"
          muted={!unmuted}
          loop
          playsInline
          preload="metadata"
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          style={{ backgroundColor: 'hsl(var(--brand-pink))' }}
          onPlay={() => setPlaybackState('playing')}
          onPause={() => {
            if (playbackState === 'playing') setPlaybackState('idle');
          }}
          onError={() => setPlaybackState('error')}
          className="w-full h-full object-cover"
        />

        {/* Loading spinner */}
        {playbackState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/20">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        )}

        {/* Tap to Play overlay (autoplay blocked or idle) */}
        {(playbackState === 'blocked' || playbackState === 'idle') && (
          <div
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer bg-black/30"
            onClick={handleTapToPlay}
          >
            <div className="bg-white/90 rounded-full p-4 shadow-lg">
              <Play className="w-8 h-8 text-[hsl(var(--brand-pink))] fill-current" />
            </div>
          </div>
        )}

        {/* Error overlay with retry */}
        {playbackState === 'error' && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-10 cursor-pointer bg-black/40 gap-2"
            onClick={handleRetry}
          >
            <RotateCcw className="w-8 h-8 text-white" />
            <span className="text-white text-xs font-semibold">Tap to retry</span>
          </div>
        )}

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none bg-gradient-to-t from-black/50 to-transparent">
          <h4 className="font-semibold text-sm mb-1">{story.title}</h4>
          <p className="text-xs opacity-90 mb-1">{story.author}</p>
          <p className="text-xs opacity-75">{story.description}</p>
        </div>

        {/* Mute/Unmute button */}
        {playbackState === 'playing' && (
          <div
            className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-2 rounded-full backdrop-blur-sm cursor-pointer z-20 hover:bg-black/70 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setUnmuted(prev => !prev);
            }}
          >
            {unmuted ? (
              <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export const SisterStoriesCarousel = () => {
  const [videoStories, setVideoStories] = useState<VideoStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('sister_stories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sister stories:', error);
        setVideoStories([]);
        return;
      }

      setVideoStories(
        (data || []).map((story) => ({
          id: story.id,
          video: story.video_url,
          title: story.title,
          author: story.author,
          description: story.description || 'Organization journey shared with love',
        }))
      );
    } catch (error) {
      console.error('Error fetching sister stories:', error);
      setVideoStories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  if (isLoading) return <StoriesCarouselSkeleton />;
  if (videoStories.length === 0) return null;

  return (
    <div className="w-full overflow-hidden relative flex justify-center items-center px-4 md:px-0">
      <div className="absolute left-0 top-0 bottom-0 w-[5%] bg-gradient-to-r from-[hsl(var(--brand-gray))] to-transparent z-10 pointer-events-none hidden md:block" />
      <div className="absolute right-0 top-0 bottom-0 w-[5%] bg-gradient-to-l from-[hsl(var(--brand-gray))] to-transparent z-10 pointer-events-none hidden md:block" />

      <div className="w-full max-w-[100vw] min-h-[60vh]">
        <Carousel
          plugins={[Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]}
          opts={{ align: 'start', loop: true, skipSnaps: false, dragFree: false }}
          className="w-full"
        >
          <CarouselContent className="-ml-5">
            {videoStories.map((story, idx) => (
              <CarouselItem key={story.id} className="pl-5 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex-shrink-0">
                <VideoCard story={story} isFirst={idx === 0} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};
