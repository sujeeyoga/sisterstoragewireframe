import { useMemo } from 'react';
import { Truck } from 'lucide-react';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';

interface FreeShippingCartIndicatorProps {
  cartSubtotal: number;
  isGTA: boolean;
  country: string;
  isLoading: boolean;
}

const FreeShippingCartIndicator = ({
  cartSubtotal,
  isGTA,
  country,
  isLoading
}: FreeShippingCartIndicatorProps) => {
  const threshold = useMemo(() => {
    if (country === 'CA') return 145;
    if (country === 'US') return 199;
    return null;
  }, [country]);

  const remaining = useMemo(() => {
    if (threshold === null) return null;
    return Math.max(0, threshold - cartSubtotal);
  }, [threshold, cartSubtotal]);

  const animatedRemaining = useAnimatedNumber(remaining || 0, 400);

  // Don't show if loading, empty cart, or not eligible
  if (isLoading || cartSubtotal === 0 || threshold === null) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center gap-2 animate-fade-in">
      {remaining > 0 ? (
        <>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              ${animatedRemaining.toFixed(2)}
            </span>
            <span className="text-[10px] font-medium text-emerald-600/70 dark:text-emerald-400/70 -mt-1">
              to FREE SHIPPING
            </span>
          </div>
          <Truck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </>
      ) : (
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold text-sm">
          FREE SHIPPING! 🎉
        </span>
      )}
    </div>
  );
};

export default FreeShippingCartIndicator;
