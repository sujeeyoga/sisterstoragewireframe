import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { useShippingZones } from '@/hooks/useShippingZones';
import { CartItem } from '@/contexts/CartContext';

interface FreeShippingThresholdBarProps {
  cartSubtotal: number;
  isGTA: boolean;
  country: string;
  isLoading: boolean;
  cartItems: CartItem[];
  city: string;
  region: string;
  postalCode: string;
}

const FreeShippingThresholdBar = ({
  cartSubtotal,
  isGTA,
  country,
  isLoading,
  cartItems,
  city,
  region,
  postalCode
}: FreeShippingThresholdBarProps) => {
  const { calculateShipping } = useShippingZones();
  const [threshold, setThreshold] = useState<number | null>(null);
  const [prevSubtotal, setPrevSubtotal] = useState(cartSubtotal);
  const [showConfetti, setShowConfetti] = useState(false);
  const [estimatedShipping, setEstimatedShipping] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const remaining = threshold ? Math.max(0, threshold - cartSubtotal) : 0;
  const progressPercent = threshold ? Math.min(100, (cartSubtotal / threshold) * 100) : 0;
  const hasReachedThreshold = threshold ? cartSubtotal >= threshold : false;

  // Calculate shipping estimate and free shipping threshold
  useEffect(() => {
    if (cartItems.length === 0) {
      setEstimatedShipping(null);
      setThreshold(null);
      return;
    }

    // If location is unknown, use fallback threshold
    if (!city || !region || !country) {
      setThreshold(60); // Default GTA threshold
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

        // Extract free shipping threshold from the matched zone's rates
        if (result?.rates && result.rates.length > 0) {
          const rateWithThreshold = result.rates.find((r: any) => r.free_threshold !== null);
          if (rateWithThreshold?.free_threshold) {
            setThreshold(rateWithThreshold.free_threshold);
          }
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
  }, [cartSubtotal, cartItems, city, region, country, postalCode, calculateShipping]);

  useEffect(() => {
    // Trigger confetti animation when threshold is crossed
    if (threshold && hasReachedThreshold && prevSubtotal < threshold && cartSubtotal >= threshold) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setPrevSubtotal(cartSubtotal);
  }, [cartSubtotal, hasReachedThreshold, prevSubtotal, threshold]);

  // Don't show bar if not applicable or still loading location
  if (isLoading || threshold === null) return null;

  return (
    <div className="mb-3 p-2 bg-gradient-to-r from-background to-secondary/20 rounded-lg border border-border/50">
      {hasReachedThreshold ? (
        <div className="space-y-1.5">
          <div className="flex flex-col items-center gap-0.5 animate-fade-in">
            {estimatedShipping !== null && !isCalculating ? (
              <>
                <span className="text-[10px] font-medium text-muted-foreground">Shipping</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs line-through text-muted-foreground">${estimatedShipping.toFixed(2)}</span>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400">FREE! 🎉</span>
                </div>
              </>
            ) : (
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                You unlocked FREE SHIPPING! 🎉
              </span>
            )}
          </div>
          <Progress value={100} className="h-1.5 bg-white [&>div]:bg-green-500" />
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">
              Spend ${remaining.toFixed(2)} more for FREE SHIPPING 🚚
            </span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-1.5 bg-white [&>div]:bg-[hsl(var(--brand-pink))] transition-all duration-500"
          />
          <p className="text-[10px] text-muted-foreground text-right">
            {progressPercent.toFixed(0)}% to free shipping
          </p>
        </div>
      )}
      
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-fade-in">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 10}px`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              >
                ✨
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FreeShippingThresholdBar;
