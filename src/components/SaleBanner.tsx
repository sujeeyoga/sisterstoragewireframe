
import React, { useEffect, useState } from 'react';
import { BadgePercent } from 'lucide-react';
import AnimatedText from './ui/animated-text';

const SaleBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay before showing the banner
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800); // Increased delay
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`w-full bg-white overflow-hidden py-3 relative z-10 sticky top-16 transition-opacity duration-700 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex whitespace-nowrap animate-marquee" style={{ animationDuration: '20s' }}>
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
              duration={1.8} // Slower animation
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
