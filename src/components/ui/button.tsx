
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold uppercase transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-black text-white hover:bg-[#FF8021] hover:scale-[1.03] active:scale-[0.98]",
        "primary-inverse": "bg-white text-black border border-black hover:bg-[#FF8021] hover:text-white hover:border-[#FF8021] hover:scale-[1.03] active:scale-[0.98]",
        secondary: "bg-transparent text-[#E90064] border border-[#E90064] hover:bg-[#E90064] hover:text-white active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        disabled: "bg-[#F4F4F4] text-[#B8B0A8] cursor-not-allowed",
        // New brand variants
        pink: "bg-[#E90064] text-white hover:bg-[#FE5FA4] hover:scale-[1.03] active:scale-[0.98]",
        orange: "bg-[#FF8021] text-white hover:bg-[#FFA51E] hover:scale-[1.03] active:scale-[0.98]",
        peach: "bg-[#FFDCBD] text-gray-800 hover:bg-[#FFCBA4] hover:scale-[1.03] active:scale-[0.98]",
        gold: "bg-[#FFA51E] text-white hover:bg-[#FFB84D] hover:scale-[1.03] active:scale-[0.98]",
        // Ghost variants
        "ghost-pink": "bg-transparent text-[#E90064] hover:bg-[#E90064] hover:text-white active:scale-[0.98]",
        "ghost-orange": "bg-transparent text-[#FF8021] hover:bg-[#FF8021] hover:text-white active:scale-[0.98]",
        "ghost-black": "bg-transparent text-black hover:bg-black hover:text-white active:scale-[0.98]",
        // Enhanced Buy variant - modern, responsive, with animations
        buy: "bg-white text-black border-2 border-black rounded-md font-bold uppercase tracking-wide shadow-lg hover:bg-black hover:text-white hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out w-full sm:w-auto",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-8 px-4 py-2",
        lg: "h-12 px-8 py-4",
        icon: "h-10 w-10",
        full: "w-full h-12 px-8 py-4",
        buy: "h-12 px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, iconLeft, iconRight, children, ...props }, ref) => {
    // Use the disabled variant if the button is disabled
    const buttonVariant = disabled ? "disabled" : variant;
    
    const Comp = asChild ? Slot : "button"
    
    // If using asChild, we cannot have iconLeft or iconRight as they would create multiple children
    // In this case, the child component should handle its own icons
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant: buttonVariant, size, className }))}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </Comp>
      )
    }
    
    // Normal button with potential icons
    return (
      <Comp
        className={cn(buttonVariants({ variant: buttonVariant, size, className }))}
        ref={ref}
        disabled={disabled}
        {...props}
      >
        {iconLeft && <span className="flex items-center">{iconLeft}</span>}
        {children}
        {iconRight && <span className="flex items-center">{iconRight}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
