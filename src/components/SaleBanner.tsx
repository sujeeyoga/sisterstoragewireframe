
import React from 'react';
import { BadgePercent } from 'lucide-react';

const SaleBanner = () => {
  return (
    <div className="w-full bg-[#FF8021] overflow-hidden py-3 relative z-50">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Repeat the content multiple times to create a seamless scroll effect */}
        {[...Array(10)].map((_, index) => (
          <div 
            key={index} 
            className="flex items-center mx-4"
          >
            <BadgePercent className="h-5 w-5 text-white mr-2" />
            <span className="font-semibold text-white uppercase">
              Spring Summer Sale - 20% Off Storewide
            </span>
            <span className="mx-3 text-white">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaleBanner;
