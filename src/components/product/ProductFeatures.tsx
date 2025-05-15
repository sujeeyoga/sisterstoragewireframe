
import React from "react";

interface ProductFeaturesProps {
  features: string[];
}

const ProductFeatures = ({ features }: ProductFeaturesProps) => {
  if (!features || features.length === 0) return null;
  
  return (
    <div className="mb-5">
      <h3 className="text-xs font-semibold mb-2">Features:</h3>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <span className="text-purple-600 mr-2 flex-shrink-0">✓</span>
            <span className="text-xs">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductFeatures;
