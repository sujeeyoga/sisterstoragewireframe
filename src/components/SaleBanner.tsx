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
      text: "Spring Summer Sale - 20% Off Storewide"
    },
    {
      icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
      text: "Free Shipping on Orders Over $75"
    },
    {
      icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
      text: "New Collection Now Available"
    }
  ];

  // Duplicate content for seamless loop
  const duplicatedContent = [...contentItems, ...contentItems];

  return (
    <div 
      data-announcement
      className="w-full overflow-hidden bg-transparent"
      aria-live="polite"
      style={{
        '--ss-slide-duration': '12s',
        '--ss-marquee-duration': '20s'
      } as React.CSSProperties}
    >
      <div 
        data-track
        className="inline-flex items-center px-4 py-2 whitespace-nowrap will-change-transform"
        style={{ 
          width: '200%',
          gap: '1.5rem'
        }}
      >
        {duplicatedContent.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center" data-item>
              {item.icon}
              <span 
                className="font-bold text-brand-pink uppercase font-poppins"
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
              <span className="text-brand-pink opacity-50" data-sep>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SaleBanner;