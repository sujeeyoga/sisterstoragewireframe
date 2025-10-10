import { useStoreDiscount } from '@/hooks/useStoreDiscount';
import { Tag, X } from 'lucide-react';
import { useState } from 'react';

export function DiscountBanner() {
  const { discount, isLoading } = useStoreDiscount();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading || !discount?.enabled || isDismissed) {
    return null;
  }

  return (
    <div className="bg-black text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
        <Tag className="h-5 w-5 animate-pulse" />
        <p className="font-semibold">
          🎉 {discount.name} - {discount.percentage}% OFF Everything!
        </p>
        <span className="text-sm opacity-90">
          Discount applied at checkout
        </span>
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
