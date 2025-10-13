import React, { useState, useEffect } from "react";
import { MapPin, X, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const LocationDiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isInGTA, setIsInGTA] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check if user has already checked location
  useEffect(() => {
    const hasChecked = localStorage.getItem('location-checked');
    if (hasChecked) {
      setIsVisible(false);
    }
  }, []);

  const checkIfInGTA = (lat: number, lng: number): boolean => {
    // GTA boundaries (approximate)
    // Toronto core: lat 43.6-43.9, lng -79.6 to -79.1
    // Extended GTA: lat 43.5-44.0, lng -79.8 to -78.8
    const isInBounds = 
      lat >= 43.5 && lat <= 44.0 && 
      lng >= -79.8 && lng <= -78.8;
    
    return isInBounds;
  };

  const handleCheckLocation = () => {
    setIsChecking(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsChecking(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const inGTA = checkIfInGTA(latitude, longitude);
        setIsInGTA(inGTA);
        localStorage.setItem('location-checked', 'true');
        localStorage.setItem('is-in-gta', inGTA.toString());
        
        if (inGTA) {
          toast.success("Great news! You qualify for FREE shipping over $50!");
        } else {
          toast.info("Standard shipping rates apply to your location");
        }
        
        setIsChecking(false);
        
        // Hide banner after 5 seconds
        setTimeout(() => setIsVisible(false), 5000);
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to access your location. Please check your browser settings.");
        setIsChecking(false);
        localStorage.setItem('location-checked', 'true');
      }
    );
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('location-checked', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="bg-gradient-to-r from-[hsl(var(--brand-pink))] to-purple-500 text-white py-3 px-4 shadow-lg">
        <div className="container-custom flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Truck className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1">
              {isInGTA === null ? (
                <p className="text-sm font-medium">
                  📍 Enable location to see if you qualify for <span className="font-bold">FREE SHIPPING</span> over $50!
                </p>
              ) : isInGTA ? (
                <p className="text-sm font-medium">
                  🎉 You're in the GTA! Enjoy <span className="font-bold">FREE SHIPPING</span> on orders over $50!
                </p>
              ) : (
                <p className="text-sm font-medium">
                  Standard shipping rates apply to your location
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isInGTA === null && (
              <Button
                onClick={handleCheckLocation}
                disabled={isChecking}
                size="sm"
                className="bg-white text-[hsl(var(--brand-pink))] hover:bg-white/90 font-semibold"
              >
                <MapPin className="h-4 w-4 mr-1" />
                {isChecking ? "Checking..." : "Check Location"}
              </Button>
            )}
            
            <button
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 rounded p-1 transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDiscountBanner;
