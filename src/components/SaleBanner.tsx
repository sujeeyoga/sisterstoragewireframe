
import React, { useEffect, useState } from 'react';
import { BadgePercent } from 'lucide-react';
import AnimatedText from './ui/animated-text';

interface SaleBannerProps {
  position?: number;
}

const SaleBanner = ({ position = 0 }: SaleBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Calculate scroll-based styling
  const scrollProgress = Math.min(1, position / 150);
  const bannerHeight = Math.max(30, 48 - (scrollProgress * 18)); // Shrink from 48px to 30px
  const bannerOpacity = Math.max(0.85, 1 - (scrollProgress * 0.15));

  useEffect(() => {
    // Add a small delay before showing the banner
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800); // Increased delay
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="w-full bg-white overflow-hidden relative z-10"
      style={{
        opacity: isVisible ? bannerOpacity : 0,
        height: `${bannerHeight}px`,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s ease',
        transform: `scale(${1 - (scrollProgress * 0.05)})`,
      }}
    >
      <div 
        className="flex whitespace-nowrap animate-marquee h-full items-center"
        style={{ 
          animationDuration: '30s',
          willChange: 'transform'
        }}
      >
        {/* Repeat the content multiple times to create a seamless scroll effect */}
        {[...Array(10)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center mx-4"
          >
            <BadgePercent className="h-5 w-5 text-black mr-2" />
            <AnimatedText
              animation="breath-fade-up-2"
              className="font-semibold text-black uppercase"
              duration={2.2} // Slower animation
            >
              Spring Summer Sale - 20% Off Storewide
            </AnimatedText>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleBanner;
