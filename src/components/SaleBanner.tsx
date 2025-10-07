import React from 'react';
import { BadgePercent } from 'lucide-react';
interface SaleBannerProps {
  position?: number;
}
const SaleBanner = ({
  position = 0
}: SaleBannerProps) => {
  // Create content items with separators - using exact requirements
  const contentItems = [{
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Summer End Sale - 20% Off"
  }, {
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping on Orders Over $75"
  }, {
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Limited Time Only"
  }];

  // Duplicate content for seamless loop
  const duplicatedContent = [...contentItems, ...contentItems];
  return <div className="relative z-10 w-screen px-0 bg-[hsl(var(--brand-pink))] text-white py-3 overflow-hidden animate-slide-down" data-announcement aria-live="polite" style={{
    '--ss-slide-duration': '12s',
    '--ss-marquee-duration': '20s'
  } as React.CSSProperties}>
      <div className="flex items-center gap-8 animate-marquee-left">
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