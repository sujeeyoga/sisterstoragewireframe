import React from "react";

interface PromoBannerProps {
  mainText?: string;
  subText?: string;
}

const PromoBanner: React.FC<PromoBannerProps> = ({ 
  mainText = "Summer End Sale: 20% Off",
  subText = "Free Shipping $75+ • Limited Time Only"
}) => {
  return (
    <div className="promo-banner rounded-xl bg-foreground text-background text-sm px-4 py-3 flex flex-wrap items-center justify-between gap-2">
      <span className="font-semibold">{mainText}</span>
      <span className="opacity-80">{subText}</span>
    </div>
  );
};

export default PromoBanner;
