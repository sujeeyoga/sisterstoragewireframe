import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Instagram, ShoppingCart } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { items } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show if already shown this session or no items in cart
    if (hasShown || items.length === 0) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect when mouse leaves from top of viewport (user navigating away)
      if (e.clientY <= 0 && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem("exit_intent_shown");
    if (alreadyShown) {
      setHasShown(true);
      return;
    }

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown, items.length]);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  const handleInstagram = () => {
    window.open("https://www.instagram.com/sister.storage/", "_blank");
    setIsOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col items-center text-center space-y-6 py-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Wait! Don't Leave Yet
            </h2>
            <p className="text-muted-foreground">
              You have {items.length} item{items.length > 1 ? "s" : ""} in your cart
            </p>
          </div>

          <div className="w-full space-y-3">
            <Button
              onClick={handleCheckout}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Complete Your Order
            </Button>

            <Button
              onClick={handleInstagram}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Instagram className="w-4 h-4 mr-2" />
              Follow Us for Flash Sales
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Follow @sister.storage on Instagram for exclusive flash sales and updates!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
