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
    <div className="promo-banner bg-brand-black text-white text-sm px-5 py-4 flex flex-wrap items-center justify-center md:justify-between gap-3" style={{ borderRadius: '0px' }}>
      <span className="font-bold uppercase tracking-wider text-brand-orange">{mainText}</span>
      <span className="opacity-90 uppercase tracking-wide text-xs">{subText}</span>
    </div>
  );
};

export default PromoBanner;
