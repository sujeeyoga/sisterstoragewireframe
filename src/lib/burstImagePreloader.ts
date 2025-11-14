/**
 * Burst Image Preloader
 * Loads multiple images and videos in parallel for instant display
 */

interface PreloadOptions {
  images: string[];
  priority?: 'high' | 'low';
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
}

export const burstPreloadImages = async ({
  images,
  priority = 'low',
  onProgress,
  onComplete
}: PreloadOptions) => {
  let loadedCount = 0;
  const total = images.length;

  const promises = images.map((src) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      
      if (priority === 'high') {
        img.fetchPriority = 'high';
      }
      
      img.onload = () => {
        loadedCount++;
        onProgress?.(loadedCount, total);
        resolve();
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload image: ${src}`);
        loadedCount++;
        onProgress?.(loadedCount, total);
        resolve();
      };
      
      img.src = src;
    });
  });

  await Promise.all(promises);
  onComplete?.();
  
  console.log(`✅ Burst loaded ${total} images in parallel`);
};

export const burstPreloadVideos = async (videoUrls: string[]) => {
  const promises = videoUrls.map((src) => {
    return new Promise<void>((resolve) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.muted = true;
      
      video.addEventListener('canplaythrough', () => {
        console.log(`✅ Video ready: ${src.substring(0, 50)}...`);
        resolve();
      });
      
      video.addEventListener('error', () => {
        console.warn(`⚠️ Video preload failed: ${src.substring(0, 50)}...`);
        resolve();
      });
      
      video.src = src;
      video.load();
    });
  });

  await Promise.all(promises);
  console.log(`✅ Burst loaded ${videoUrls.length} videos in parallel`);
};
