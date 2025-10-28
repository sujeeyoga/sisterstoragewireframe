import React from 'react';
import { BadgePercent } from 'lucide-react';
import { useLocationDetection } from '@/hooks/useLocationDetection';

interface SaleBannerProps {}

const SaleBanner = ({}: SaleBannerProps) => {
  const { isGTA, isLoading } = useLocationDetection();
  
  // Check for test mode via URL parameter or localStorage
  const searchParams = new URLSearchParams(window.location.search);
  const forceShow = searchParams.get('showGTABanner') === 'true' || 
                    localStorage.getItem('forceGTABanner') === 'true';

  // Don't render while loading or if not in GTA (unless forced)
  if (!forceShow && (isLoading || !isGTA)) {
    return null;
  }

  // Create content items with separators - using exact requirements
  const contentItems = [{
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping Over $50 in Toronto & GTA"
  }, {
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping Over $50 in Toronto & GTA"
  }, {
    icon: <BadgePercent className="h-3 w-3 text-brand-pink mr-1 shrink-0" />,
    text: "Free Shipping Over $50 in Toronto & GTA"
  }];

  // Duplicate content multiple times for seamless infinite loop
  const duplicatedContent = [
    ...contentItems, 
    ...contentItems, 
    ...contentItems, 
    ...contentItems
  ];
  return <div className="relative z-10 w-full px-0 bg-black text-white py-3 overflow-hidden animate-slide-down" data-announcement aria-live="polite" style={{
    '--ss-slide-duration': '12s',
    '--ss-marquee-duration': '40s'
  } as React.CSSProperties}>
      <div className="flex items-center gap-8 animate-marquee" data-track>
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