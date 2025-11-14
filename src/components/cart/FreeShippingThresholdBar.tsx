import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';

interface FreeShippingThresholdBarProps {
  cartSubtotal: number;
  isGTA: boolean;
  country: string;
  isLoading: boolean;
}

const FreeShippingThresholdBar = ({
  cartSubtotal,
  isGTA,
  country,
  isLoading,
}: FreeShippingThresholdBarProps) => {
  const THRESHOLD = 145;
  const [prevSubtotal, setPrevSubtotal] = useState(cartSubtotal);
  const [showConfetti, setShowConfetti] = useState(false);

  // Only show for non-GTA Canada or US customers
  const shouldShowBar = !isGTA && (country === 'CA' || country === 'US');

  const remaining = Math.max(0, THRESHOLD - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / THRESHOLD) * 100);
  const hasReachedThreshold = cartSubtotal >= THRESHOLD;

  useEffect(() => {
    // Trigger confetti animation when threshold is crossed
    if (hasReachedThreshold && prevSubtotal < THRESHOLD && cartSubtotal >= THRESHOLD) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setPrevSubtotal(cartSubtotal);
  }, [cartSubtotal, hasReachedThreshold, prevSubtotal, THRESHOLD]);

  if (!shouldShowBar || isLoading) return null;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-background to-secondary/20 rounded-lg border border-border/50">
      {hasReachedThreshold ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-semibold text-green-600 dark:text-green-400 animate-fade-in">
              You unlocked FREE SHIPPING! 🎉
            </span>
          </div>
          <Progress value={100} className="h-2 [&>div]:bg-green-500 dark:[&>div]:bg-green-400" />
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Spend ${remaining.toFixed(2)} more to unlock FREE SHIPPING 🚚✨
            </span>
          </div>
          <Progress 
            value={progressPercent} 
            className="h-2 [&>div]:bg-primary transition-all duration-500"
          />
          <p className="text-xs text-muted-foreground text-right">
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
