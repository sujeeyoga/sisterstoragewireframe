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
  const THRESHOLD = 289;
  const [prevSubtotal, setPrevSubtotal] = useState(cartSubtotal);
  const [showConfetti, setShowConfetti] = useState(false);
  const [estimatedShipping, setEstimatedShipping] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Only show for Canada or US customers
  const shouldShowBar = country === 'CA' || country === 'US';

  const remaining = Math.max(0, THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / THRESHOLD) * 100);
  const hasReachedThreshold = cartSubtotal >= THRESHOLD;

  // Calculate shipping estimate
  useEffect(() => {
    if (!city || !region || !country || cartItems.length === 0) {
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
  }, [cartSubtotal, cartItems, city, region, country, postalCode, calculateShipping]);

  useEffect(() => {
    // Trigger confetti animation when threshold is crossed
    if (hasReachedThreshold && prevSubtotal < THRESHOLD && cartSubtotal >= THRESHOLD) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setPrevSubtotal(cartSubtotal);
  }, [cartSubtotal, hasReachedThreshold, prevSubtotal, THRESHOLD]);

  // Don't show bar if not applicable or still loading location
  if (isLoading) return null;
  if (!shouldShowBar) return null;

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
          <Progress value={100} className="h-1.5 bg-white [&>div]:bg-[hsl(var(--brand-pink))]" />
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
