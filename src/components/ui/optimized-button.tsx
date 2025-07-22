import React, { forwardRef, useState, useCallback } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const optimizedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-wide ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // Brand variants with exact specifications
        pink: "bg-[hsl(var(--brand-pink))] text-white hover:bg-[hsl(var(--brand-pink))]/90 hover:shadow-lg hover:shadow-pink-500/25 border-0",
        orange: "bg-[hsl(var(--brand-orange))] text-white hover:bg-[hsl(var(--brand-orange))]/90 hover:shadow-lg hover:shadow-orange-500/25",
        peach: "bg-[hsl(var(--brand-peach))] text-[hsl(var(--brand-black))] hover:bg-[hsl(var(--brand-peach))]/90",
        gold: "bg-[hsl(var(--brand-gold))] text-white hover:bg-[hsl(var(--brand-gold))]/90 hover:shadow-lg hover:shadow-yellow-500/25",
        
        // Ghost variants
        "pink-ghost": "text-[hsl(var(--brand-pink))] hover:bg-[hsl(var(--brand-pink))]/10 hover:text-[hsl(var(--brand-pink))]",
        "orange-ghost": "text-[hsl(var(--brand-orange))] hover:bg-[hsl(var(--brand-orange))]/10 hover:text-[hsl(var(--brand-orange))]",
        
        // Premium variant
        premium: "bg-gradient-to-r from-[hsl(var(--brand-pink))] to-[hsl(var(--brand-orange))] text-white hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.02] border-0",
        
        disabled: "bg-muted text-muted-foreground cursor-not-allowed opacity-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        full: "w-full h-12 text-base",
      },
      animation: {
        none: "",
        bounce: "hover:animate-scale-bounce",
        pulse: "hover:animate-pulse",
        slide: "hover:animate-slide-in-elegant",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
);

export interface OptimizedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof optimizedButtonVariants> {
  asChild?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

const OptimizedButton = forwardRef<HTMLButtonElement, OptimizedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    iconLeft, 
    iconRight, 
    loading = false,
    loadingText = "Loading...",
    disabled,
    children,
    onClick,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = useState(false);

    // Handle active state for better UX
    const handleMouseDown = useCallback(() => {
      setIsPressed(true);
    }, []);

    const handleMouseUp = useCallback(() => {
      setIsPressed(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setIsPressed(false);
    }, []);

    // Override variant if disabled or loading
    const finalVariant = (disabled || loading) ? "disabled" : variant;
    const isDisabled = disabled || loading;

    const Comp = asChild ? Slot : "button";
    
    return (
      <Comp
        className={cn(
          optimizedButtonVariants({ variant: finalVariant, size, animation }),
          isPressed && !isDisabled && "scale-[0.96]",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        onClick={loading ? undefined : onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            {iconLeft && <span className="shrink-0">{iconLeft}</span>}
            {children}
            {iconRight && <span className="shrink-0">{iconRight}</span>}
          </>
        )}
      </Comp>
    );
  }
);

OptimizedButton.displayName = "OptimizedButton";

export { OptimizedButton, optimizedButtonVariants };