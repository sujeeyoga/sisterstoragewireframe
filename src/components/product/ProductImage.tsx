
import React from "react";

interface ProductImageProps {
  color: string;
}

const ProductImage = ({ color }: ProductImageProps) => {
  return (
    <div 
      className="rounded-lg flex items-center justify-center aspect-square"
      style={{ backgroundColor: color || "#9b87f5" }}
    >
      <span className="text-white text-sm font-bold">Sister Storage</span>
    </div>
  );
};

export default ProductImage;
