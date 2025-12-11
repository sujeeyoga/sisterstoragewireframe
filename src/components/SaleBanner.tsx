import React from 'react';
import { BadgePercent, Truck, Globe, Zap } from 'lucide-react';
import { useLocationDetection } from '@/hooks/useLocationDetection';

interface SaleBannerProps {}

// Regional message configuration
const REGION_MESSAGES = {
  'toronto-gta': {
    icon: BadgePercent,
    text: 'Free Shipping Over $60 in Toronto & GTA',
    iconColor: 'text-brand-pink'
  },
  'canada-wide': {
    icon: Truck,
    text: 'Canada Wide Shipping Available • $15 Flat Rate',
    iconColor: 'text-brand-pink'
  },
  'us-standard': {
    icon: Globe,
    text: 'Free Medium Box with orders over $100 🎁 • Free Shipping Over $75',
    iconColor: 'text-brand-pink'
  },
  'us-west-coast': {
    icon: Zap,
    text: 'Free Medium Box with orders over $100 🎁 • Free Shipping Over $75',
    iconColor: 'text-brand-pink'
  },
  'international': {
    icon: Globe,
    text: 'International Shipping Available • $9.99 Standard Rate',
    iconColor: 'text-brand-pink'
  }
} as const;

const SaleBanner = ({}: SaleBannerProps) => {
  const { shippingZone, isLoading } = useLocationDetection();
  
  // Check for test mode via URL parameter
  const searchParams = new URLSearchParams(window.location.search);
  const testRegion = searchParams.get('testRegion') as keyof typeof REGION_MESSAGES | null;
  const forceShow = searchParams.get('showGTABanner') === 'true' || 
                    localStorage.getItem('forceGTABanner') === 'true';

  // Determine which zone to display
  let activeZone: keyof typeof REGION_MESSAGES = 'international';
  
  if (testRegion && REGION_MESSAGES[testRegion]) {
    activeZone = testRegion;
  } else if (shippingZone) {
    activeZone = shippingZone;
  } else if (forceShow) {
    activeZone = 'toronto-gta';
  }

  // Don't render while loading and no test mode
  if (isLoading && !testRegion && !forceShow) {
    return null;
  }

  // Don't show banner for international users
  if (activeZone === 'international' && !testRegion && !forceShow) {
    return null;
  }

  const message = REGION_MESSAGES[activeZone];
  const IconComponent = message.icon;

  // Create content items with the regional message
  const contentItems = Array(3).fill({
    icon: <IconComponent className={`h-3 w-3 ${message.iconColor} mr-1 shrink-0`} />,
    text: message.text
  });

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