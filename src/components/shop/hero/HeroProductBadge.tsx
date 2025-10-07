import React from "react";

interface HeroProductBadgeProps {
  badge: string;
}

const HeroProductBadge: React.FC<HeroProductBadgeProps> = ({ badge }) => {
  return (
    <div 
      className="absolute top-4 left-4 bg-brand-pink text-white text-xs font-bold uppercase px-4 py-2 shadow-md z-10" 
      style={{ borderRadius: '0px' }}
    >
      {badge}
    </div>
  );
};

export default HeroProductBadge;
