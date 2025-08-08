
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
      className="w-full overflow-x-auto whitespace-nowrap bg-white border-b px-4 py-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="flex items-center gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex items-center">
            <BadgePercent className="h-5 w-5 text-black mr-2 shrink-0" />
            <span className="font-semibold text-black uppercase">Spring Summer Sale - 20% Off Storewide</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleBanner;
