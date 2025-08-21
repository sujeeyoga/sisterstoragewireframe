import { useState, useEffect } from 'react';

interface RotatingImageGalleryProps {
  images: string[];
  interval?: number;
  className?: string;
}

const RotatingImageGallery = ({ 
  images, 
  interval = 4000, 
  className = "" 
}: RotatingImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) return null;

  return (
    <div className={`relative ${className}`}>
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Sister brand organization solution ${index + 1}`}
          className={`w-full h-auto transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          } ${index !== currentIndex ? 'absolute inset-0' : ''}`}
          loading={index === 0 ? 'eager' : 'lazy'}
        />
      ))}
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingImageGallery;