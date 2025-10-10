import React, { useState } from "react";
import PerformanceImage from "@/components/ui/performance-image";

interface ProductImageProps {
  images?: string[];
  color: string;
  name: string;
}

const ProductImage = ({ images, color, name }: ProductImageProps) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div 
        className="rounded-3xl flex items-center justify-center aspect-square"
        style={{ backgroundColor: color || "#9b87f5" }}
      >
        <span className="text-white text-sm font-bold">Sister Storage</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="rounded-3xl overflow-hidden aspect-square">
        <PerformanceImage 
          src={images[selectedImage]} 
          alt={`${name} - Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
      
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`rounded-2xl overflow-hidden aspect-square border-2 transition-all ${
                selectedImage === index 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <PerformanceImage 
                src={image} 
                alt={`${name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
