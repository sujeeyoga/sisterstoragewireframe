import React, { useState, useEffect } from 'react';

interface ScreenLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ 
  onComplete, 
  duration = 2500 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    // Start logo animation after a brief delay
    const logoTimer = setTimeout(() => {
      setLogoLoaded(true);
    }, 200);

    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 500);

    // Complete loading process
    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

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
        
        {/* Loading indicator */}
        <div 
          className={`flex items-center space-x-2 transition-all duration-700 delay-500 ${
            logoLoaded 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-2'
          }`}
        >
          {/* Animated dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-primary rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              />
            ))}
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