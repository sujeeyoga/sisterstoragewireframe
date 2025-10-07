import React, { useState } from "react";
import { X } from "lucide-react";

interface PromoBannerProps {
  mainText?: string;
  subText?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
  mainText = "Summer End Sale: 20% Off",
  subText = "Free Shipping $75+ • Limited Time Only"
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-brand-black text-white text-sm px-5 py-3 flex items-center justify-between gap-4" style={{ borderRadius: '0px' }}>
      <div className="flex-1 flex flex-wrap items-center justify-center gap-3">
        <span className="font-bold uppercase tracking-wider text-white">{mainText}</span>
        <span className="text-white/90 uppercase tracking-wide text-xs">{subText}</span>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-white hover:text-brand-pink transition-colors p-1"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PromoBanner;
