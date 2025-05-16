
import React from "react";
import { motion } from "framer-motion";

interface FlowchartItemProps {
  title: string;
  description: string;
  color: string;
  index: number;
  isLast: boolean;
}

const FlowchartItem: React.FC<FlowchartItemProps> = ({
  title,
  description,
  color,
  index,
  isLast
}) => {
  return (
    <div className="mb-16 relative">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-[22px] top-[48px] h-[calc(100%+32px)] w-[2px] bg-gray-200" />
      )}
      
      <div className="flex items-start gap-6">
        {/* Circle dot */}
        <div className={`${color} h-11 w-11 rounded-full flex items-center justify-center flex-shrink-0 z-10 border-2 border-white shadow-md`}>
          <span className="text-[#E90064] font-bold">{index + 1}</span>
        </div>
        
        {/* Content */}
        <div className={`${index % 2 === 0 ? 'md:ml-4' : 'md:ml-8'} flex-1`}>
          <div className={`p-6 rounded-lg shadow-sm ${color} hover:shadow-md transition-shadow`}>
            <h3 className="text-xl md:text-2xl font-bold mb-2">{title}</h3>
            <p className="text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartItem;
