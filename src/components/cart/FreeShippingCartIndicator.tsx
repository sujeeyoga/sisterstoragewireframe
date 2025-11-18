import { useMemo } from 'react';
import { Truck } from 'lucide-react';

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

  // Don't show if loading, empty cart, or not eligible
  if (isLoading || cartSubtotal === 0 || threshold === null) {
    return null;
  }

  return (
    <div className="hidden md:flex items-center gap-1 text-xs font-semibold animate-fade-in">
      {remaining > 0 ? (
        <>
          <span className="text-emerald-600 dark:text-emerald-400">
            ${remaining.toFixed(2)} to
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            FREE SHIPPING <Truck className="w-3 h-3" />
          </span>
        </>
      ) : (
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
          FREE SHIPPING! 🎉
        </span>
      )}
    </div>
  );
};

export default FreeShippingCartIndicator;
