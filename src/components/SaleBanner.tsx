import React from 'react';
import { BadgePercent } from 'lucide-react';

interface SaleBannerProps {
  position?: number;
}

const SaleBanner = ({ position = 0 }: SaleBannerProps) => {
  // Create content items with separators
  const contentItems = [
    {
      icon: <BadgePercent className="h-5 w-5 text-foreground mr-2 shrink-0" />,
      text: "Spring Summer Sale - 20% Off Storewide"
    },
    {
      icon: <BadgePercent className="h-5 w-5 text-foreground mr-2 shrink-0" />,
      text: "Free Shipping on Orders Over $75"
    },
    {
      icon: <BadgePercent className="h-5 w-5 text-foreground mr-2 shrink-0" />,
      text: "New Collection Now Available"
    }
  ];

  // Duplicate content for seamless loop
  const duplicatedContent = [...contentItems, ...contentItems];

  return (
    <div 
      data-announcement
      className="w-full overflow-hidden bg-white border-b"
      aria-live="polite"
      style={{
        '--ss-slide-duration': '12s',
        '--ss-marquee-duration': '20s'
      } as React.CSSProperties}
    >
      <div 
        data-track
        className="inline-flex items-center gap-6 px-4 py-2 whitespace-nowrap will-change-transform"
        style={{ width: '200%' }}
      >
        {duplicatedContent.map((item, index) => (
          <React.Fragment key={index}>
            <div className="flex items-center" data-item>
              {item.icon}
              <span className="font-semibold text-foreground uppercase text-sm">
                {item.text}
              </span>
            </div>
            {index < duplicatedContent.length - 1 && (
              <span className="text-foreground opacity-50" data-sep>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SaleBanner;