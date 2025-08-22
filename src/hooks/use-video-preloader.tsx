import { useState, useEffect } from 'react';

interface VideoPreloaderOptions {
  videos: string[];
  onAllLoaded?: () => void;
}

export const useVideoPreloader = ({ videos, onAllLoaded }: VideoPreloaderOptions) => {
  const [loadedVideos, setLoadedVideos] = useState<Set<string>>(new Set());
  const [isAllLoaded, setIsAllLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videos.length === 0) {
      setIsAllLoaded(true);
      onAllLoaded?.();
      return;
    }

    const preloadVideo = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;

        const onLoadedData = () => {
          setLoadedVideos(prev => {
            const newSet = new Set(prev);
            newSet.add(src);
            return newSet;
          });
          cleanup();
          resolve();
        };

        const onError = () => {
          console.warn(`Failed to preload video: ${src}`);
          cleanup();
          resolve(); // Still resolve to continue with other videos
        };

        const cleanup = () => {
          video.removeEventListener('loadeddata', onLoadedData);
          video.removeEventListener('error', onError);
        };

        video.addEventListener('loadeddata', onLoadedData);
        video.addEventListener('error', onError);
        video.src = src;
      });
    };

    const preloadAllVideos = async () => {
      const promises = videos.map(video => preloadVideo(video));
      await Promise.allSettled(promises);
      setIsAllLoaded(true);
      onAllLoaded?.();
    };

    preloadAllVideos();
  }, [videos, onAllLoaded]);

  useEffect(() => {
    if (videos.length > 0) {
      setProgress((loadedVideos.size / videos.length) * 100);
    }
  }, [loadedVideos.size, videos.length]);

  return {
    isAllLoaded,
    loadedVideos,
    progress,
    loadedCount: loadedVideos.size,
    totalCount: videos.length
  };
};

export default useVideoPreloader;