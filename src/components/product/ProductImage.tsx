import React, { useState } from "react";
import PerformanceImage from "@/components/ui/performance-image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ProductImageProps {
  images?: string[];
  color: string;
  name: string;
}

const ProductImage = ({ images, color, name }: ProductImageProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => ({ ...prev, [index]: true }));
  };

  if (!images || images.length === 0) {
    return (
      <div 
        className="rounded-[3rem] flex items-center justify-center aspect-square"
        style={{ backgroundColor: color || "#9b87f5" }}
      >
        <span className="text-white text-sm font-bold">Sister Storage</span>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div 
          className="rounded-[3rem] overflow-hidden aspect-square relative cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          {!loadedImages[selectedImage] && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          <PerformanceImage 
            src={images[selectedImage]} 
            alt={`${name} - Image ${selectedImage + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="eager"
            onLoad={() => handleImageLoad(selectedImage)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-semibold">
              Click to enlarge
            </span>
          </div>
        </div>
      
      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`rounded-[1.5rem] overflow-hidden aspect-square border-2 transition-all relative ${
                selectedImage === index 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {!loadedImages[index] && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
              )}
              <PerformanceImage 
                src={image} 
                alt={`${name} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onLoad={() => handleImageLoad(index)}
              />
            </button>
          ))}
        </div>
      )}
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="w-full h-full flex items-center justify-center p-8">
            <img
              src={images[selectedImage]}
              alt={`${name} - Full size`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-full">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    selectedImage === index ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductImage;
