import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { Tag, X } from 'lucide-react';
import { useState } from 'react';

export function DiscountBanner() {
  const { discount, isLoading } = useStoreDiscount();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading || !discount?.enabled || isDismissed) {
    return null;
  }

  const message = `🎉 ${discount.name} - ${discount.percentage}% OFF Everything! • Discount applied at checkout •`;

  return (
    <div className="bg-black text-white py-2 px-4 relative overflow-hidden">
      <div className="relative">
        {/* Scrolling text container */}
        <div className="flex animate-banner-scroll whitespace-nowrap">
          {/* Duplicate the message multiple times for seamless loop */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-8">
              <Tag className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-sm">
                {message}
              </span>
            </div>
          ))}
        </div>
        
        {/* Close button */}
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors z-10 bg-black/50"
          aria-label="Dismiss banner"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
