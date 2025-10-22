import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import logoImage from '@/assets/sister-storage-logo-new.jpg';

interface ScreenLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

// Key images to preload
const staticImagesToPreload = [
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Starter-Set-2x-Large-1x-Medium-Box-1x-Small-Box/1759980850863-5xgr2a.jpg',
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/Sister%20Storage%20Assets/Together%20Bundle-%203%20Large%202%20Medium%201%20Travel/1759979157485-d2rva.jpg',
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/The-Complete-Family-Set-4-Large-2-Medium-2-Travel/1759980920453-ezsfq.jpg',
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/a501115d-f6f4-4f74-bdbe-1b73ba1bc625.png',
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/fb8da55a-c9bb-419e-a96f-175a667875e1.png',
  'https://attczdhexkpxpyqyasgz.supabase.co/storage/v1/object/public/images/hero-images/4ef08ea3-3380-4111-b4a1-eb939cba275b.png'
];

const ScreenLoader: React.FC<ScreenLoaderProps> = ({ 
  onComplete, 
  duration = 800 // Much faster - 800ms instead of 3000ms
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Skip preloading - let images load naturally with lazy loading
  // This makes the initial page load much faster

  useEffect(() => {
    // Start logo animation immediately
    const logoTimer = setTimeout(() => {
      setLogoLoaded(true);
    }, 200);

    return () => {
      clearTimeout(logoTimer);
    };
  }, []);

  // Handle fast timing
  useEffect(() => {
    if (!logoLoaded) return;

    // Start fade out animation
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration - 300);

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
            src={logoImage}
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
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
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