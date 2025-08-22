import React from 'react';
import { BadgePercent } from 'lucide-react';

interface SaleBannerProps {
  position?: number;
}

const SaleBanner = ({ position = 0 }: SaleBannerProps) => {
  // Create content items with separators - using exact requirements
  const contentItems = [
    {
      icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
      text: "Summer End Sale - 20% Off"
    },
    {
      icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
      text: "Free Shipping on Orders Over $75"
    },
    {
      icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
      text: "Limited Time Only"
    }
  ];

  // Duplicate content for seamless loop
  const duplicatedContent = [...contentItems, ...contentItems];

  return (
    <div 
      className="relative z-10 w-screen px-0 bg-[hsl(var(--brand-pink))] text-white py-3 overflow-hidden animate-slide-down"
      data-announcement
      aria-live="polite"
      style={{
        '--ss-slide-duration': '12s',
        '--ss-marquee-duration': '20s'
      } as React.CSSProperties}
    >
      <div 
        data-track
        className="inline-flex items-center py-2 whitespace-nowrap will-change-transform hover:[animation-play-state:paused]"
        style={{ 
          width: '200%',
          gap: '1.5rem',
          paddingLeft: '0',
          paddingRight: '0'
        }}
      >
        {duplicatedContent.map((item, index) => (
          <span key={index} className="inline-flex items-center" data-group>
            <div className="flex items-center" data-item>
              <BadgePercent className="h-3 w-3 text-white mr-1 shrink-0" />
              <span 
                className="font-bold text-white uppercase font-poppins"
                style={{ 
                  fontSize: '9px', 
                  lineHeight: '13.8px',
                  fontFamily: 'Poppins'
                }}
              >
                {item.text}
              </span>
            </div>
            {index < duplicatedContent.length - 1 && (
              <span className="text-white opacity-50" data-sep>•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SaleBanner;