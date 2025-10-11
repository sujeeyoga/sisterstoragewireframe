import React from 'react';
import { BadgePercent } from 'lucide-react';
interface SaleBannerProps {}
const SaleBanner = ({}: SaleBannerProps) => {
  // Create content items with separators - using exact requirements
  const contentItems = [{
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping Over $50 in Toronto"
  }, {
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping Over $50 in Toronto"
  }, {
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping Over $50 in Toronto"
  }];

  // Duplicate content multiple times for seamless infinite loop
  const duplicatedContent = [
    ...contentItems, 
    ...contentItems, 
    ...contentItems, 
    ...contentItems
  ];
  return <div className="relative z-10 w-screen px-0 bg-black text-white py-3 overflow-hidden animate-slide-down" data-announcement aria-live="polite" style={{
    '--ss-slide-duration': '12s',
    '--ss-marquee-duration': '40s'
  } as React.CSSProperties}>
      <div className="flex items-center gap-8" data-track>
        {duplicatedContent.map((item, index) => (
          <div key={index} className="flex items-center whitespace-nowrap text-xs font-medium tracking-wide uppercase">
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>;
};
export default SaleBanner;