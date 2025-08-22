import React, { useState, useEffect } from 'react';
import { useVideoPreloader } from '@/hooks/use-video-preloader';

interface ScreenLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

// Videos to preload before showing the app
const videosToPreload = [
  "https://dl.snapcdn.app/get?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJodHRwczovL3Njb250ZW50LmNkbmluc3RhZ3JhbS5jb20vbzEvdi90Mi9mMi9tODYvQVFNNjJ1bjZWYjFNRDQ2RGJYRWJsbU9NVDU1OFpkUFV0My1kNWpEUzVTLVhqUVlPXzNQV1R4dXNWd050d0ROUjhkY0lCRi00TTVNbm9PWTFuVVhtNm5yejo1RFdGY29WQnZTRnAxYy5tcDQ_X25jX2NhdD0xMTEmX25jX3NpZD01ZTk4NTEmX25jX2h0PXNjb250ZW50LWhlbDMtMS5jZG5pbnN0YWdyYW0uY29tJl9uY19vaGM9N2tFQTdMUU02WVVRN2tOdndFVGl5X3kmZWZnPWV5SjJaVzVqYjJSbFgzUmhaeUk2SW5od2RsOXdjbTluY21WemMybDJaUzVKVGxOVVFVZFNRVTB1UTB4SlVGTXVRekl1TnpJd0xtUmhjMmhmWW1GelpXeHBibVZmTVY5Mk1DSXNJbmh3ZGw5aGMzTmxkRjlwWkNJNk1USTJPRFkxTURBek5UQXdNREV3TkN3aWRtbGZkWE5sWTJGelpWOXBaQ0k2TVRBd085aUUsaWRIVnlZWEZwYjI1ZmN5STZNalVzSW5WeWJHeHVaMV96YjNWeVkyVWlPaUozZDNkSWJqRSZjY2I9MTctMSZ2cz0yMDY1MWU4NTE5MDY2YjYwJl9uY192cz1IQmtzRlFJWVVtbG5YM2h3ZGw5eVpXVnNjMTl3WlhKeVlXNWxiblJmYzNKZmNISnZaQzlDUmpReVJVUTVSa1l4T0VGQlJqTTRSVVUwUVVZd05rSTRSVGt3TnpZNU5WOTJhV1JsYjE5a1lYTm9hVzVwZEM1dGNEUlZBQUxJQVJJQUZRSVlPbkJoYzNOMGFISnZkV2RvWDJWMlpYSnpkRzl5WlM5SVRVNTBWbmd0T1hOeWQzQjJhV3RHUTU4ZldVcHJlRWgwVERoNFluRmZSVUZCUVVZVkFnTElBUklBS0FBWUFCc0NpQWQxYzJWZll6RTZWQmlFU2NISnZaM0psYzNOcGRtVmZjbVZqYVhCbEFERVZBQUFtMUV6eHFwUDF3QVFWQWlnQ1EzUXNGMHE1MVQ5ODdaRm9HQkprWVhOb1gySmhjMlZzYVc1bFh6RmZkakVSQUhYX0IyWG1uUUVBJl9uY19naWQ9b3k0aFU5ZXlRbjcwVWowV05RdTVFQSZfbmNfenQ9Mjgmb2g9MDBfQWZWVVNrc1dTTWNrZ2I5RnNULTZfVjg5akZUREVkMTNqRTdLcUx6enIzdTdfQSZvZT02OEE5NTA0NCIsImZpbGVuYW1lIjoiU25hcEluc3RhLnRvX0FRTTYydW42VmIxTUQ0NkRiWEVibG1PTVQ1NThaZFBVdDMtZDVqRFM1Uy1YalFZT18zUFdUeHVzVndOdHdETlI4ZGNJQkYtNE01TW5vT1kxblVYbTZucnpqNURXRmNvVkJ2U0ZwMWMubXA0IiwibmJmIjoxNzU1ODA1MTU1LCJleHAiOjE3NTU4MDg3NTUsImlhdCI6MTc1NTgwNTE1NX0.js9VlqNeFDamrXTf0XfwnVuFqw706DKFgx0R-rZ1_4w"
];

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ 
  onComplete, 
  duration = 3500 // Increased duration to allow for video preloading
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [videosReady, setVideosReady] = useState(false);

  // Preload videos
  const { isAllLoaded: videosLoaded, progress } = useVideoPreloader({
    videos: videosToPreload,
    onAllLoaded: () => setVideosReady(true)
  });

  useEffect(() => {
    // Start logo animation after a brief delay
    const logoTimer = setTimeout(() => {
      setLogoLoaded(true);
    }, 200);

    return () => {
      clearTimeout(logoTimer);
    };
  }, []);

  // Wait for both videos to load and minimum duration
  useEffect(() => {
    if (!videosReady || !logoLoaded) return;

    const minDurationTimer = setTimeout(() => {
      // Start fade out animation
      setIsVisible(false);
      
      // Complete loading process after fade animation
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, Math.max(duration - 500, 1000)); // Ensure minimum 1 second after videos load

    return () => {
      clearTimeout(minDurationTimer);
    };
  }, [videosReady, logoLoaded, duration, onComplete]);

  if (!isVisible) {
    return (
      <div 
        className="fixed inset-0 bg-background z-50 pointer-events-none transition-opacity duration-500 opacity-0" 
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-accent/10" />
      
      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo with animation */}
        <div 
          className={`transform transition-all duration-1000 ease-out ${
            logoLoaded 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-4'
          }`}
        >
          <img 
            src="https://sisterstorage.com/wp-content/uploads/2025/02/Sister-Storage-Logo-Main-300x112.png"
            alt="Sister Storage"
            className="h-12 md:h-16 w-auto drop-shadow-lg"
            loading="eager"
          />
        </div>
        
        {/* Loading indicator with progress */}
        <div 
          className={`flex flex-col items-center space-y-4 transition-all duration-700 delay-500 ${
            logoLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Progress bar */}
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Status text */}
          <div className="text-xs text-muted-foreground font-medium">
            {videosReady ? 'Ready!' : 'Loading content...'}
          </div>
        </div>
        
        {/* Welcome text */}
        <div 
          className={`text-center transition-all duration-700 delay-700 ${
            logoLoaded 
              ? 'opacity-70 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-sm text-muted-foreground font-medium tracking-wide">
            Culture Without Clutter
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenLoader;