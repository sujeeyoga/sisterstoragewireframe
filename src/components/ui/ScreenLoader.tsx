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
  duration = 5000 // 5 second load time
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

  // Handle timing for 5-second load
  useEffect(() => {
    if (!logoLoaded) return;

    // Start fade out animation after duration
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 500);

    // Complete loading process
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [logoLoaded, duration, onComplete]);

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
            className="h-16 md:h-20 lg:h-24 w-auto drop-shadow-xl"
            loading="eager"
          />
        </div>
        
        {/* Loading indicator */}
        <div 
          className={`flex flex-col items-center space-y-4 transition-all duration-700 delay-700 ${
            logoLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Animated dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
          
          {/* Loading text */}
          <div className="text-sm text-muted-foreground font-medium tracking-wide">
            Loading...
          </div>
        </div>
        
        {/* Welcome text */}
        <div 
          className={`text-center transition-all duration-700 delay-1000 ${
            logoLoaded 
              ? 'opacity-70 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          <p className="text-lg text-muted-foreground font-medium tracking-wide">
            Culture Without Clutter
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScreenLoader;