import { useMemo, useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { useShippingZones } from '@/hooks/useShippingZones';
import { CartItem } from '@/contexts/CartContext';

interface FreeShippingCartIndicatorProps {
  cartSubtotal: number;
  isGTA: boolean;
  country: string;
  isLoading: boolean;
  cartItems: CartItem[];
  city: string;
  region: string;
  postalCode: string;
}

const FreeShippingCartIndicator = ({
  cartSubtotal,
  isGTA,
  country,
  isLoading,
  cartItems,
  city,
  region,
  postalCode
}: FreeShippingCartIndicatorProps) => {
  const { calculateShipping } = useShippingZones();
  const [estimatedShipping, setEstimatedShipping] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const threshold = useMemo(() => {
    if (country === 'CA') return 289;
    if (country === 'US') return 289;
    return null;
  }, [country]);

  const remaining = useMemo(() => {
    if (threshold === null) return null;
    return Math.max(0, threshold - cartSubtotal);
  }, [threshold, cartSubtotal]);

  const animatedRemaining = useAnimatedNumber(remaining || 0, 400);

  // Calculate shipping estimate
  useEffect(() => {
    if (!city || !region || !country || cartItems.length === 0 || !remaining || remaining === 0) {
      setEstimatedShipping(null);
      return;
    }

    const calculate = async () => {
      setIsCalculating(true);
      try {
        const result = await calculateShipping(
          { city, province: region, country, postalCode },
          cartSubtotal,
          cartItems
        );
        
        if (result?.appliedRate) {
          setEstimatedShipping(result.appliedRate.rate_amount);
        }
      } catch (error) {
        console.error('Failed to calculate shipping:', error);
        setEstimatedShipping(null);
      } finally {
        setIsCalculating(false);
      }
    };

    const debounceTimer = setTimeout(calculate, 500);
    return () => clearTimeout(debounceTimer);
  }, [cartSubtotal, cartItems, city, region, country, postalCode, remaining, calculateShipping]);

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
            <div className="flex flex-col items-end -mt-1">
              <span className="text-[10px] font-medium text-emerald-600/70 dark:text-emerald-400/70">
                to FREE SHIPPING
              </span>
              {estimatedShipping !== null && !isCalculating && (
                <span className="text-[9px] font-medium text-emerald-600/60 dark:text-emerald-400/60">
                  (or ${estimatedShipping.toFixed(2)} shipping)
                </span>
              )}
              {isCalculating && (
                <span className="text-[9px] font-medium text-emerald-600/60 dark:text-emerald-400/60">
                  (calculating...)
                </span>
              )}
            </div>
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
